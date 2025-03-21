import { useEffect, useState } from "react";
import { Button, Card, Col, ListGroup, Modal, Row, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useAuth } from "../../Provider/authProvider";
import { FileDto } from "../../dtos/FileDto";
import fileService from "../../services/fileService";
import { FilePair } from "../../interfaces/FilePair";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { addFile } from "../../store/userFilesSlice";
import FileIcon from "./FileIcon";

interface UploadFileModalProps {
    usedFilesIds?: number[];
    showModal: boolean;
    onClose(): void;
}
const UploadFileModal: React.FC<UploadFileModalProps> = ({
    usedFilesIds,
    showModal,
    onClose
}) => {
    const dispatch = useDispatch()

    const filesSaved = useSelector((state: RootState) => state.files.filePairs); // Ensure 'files' matches store key

    const [fileDisplayMode, setFileDisplayMode] = useState(1); // 1 - Lista, 2 - Siatka    

    const [files, setFiles] = useState<FilePair[]>([]);
    const userId = useAuth().user?.id;
    
    const isMediaFile = (type: string) => {
        return type.startsWith("image/") || type.startsWith("video/");
    };

    useEffect(() => {
        if (userId)
            getAllOwnedFiles(userId)
            shouldFetchFileData();
    }, []);

    useEffect(() => {{
        setShow(showModal);
    }}, [showModal]);
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false) 
        onClose()
    };

    const shouldFetchFileData = async () => {
        console.log("userId", userId);
        console.log("files", files.length);
        console.log("filesSaved", filesSaved.length);

        if (files.length > 0) {
            const updatedFiles = await Promise.all(
                files.map(async (item) => {
                    const savedFile = filesSaved.find(saved => saved.fileDto.id === item.fileDto.id);

                    if (savedFile?.file) {
                        return { ...item, file: savedFile.file };
                    } 
                    else if (!item.file && isMediaFile(item.fileDto.type ?? "")) {
                        const downloadedFile = await getFileData(item.fileDto);
                        
                        if (downloadedFile) {
                            const newFilePair = { file: downloadedFile, fileDto: item.fileDto };
                            console.log("newFilePair", newFilePair);
                            dispatch(addFile(newFilePair));  
                            return newFilePair;
                        }
                    }
                    
                    return item;
                })
            );
            setFiles(updatedFiles);
        }
    };

    const shortedFileName =  (name: string, limit: number = 64) => {
        if (name.length > limit) {
            return name.slice(0, limit) + "...";
        }
        return name;
    }

    const getAllOwnedFiles = async (userId: string) => {
        await fileService.getAllOwnedFiles(userId).then((data) => 
        {
            setFiles(data.map(fileDto => ({file: undefined, fileDto})));
        }).catch((error) => {    

        })
    }

    const getFileData = async (fileDto: FileDto): Promise<File | null> => {
        try {
            const data = await fileService.downloadFile(fileDto.id);
            return data as File;
        } catch (error) {
            console.error("File download error:", error);
            return null;
        }
    };
    

    return (
        <>
        <Modal show={show} onHide={handleClose} animation={true} size="xl" centered>
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Upload Files</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <Row className="m-0 p-0">
                <Col xs="3">
                    <div className="mt-2 mb-2">
                    <ListGroup className="border-0 text-start" defaultActiveKey="#yourFiles" >
                        <ListGroup.Item action href="#yourFiles" className="border-0">
                            Your files
                        </ListGroup.Item>
                        <ListGroup.Item action href="#uploadFile" className="border-0">
                            Upload file
                        </ListGroup.Item>
                    </ListGroup>
                    </div>
                </Col>
                <Col xs="9">
                    <div className="mt-2 mb-2 d-flex justify-content-end fileUploadBackground w-100">
                        <ToggleButtonGroup 
                            type="radio" 
                            name={`fileDisplayOptions-${Math.random()}}`}
                            defaultValue={1} 
                            className='gap-0 mt-0' 
                            style={{display: 'inline'}}
                            // onChange={handleFileDisplayChange}
                        >
                            <ToggleButton variant="outline-secondary" id={`tbg-radio-1-${Math.random()}`} value={1}>
                                <i className="bi bi-list-ul"></i>                                        
                            </ToggleButton>
                            <ToggleButton variant="outline-secondary" id={`tbg-radio-2-${Math.random()}`} value={2}>
                                <i className="bi bi-grid-3x3"></i>                                        
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    {fileDisplayMode === 1 ? (
                        <div // onDragOver={(e) => onDragOver(e)}
                         >
                            <ul className="list-group mb-2">
                                {files.map((item, index) => (
                                    <li className="list-group-item" key={index}>
                                        <Row>
                                            <Col className='text-start' xs={8}>
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input me-2" 
                                                    // onChange={() => handleCheckboxChangeFileInMaterial(item.fileDto.id)}
                                                    // checked={selectedFilesInMaterials.includes(item.fileDto.id)}
                                                    >
                                                </input>
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
                            </ul>
                        </div>
                    ) : (
                        <div className='d-flex flex-wrap gap-2' 
                        // onDragOver={(e) => onDragOver(e)}
                        >
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
                        </div>
                    )}
                </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
}
export default UploadFileModal;
