import { Button, Col, Form, InputGroup, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import fileService from '../../services/fileService';
import materialService from '../../services/materialService';
import { useEffect, useRef, useState } from 'react';
import styles from './material.module.css';
import FileIcon from './FileIcon';
import { MaterialDto } from '../../dtos/MaterialDto';
import { FileDto } from '../../dtos/FileDto';
import JSZip from "jszip";
import saveAs from 'file-saver';
import ConfirmModal from '../Modal/ConfirmModal';
import NotificationToast from '../Toast/NotificationToast';

interface MaterialItemProps {
    materialId?: number;
    enableRemoveFile?: boolean;
    enableDownloadFile?: boolean;
    enableAddingFile?: boolean;
    enableEdittingMaterialName?: boolean;
    showMaterialName?: boolean;
    materialCreated?: (materialId: number) => void;
    nameTitle?: string;
    // enableValidation?: boolean; // It will be default material name material_date
    showComponent?: boolean;
}

const MaterialItem: React.FC<MaterialItemProps> = ({
    materialId,
    enableRemoveFile = true,
    enableDownloadFile = true,
    showMaterialName = true,
    enableEdittingMaterialName = true,
    enableAddingFile = true,
    materialCreated = () => { },
    nameTitle = 'Add Content',
    // enableValidation = true,
    showComponent = true,
}) => {
    const prevMaterialId = useRef<number | null>(null);

    const [material, setMaterial] = useState<MaterialDto | null>(null);
    const [materialName, setMaterialName] = useState('');

    const [show, setShow] = useState(true);
    const [showDropPlace, setShowDropPlace] = useState(true);
    const [open, setOpen] = useState(true);
    const [isDragActive, setIsDragActive] = useState(false)
    
    const [files, setFiles] = useState<{file: File; fileDto: FileDto}[]>([]);
    const [filesToSend, setFilesToSend] = useState<{ file: File; uploadedAt: Date }[]>([]);

    const [selectedFilesInMaterials, setSelectedFilesInMaterials]  = useState<number[] >([]);
    const [selectedFilesNotInMaterials, setSelectedFilesNotInMaterials]  = useState<number[] >([]);
    const [anyFileSelected, setAnyFileSelected] = useState(false);

    const [fileDisplayMode, setFileDisplayMode] = useState(1); // 1 - Lista, 2 - Siatka    

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    
    useEffect(() => {
        if (materialId !== prevMaterialId.current && materialId) {
            getMaterial(materialId)
            prevMaterialId.current = materialId;
        }
    }, [materialId])

    useEffect(() => {
        setShow(showComponent);
    }, [showComponent])

    useEffect(() => {
        if (filesToSend.length > 0) {
            setShowDropPlace(false);
        }
        else if(files.length > 0){
            setShowDropPlace(false)
        }
        else{
            setShowDropPlace(true)
        }
    }, [filesToSend, files, isDragActive]); 

    useEffect(() => {

        if (selectedFilesInMaterials.length === 0 && selectedFilesNotInMaterials.length === 0) {
            setAnyFileSelected(false);
        }
        else{
            setAnyFileSelected(true);
        }
    }, [selectedFilesInMaterials, selectedFilesNotInMaterials]);

    const getMaterial = async (materialId: number) => {
        try {
            const materialData = await materialService.getMaterialWithFiles(materialId)
            .then((material) => {
                material.files?.forEach((file) => {
                    getFileData(file);
                })
                setMaterialName(material.name);
                return material;
            });
            setMaterial(materialData);
        } catch (error) {
            // setErrorMessage('Material fetching error: ' + error)
            // setErrorShow(true)
        }
    }
    
    const getFileData = async (fileDto: FileDto) => {
        try {
            const fileData = await fileService.downloadFile(fileDto.id);
            if(fileDto.name){
                const file = new File([fileData], fileDto.name, { type: fileData.type });
                setFiles(prev => [...prev,  {file, fileDto}]);
            }
        } catch (error) {

        }
    }
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragActive(true)
        setShowDropPlace(true)
    }

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragActive(false)
    }

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragActive(false)
        const droppedFiles = Array.from(e.dataTransfer.files).map((file) => ({
            file,
            uploadedAt: new Date(),
        }));        
        setFilesToSend((prevFiles) => [...prevFiles, ...droppedFiles])
    }

    const onClickCancel = () => {
        setFilesToSend([])
        setMaterialName(material?.name ?? '')
    }
    const onClickDelete = () => {
        if(anyFileSelected){
            setConfirmMessage("Are you sure you want to delete files in this Material?")
            setShowConfirmModal(true);
        }
        else{
            setToastMessage("Please select files to delete")
            setShowToast(true)
        }
    }    

    const onClickDownloadAll = async () => {
        if(files.length === 0 && filesToSend.length === 0){
            setToastMessage("No files to download")
            setShowToast(true)
            return;
        }
        const zip = new JSZip();      
        files.forEach((fileItem, index) => {
          const uniqueName = `${index}-${fileItem.fileDto.name ?? fileItem.file.name}`;
          zip.file(uniqueName, fileItem.file);
        });
      
        filesToSend.forEach((fileItem, index) => {
          const uniqueName = `${fileItem.file.name}-${index}`;
          zip.file(uniqueName, fileItem.file);
        });
      
        zip.generateAsync({ type: "blob" }).then((zipFile) => {
          saveAs(zipFile, "files.zip");
        });
    };

    const onClickSave = () => {
        if (material) {
            if (materialName !== material.name && materialId) {
                material.name = materialName;
                materialService.editMaterial(materialId, material.name)
            }
            updateMaterial(material)
        }
        else{
            var tempName = materialName;
            if(materialName.length === 0){
                tempName = 'New material-' + new Date().toLocaleDateString();
                setMaterialName(tempName)
            }
            materialService.createMaterial({ name: tempName })
            .then((material) => {
                setMaterial(material);
                updateMaterial(material)
                if (material.id !== undefined) {
                    materialCreated(material.id)
                }
            })
        }
    }

    const updateMaterial = (material: MaterialDto) => {
        const uploadPromises = filesToSend.map(async (file) => {
            const fileDto = await handleFileUpload(file.file, file.uploadedAt);
            material.files?.push(fileDto);
            return { file: file.file, fileDto };
        });
    
        Promise.all(uploadPromises).then((uploadedFiles) => {
            setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
            setFilesToSend([]); 
        });
    };
    const handleFileUpload = async (file: File, dateOfUpload: Date): Promise<FileDto> => {
        const response = await fileService.uploadFile(file, materialId, undefined, dateOfUpload);
        return response.fileDto;
    }
    const handleFileDisplayChange = (value: number) => {
        setFileDisplayMode(value);
    };

    const shortedFileName =  (name: string, limit: number = 64) => {
        if (name.length > limit) {
            return name.slice(0, limit) + "...";
        }
        return name;
    }

    const handleCheckboxChangeFileInMaterial = (id: number) => {
        setSelectedFilesInMaterials((prevSelected: number[]) =>
          prevSelected.includes(id)
            ? prevSelected.filter((selectedId) => selectedId !== id)
            : [...prevSelected, id] 
        );
    };

    const handleCheckboxChangeFileNotInMaterial = (id: number) => {
        setSelectedFilesNotInMaterials((prevSelected: number[]) =>
          prevSelected.includes(id)
            ? prevSelected.filter((selectedId) => selectedId !== id)
            : [...prevSelected, id] 
        );
    };

    const handleDelete = () => {
        if(selectedFilesInMaterials.length > 0 && material && materialId){
            materialService.removeFiles(materialId, selectedFilesInMaterials).then(() => {
                setFiles((prevFiles) => prevFiles.filter((file) => !selectedFilesInMaterials.includes(file.fileDto.id)));
                material.files = material.files?.filter((file) => !selectedFilesInMaterials.includes(file.id));
            });
        }
        if(selectedFilesNotInMaterials.length > 0){
            setFilesToSend((prevFiles) => prevFiles.filter((file, index) => !selectedFilesNotInMaterials.includes(index)));
        }
        setSelectedFilesInMaterials([]);
        setSelectedFilesNotInMaterials([]);
        setShowConfirmModal(false);
    }
    return (
        <>
          {show && (
            <div> 
                <div className='d-flex align-items-center'>
                    <a  onClick={() => setOpen(!open)} className='fs-3 rounded-circle me-3'>
                        {open ? <i className="bi bi-chevron-down"></i> : <i className="bi bi-chevron-right"></i>}
                    </a>
                    <h3 className='mb-0'>{nameTitle}</h3>
                </div>
                {open && (
                    <div className='mt-3'>
                        {enableEdittingMaterialName ? (
                            <>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text >Content name</InputGroup.Text>
                                    <Form.Control
                                        value={materialName}
                                        onChange={(e) => setMaterialName(e.target.value)}
                                        placeholder="ex. My lovely content"
                                        aria-label="Content name"
                                    />
                                </InputGroup>

                            </>
                        ) : (
                            <>
                                {showMaterialName && (

                                    <>
                                        <h4>{materialName}</h4>
                                        <hr className='mb-4'/>
                                    </>
                                )}
                            </>
                        )}
                        
                        

                        <Row className='mb-3'>
                            <Col className='d-flex justify-content-start gap-2 '>
                                {enableAddingFile && (<Button variant="outline-secondary"><i className="bi bi-file-earmark-arrow-up"></i></Button>)}
                                {enableDownloadFile && ( <Button variant="outline-secondary" onClick={() => onClickDownloadAll()}><i className="bi bi-file-earmark-arrow-down"></i></Button>)}
                                {enableRemoveFile && (<Button variant="outline-secondary" onClick={() =>onClickDelete() }><i className="bi bi-file-earmark-x" ></i></Button>)}
                            </Col>
                            <Col className='d-flex justify-content-end'>
                                <ToggleButtonGroup 
                                    type="radio" 
                                    name={`fileDisplayOptions-${Math.random()}}`}
                                    defaultValue={1} 
                                    className='gap-0 mt-0' 
                                    style={{display: 'inline'}}
                                    onChange={handleFileDisplayChange}
                                >
                                    <ToggleButton variant="outline-secondary" id={`tbg-radio-1-${Math.random()}`} value={1}>
                                        <i className="bi bi-list-ul"></i>                                        
                                    </ToggleButton>
                                    <ToggleButton variant="outline-secondary" id={`tbg-radio-2-${Math.random()}`} value={2}>
                                        <i className="bi bi-grid-3x3"></i>                                        
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Col>
                        </Row>
                        {(showDropPlace && enableAddingFile)?  (
                            <div>
                                <div className={`p-3 ${styles.dropzone} text-center mb-4 ${isDragActive ? `border-warning` : ''}`}
                                        onDragOver={(e) => onDragOver(e)}
                                        onDragLeave={(e) => onDragLeave(e)}
                                        onDrop={(e) => onDrop(e)}>

                                    <div className='d-flex flex-column align-items-center'>
                                        <i className={`bi bi-box-arrow-in-down ${styles.uploadIcon} ${isDragActive ? `text-warning ${styles.uploadIconOnDrop}` : ''}`}></i>
                                        <p className="mt-2 text-body-tertiary fs-6 opacity-50 p-0 m-0">Drag and drop file here</p>
                                    </div>
                                </div>
                            </div>
                        ):
                        <>
                        {fileDisplayMode === 1 ? (
                            <div                                             
                                onDragOver={(e) => onDragOver(e)}>
                                <ul className="list-group">
                                    {files.map((item, index) => (
                                        <li className="list-group-item" key={index}>
                                            <Row>
                                                <Col className='text-start' xs={8}>
                                                    {enableRemoveFile &&  (
                                                        <input 
                                                            type="checkbox" 
                                                            className="form-check-input me-2" 
                                                            onChange={() => handleCheckboxChangeFileInMaterial(item.fileDto.id)}
                                                            checked={selectedFilesInMaterials.includes(item.fileDto.id)}>
                                                        </input>
                                                    )}
                                                    {shortedFileName(item.fileDto.name ?? 'File not found')}
                                                </Col>
                                                <Col className="text-end">
                                                {item.fileDto.dateOfUpload
                                                ? new Date(item.fileDto.dateOfUpload).toLocaleString("pl-PL", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    })
                                                    : "Brak daty"}
                                                </Col>
                                            </Row>
                                        </li>
                                    ))}
                                    {filesToSend.map((item, index) => (
                                        <li className="list-group-item" key={index+files.length}>
                                            <Row>
                                                <Col className='text-start'>
                                                {enableRemoveFile &&  (
                                                    <input 
                                                        type="checkbox" 
                                                        className="form-check-input me-2" 
                                                        onChange={() => handleCheckboxChangeFileNotInMaterial(index)}
                                                        checked={selectedFilesNotInMaterials.includes(index)}>
                                                    </input>
                                                    )}
                                                    {shortedFileName(item.file.name ?? 'File not found')}
                                                </Col>
                                                <Col className="text-end">
                                                {item.uploadedAt
                                                ? new Date(item.uploadedAt).toLocaleString("pl-PL", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    })
                                                    : "Brak daty"}
                                                </Col>                                            
                                            </Row>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className='d-flex flex-wrap gap-2' onDragOver={(e) => onDragOver(e)}>
                                {files.map((item, index) => (
                                    <FileIcon 
                                        key={index} 
                                        fileName={item.fileDto.name ?? 'File not found'}  
                                        fileType={item.fileDto.type ?? 'errorType'}
                                        fileDate={item.fileDto.dateOfUpload}
                                        fileContent={item.file}
                                        >
                                    </FileIcon>
                                ))}
                                {filesToSend.map((item, index) => (
                                    <FileIcon 
                                        key={index + files.length} 
                                        fileName={item.file.name} 
                                        fileType={item.file.type} 
                                        fileDate={item.uploadedAt}
                                        fileContent={item.file}>
                                    </FileIcon>
                                ))}
                            </div>
                        )}
                        </>
                        }
                        {(enableAddingFile && enableRemoveFile && enableEdittingMaterialName) && (
                            <div className="d-flex gap-2 mb-2">
                                <Button variant="success" type="button" className='mt-3'  onClick={() => onClickSave()}>{material?.id === undefined ? "Create" : "Save Material"}</Button>
                                <Button variant="secondary" type="reset" onClick={() => onClickCancel()} className='mt-3'>Cancel</Button>
                            </div>
                        )}
                        <hr />
                    </div>
                )}
            </div>)}

            <ConfirmModal 
                show={showConfirmModal} 
                title="Material operation confirmation"
                message={confirmMessage}
                onConfirm={handleDelete} 
                onCancel={() => setShowConfirmModal(false)} 
            />

            <NotificationToast 
                show={showToast} 
                title={"Material operation info"} 
                message={toastMessage} 
                color={"Red"} 
                onClose={() => setShowToast(false)} />
        </>
      );
}

export default MaterialItem;

