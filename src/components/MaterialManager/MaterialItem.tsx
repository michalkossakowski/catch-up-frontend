import { Alert, Button, Col, Form, InputGroup, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import fileService from '../../services/fileService';
import materialService from '../../services/materialService';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './material.module.css';
import FileIcon from './FileIcon';
import { MaterialDto } from '../../dtos/MaterialDto';
import { FileDto } from '../../dtos/FileDto';
import JSZip from "jszip";
import saveAs from 'file-saver';
import ConfirmModal from '../Modal/ConfirmModal';
import NotificationToast from '../Toast/NotificationToast';
import FileDetailsModal from './FileDetailsModal';
import UploadFileModal from './UploadFileModal';
import { useAuth } from '../../Provider/authProvider';
import { FilePair } from '../../interfaces/FilePair';
import { OnActionEnum } from '../../Enums/OnActionEnum';
import { set } from 'date-fns';
import Loading from '../Loading/Loading';

interface MaterialItemProps {
    materialId?: number;
    enableRemoveFile?: boolean;
    enableDownloadFile?: boolean;
    enableAddingFile?: boolean;
    enableEdittingMaterialName?: boolean;
    showMaterialName?: boolean;
    enableEdittingFile?: boolean;
    materialCreated?: (materialId: number) => void;
    nameTitle?: string;
    showComponent?: boolean;
}

const MaterialItem: React.FC<MaterialItemProps> = ({
    materialId,
    enableRemoveFile = false,
    enableDownloadFile = false,
    showMaterialName = true,
    enableEdittingMaterialName = false,
    enableAddingFile = false,
    enableEdittingFile = false,
    materialCreated = () => { },
    nameTitle = 'Add Content',
    showComponent = true,
}) => {
    const prevMaterialId = useRef<number | null>(null);

    const { user } = useAuth();

    const [material, setMaterial] = useState<MaterialDto | null>(null);
    const [materialName, setMaterialName] = useState('');

    const [show, setShow] = useState(true);
    const [showDropPlace, setShowDropPlace] = useState(true);
    const [open, setOpen] = useState(true);
    const [isDragActive, setIsDragActive] = useState(false)
    
    const [files, setFiles] = useState<FilePair[]>([]);
    const [filesToSend, setFilesToSend] = useState<{
        file: File;
        uploadedAt: Date;
        progress: number;
        isUploading: boolean;
    }[]>([]);

    const [selectedFilesInMaterials, setSelectedFilesInMaterials]  = useState<number[] >([]);
    const [selectedFilesNotInMaterials, setSelectedFilesNotInMaterials]  = useState<number[] >([]);
    const [anyFileSelected, setAnyFileSelected] = useState(false);

    const [fileDisplayMode, setFileDisplayMode] = useState(1); // 1 - Lista, 2 - Siatka    

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    
    const [showFileDetailsModal, setShowFileDetailsModal] = useState(false);
    const [selectedFilePair, setSelectedFilePair] = useState<FilePair | undefined>(undefined);

    const [showUploadModal, setShowUploadModal] = useState(false);

    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const [isFileInMaterial, setIsFileInMaterial] = useState(false); // true - inside material, false - outside material

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

    const getMaterial = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const materialData = await materialService.getMaterialWithFiles(id);

            const filePairs = await Promise.all(
                materialData.files?.map(async (fileDto) => {
                    try {
                        const fileData = await fileService.downloadFile(fileDto.id);
                        const file = new File([fileData], fileDto.name ?? 'unknown', { type: fileData.type });
                        return { file, fileDto };
                    } catch (error) {
                        setAlertMessage(`Error fetching file`);
                        setShowAlert(true);
                        return null;
                    }
                }) ?? [] 
            );

            const validFilePairs = filePairs.filter((fp) => fp !== null);

            setFiles(validFilePairs);

            setMaterialName(materialData.name);
            setMaterial(materialData);
        } catch (error) {
            setAlertMessage(`Error fetching material`);
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handleRefresh = (event: Event) => {
          const customEvent = event as CustomEvent<{ materialId: number }>;
          if (customEvent.detail.materialId === materialId) {
            getMaterial(materialId);
          }
        };
   
        document.addEventListener('refreshMaterial', handleRefresh);
   
        if (materialId !== prevMaterialId.current && materialId) {
            getMaterial(materialId);
            prevMaterialId.current = materialId;
        }
   
        return () => {
          document.removeEventListener('refreshMaterial', handleRefresh);
        };
    }, [materialId, getMaterial]);
   
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
            progress: 0,
            isUploading: false
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
          const uniqueName = `${index}-${fileItem.fileDto.name ?? fileItem.file?.name ?? 'unknown'}`;
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
    
    const onClickUploadModal = () => {
        setShowUploadModal(true);
    }
    
    const onClickSave = () => {
        if (material) {
            if (materialName !== material.name && materialId) {
                material.name = materialName;
                materialService.editMaterial(materialId, material.name)
                .catch((error) => {
                    setAlertMessage(`Error updating material: ${error}`);
                    setShowAlert(true);
                });
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
            .catch((error) => {
                setAlertMessage(`Error creating material: ${error}`);
                setShowAlert(true);
            });
        }
    }
    
    const onLeftClickFilePair = (filePair: FilePair) => {
        setIsFileInMaterial(true);
        setSelectedFilePair(filePair);
        setShowFileDetailsModal(true);
    }
    
    const onLeftClickFile = (file: File, date:Date, index: number) => {
        setIsFileInMaterial(false);
        const filePair: FilePair = {
            fileDto: { id: index, name: file.name, type: file.type, dateOfUpload: date, sizeInBytes: file.size, owner: user?.id  },
            file: file,
        };
        
        setSelectedFilePair(filePair);
        setShowFileDetailsModal(true);
    }

    const updateMaterial = async (material: MaterialDto) => {
        const uploadPromises = filesToSend.map(async (fileItem) => {
            // Set initial state for this file
            setFilesToSend(prev => prev.map(f => 
                f.file === fileItem.file ? { ...f, isUploading: true } : f
            ));

            const fileDto = await handleFileUpload(
                fileItem.file,
                fileItem.uploadedAt,
                material,
                (percent) => {
                    // Update progress for this specific file
                    setFilesToSend(prev => prev.map(f => 
                        f.file === fileItem.file ? { ...f, progress: percent } : f
                    ));
                }
            );
            
            material.files?.push(fileDto);
            return { file: fileItem.file, fileDto };
        });

        try {
            const uploadedFiles = await Promise.all(uploadPromises);
            setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
            setFilesToSend([]); // Clear after all uploads complete
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const handleFileUpload = async (
        file: File,
        dateOfUpload: Date,
        material?: MaterialDto,
        onProgress?: (percent: number) => void
    ): Promise<FileDto> => {
        const response = await fileService.uploadFile(
            file,
            material?.id || materialId,
            user?.id ?? "",
            dateOfUpload,
            onProgress
        );
        return response.fileDto;
    };

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

    const onAction = (action: OnActionEnum, object: any, fileInMaterial?: boolean) => {
        switch (action) {
            case OnActionEnum.FileRemovedFromMaterial:
                if (!fileInMaterial) {
                    const index = object.index as number;
                    setFilesToSend((prevFiles) => prevFiles.filter((_, i) => i !== index));
                }
                else{
                    const fileId = object.fileId as number;
                    setFiles((prevFiles) => prevFiles.filter((file) => file.fileDto.id !== fileId));
                    if (material) {
                        material.files = material.files?.filter((file) => file.id !== fileId);
                    }
                }
                setToastMessage(`File has been removed.`);
                setShowToast(true);
                break;
            case OnActionEnum.FileAddedToMaterial:
                const filePairAdd = object.data as FilePair;
                setFiles((prevFiles) => [...prevFiles, filePairAdd]);
                setToastMessage(`File has been added.`);
                break;
            case OnActionEnum.FileEdited:
                if (!fileInMaterial) {
                    const fileInfo = object.fileNameAndIndex as  {fileName: string , index: number};
                    console.log(fileInfo)
                    if(fileInfo.fileName && fileInfo.index)
                    {
                        var fileToSend = filesToSend[fileInfo.index];
                        const updatedFile = new File([fileToSend.file], fileInfo.fileName, { type: fileToSend.file.type });
                        setFilesToSend((prevFiles) => prevFiles.map((_, i) => i === fileInfo.index ? { ...prevFiles[i], file: updatedFile } : prevFiles[i]));
                    }
                }
                else{
                    const filePairEdit = object.filePair as FilePair;
                    setFiles((prevFiles) => prevFiles.map((file) => file.fileDto.id === filePairEdit.fileDto.id ? filePairEdit : file));
                    setToastMessage(`File has been edited.`);
                }
                break;
            case OnActionEnum.UploadFiles:
                const uploadedFiles = object as File[];
                console.log(uploadedFiles)
                const uploadedFilesPairs = uploadedFiles.map((file) => ({
                    file,
                    uploadedAt: new Date(),
                    progress: 0,
                    isUploading: false,
                }));
                setFilesToSend((prevFiles) => [...prevFiles, ...uploadedFilesPairs]);
                break;
            default:
                console.warn(`Unhandled action: ${action}`);
                break;
        }
    }

    const renderFileItem = (item: typeof filesToSend[0], index: number) => (
        <li className="list-group-item striped" key={index + files.length}>
            <Row>
                <Col className='text-start d-flex align-items-center' xs={8}>
                    {enableRemoveFile && (
                        <input 
                            type="checkbox" 
                            className="form-check-input me-2"
                            onChange={() => handleCheckboxChangeFileNotInMaterial(index)}
                            checked={selectedFilesNotInMaterials.includes(index)}
                            disabled={item.isUploading}
                        />
                    )}
                    <span 
                        onClick={() => !item.isUploading && onLeftClickFile(item.file, item.uploadedAt, index)} 
                        style={{cursor: item.isUploading ? 'default' : 'pointer'}} 
                        className='flex-grow-1 d-flex align-items-center'
                    >
                        {item.isUploading ? (
                            <>
                                <progress value={item.progress} max="100" style={{width: '50%'}} />
                                <span className="ms-2">{item.progress}%</span>
                            </>
                        ) : (
                            shortedFileName(item.file.name ?? 'File not found')
                        )}
                    </span>
                </Col>
                <Col className="text-end">
                    {item.uploadedAt.toLocaleString("pl-PL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Col>
            </Row>
        </li>
    );

    const renderFileIcon = (item: typeof filesToSend[0], index: number) => (
        <span className="striped" key={index + files.length}>
            <div className="d-flex flex-column align-items-center">
                <FileIcon 
                    onClick={() => !item.isUploading && onLeftClickFile(item.file, item.uploadedAt, index)}
                    fileName={item.isUploading ? `${item.progress}%` : item.file.name}
                    fileType={item.file.type}
                    fileDate={item.uploadedAt}
                    fileContent={item.file}
                />
                {item.isUploading && (
                    <progress 
                        value={item.progress} 
                        max="100" 
                        style={{width: '80px', marginTop: '5px'}}
                    />
                )}
            </div>
        </span>
    );

    return (
        <>
        {showAlert && (
            <div className='alertBox'>
                <Alert className='alert' variant='danger'>
                    {alertMessage}
                </Alert>
            </div>
        )}
        {loading ? (
            <div className='loaderBox'>
                <Loading/>
            </div>
        ): (<>
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
                                {enableAddingFile && (<Button variant="outline-secondary" onClick={() => onClickUploadModal()}><i className="bi bi-file-earmark-arrow-up"></i></Button>)}
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
                                                <Col className='text-start d-flex align-items-center' xs={8} >
                                                    {enableRemoveFile &&  (
                                                        <input 
                                                            type="checkbox" 
                                                            className="form-check-input me-2" 
                                                            onClick={(e) => e.stopPropagation()}
                                                            onChange={() => {
                                                                handleCheckboxChangeFileInMaterial(item.fileDto.id);
                                                            }}
                                                            checked={selectedFilesInMaterials.includes(item.fileDto.id)}>
                                                        </input>
                                                    )}
                                                    <span onClick={() => onLeftClickFilePair(item)} style={{cursor: 'pointer'}} className='flex-grow-1'>
                                                        {shortedFileName(item.fileDto.name ?? 'File not found')}
                                                    </span>
                                                </Col>
                                                <Col className="text-end" onClick={() => onLeftClickFilePair(item)} style={{cursor: 'pointer'}}>
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
                                   {filesToSend.map((item, index) => renderFileItem(item, index))}
                                </ul>
                            </div>
                        ) : (
                            <div className='d-flex flex-wrap gap-2' onDragOver={(e) => onDragOver(e)}>
                                {files.map((item, index) => (
                                    <FileIcon 
                                        onClick={() => {onLeftClickFilePair(item)}}
                                        key={index} 
                                        fileName={item.fileDto.name ?? 'File not found'}  
                                        fileType={item.fileDto.type ?? 'errorType'}
                                        fileDate={item.fileDto.dateOfUpload}
                                        fileContent={item.file}
                                        >
                                    </FileIcon>
                                ))}
                                {filesToSend.map((item, index) => renderFileIcon(item, index))}
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
        </>)}
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

            <FileDetailsModal 
                showModal={showFileDetailsModal} 
                onClose={() => setShowFileDetailsModal(false)}
                materialId={materialId ?? undefined}
                filePair={selectedFilePair}
                enableAddToMaterial={false}
                enableRemoveFromMaterial={enableRemoveFile}
                enableEdit={enableEdittingFile}
                onAction={onAction}
                isFileInMaterial={isFileInMaterial}
            />
            {enableAddingFile &&
                <UploadFileModal 
                    usedFilesIds={files.map(item => item.fileDto.id)} 
                    showModal={showUploadModal} 
                    onClose={() => setShowUploadModal(false)}
                    onAction={onAction}
                    materialId={materialId}
                />
            }
        </>
      ); 
}

export default MaterialItem;