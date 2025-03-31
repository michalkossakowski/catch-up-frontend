import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, InputGroup, ListGroup, Modal, Pagination, Row, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useAuth } from "../../Provider/authProvider";
import { FileDto } from "../../dtos/FileDto";
import fileService from "../../services/fileService";
import { FilePair } from "../../interfaces/FilePair";
import FileIcon from "./FileIcon";
import { OnActionEnum } from "../../Enums/OnActionEnum";
import FileDetailsModal from "./FileDetailsModal";
import Loading from "../Loading/Loading";
import { useTranslation } from "react-i18next";

interface UploadFileModalProps {
    usedFilesIds?: number[];
    materialId?: number;
    showModal: boolean;
    onClose: () => void;
    onAction(action: OnActionEnum, data?: any): void;
}
const UploadFileModal: React.FC<UploadFileModalProps> = ({
    usedFilesIds,
    showModal,
    onClose,
    onAction,
    materialId
    
}) => {
    const { t } = useTranslation();

    const [fileDisplayMode, setFileDisplayMode] = useState(1); // 1 - Lista, 2 - Siatka    
    const [activeTab, setActiveTab] = useState("yourFiles");

    const [files, setFiles] = useState<FilePair[]>([]);
    const [filteredFiles, setFilteredFiles] = useState<FilePair[]>([]);

    const userId = useAuth().user?.id;
    
    const [showFileDetailsModal, setShowFileDetailsModal] = useState(false);
    const [selectedFilePair, setSelectedFilePair] = useState<FilePair | undefined>(undefined);

    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // const [searchText, setSearchText] = useState('');
    
    const isMediaFile = (type: string) => {
        return type.startsWith("image/") || type.startsWith("video/");
    };
    
    useEffect(() => {
        if (userId) {
            getAllOwnedFiles(userId);
        }
    }, [userId, currentPage, itemsPerPage]);

    const getAllOwnedFiles = async (userId: string) => {
        setLoading(true);
        await fileService.getAllOwnedFilesPagination(userId, currentPage, itemsPerPage).then((data) => 
        {
            setFiles(data.files.map(fileDto => ({file: undefined, fileDto})));
            setTotalItems(data.totalCount);
        })
        .catch((error) => {
            setShowAlert(true);
            setAlertMessage('Error: ' + error.message);
        })
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        if (files.length > 0) {
            shouldFetchFileData();
        }
    }, [files]);

    useEffect(() => {
        filtrVisibleFiles(files);
    }, [files, usedFilesIds]);

    useEffect(() => {{
        setShow(showModal);
    }}, [showModal]);
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false) 
        setFilesToUpload([]);
        onClose()
    };

    // const search = () => {
    //     if (searchText.length > 0) {
    //         fileService.findByQuestion(userId ?? "", searchText, currentPage, itemsPerPage).then((data) => {
    //             setFiles(data.files.map(fileDto => ({file: undefined, fileDto})));
    //             setTotalItems(data.totalCount);
    //             setCurrentPage(1);
    //         })
    //     } else {
    //         setFilteredFiles(files);
    //     }
    // }
    const shouldFetchFileData = async () => {
        const filesToFetch = files.filter(
            (item) => !item.file && isMediaFile(item.fileDto.type ?? "")
        );
    
        if (filesToFetch.length > 0) {
            const fetchedFiles = await Promise.all(
                filesToFetch.map(async (item) => {
                    const downloadedFile = await getFileData(item.fileDto);
                    return downloadedFile ? { ...item, file: downloadedFile } : item;
                })
            );
    
            setFiles((prevFiles) =>
                prevFiles.map((file) =>
                    fetchedFiles.find((f) => f.fileDto.id === file.fileDto.id) || file
                )
            );
        }
    };

    const shortedFileName =  (name: string, limit: number = 64) => {
        if (name.length > limit) {
            return name.slice(0, limit) + "...";
        }
        return name;
    }

    const handleFileDisplayChange = (value: number) => {
        setFileDisplayMode(value);
    };

    const getFileData = async (fileDto: FileDto): Promise<File | null> => {
        try {
            const data = await fileService.downloadFile(fileDto.id);
            return data as File;
        } catch (error) {
            console.error(`Error fetching file ${fileDto.id}:`, error);
            return null;
        }
    };
    const onLeftClickFile = (filePair: FilePair) => {
        setSelectedFilePair(filePair);
        setShowFileDetailsModal(true);
    }

    const filtrVisibleFiles = (files: FilePair[]) => {
        setFilteredFiles(files.filter((item) => !usedFilesIds?.includes(item.fileDto.id)));
    }


    const uploadFiles =  () => {
        onAction(OnActionEnum.UploadFiles, filesToUpload);
        handleClose();        
    }

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const renderPaginationItems =  () => {
        const items = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        if (endPage - startPage + 1 < maxVisiblePages) {
               startPage = Math.max(1, endPage - maxVisiblePages + 1);
           }
   
           if (startPage > 1) {
               items.push(
                   <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
                       1
                   </Pagination.Item>
               );
               if (startPage > 2) {
                   items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
               }
           }
   
           for (let i = startPage; i <= endPage; i++) {
               items.push(
                   <Pagination.Item
                       key={i}
                       active={i === currentPage}
                       onClick={() => handlePageChange(i)}
                   >
                       {i}
                   </Pagination.Item>
               );
           }
   
           if (endPage < totalPages) {
               if (endPage < totalPages - 1) {
                   items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
               }
               items.push(
                   <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
                       {totalPages}
                   </Pagination.Item>
               );
           }
   
           return items;
       };

    return (
        <>
        <Modal show={show} onHide={handleClose} animation={true} size="xl" centered>
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>{t('upload-files')}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <Row className="m-0 p-0">
                <Col xs="3">
                    <div className="mt-2 mb-2">
                    <ListGroup className="border-0 text-start" >
                        <ListGroup.Item action active={activeTab === "yourFiles"} className="border-0" onClick={() => setActiveTab("yourFiles")}>
                            {t('your-files')} </ListGroup.Item>
                        <ListGroup.Item action active={activeTab === "uploadFile"} className="border-0" onClick={() => setActiveTab("uploadFile")}>
                            {t('upload-files')} 
                        </ListGroup.Item>
                    </ListGroup>
                    </div>
                </Col>
                <Col xs="9">

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
                {activeTab === "yourFiles" ? (
                    <>
                        <Row className="mt-2 mb-2">
                            <Col xs={8}>
                                {/* <InputGroup className="mb-3" >
                                    <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                                    <Form.Control placeholder={t('search-file-by-names')} value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
                                    <Button variant="success" style={{ textTransform: "capitalize" }} onClick={() => search()}>
                                        {t('search')} 
                                    </Button>
                                </InputGroup> */}
                            </Col>
                            <Col className="d-flex justify-content-end">
                                <ToggleButtonGroup 
                                    type="radio" 
                                    name={`fileDisplayOptions-${Math.random()}}`}
                                    defaultValue={fileDisplayMode} 
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
                        {fileDisplayMode === 1 ? (
                            <div>
                                <ul className="list-group mb-2">
                                    {filteredFiles.map((item, index) => (
                                        <li className="list-group-item" key={index}>
                                            <Row onClick={() => {onLeftClickFile(item)}} style={{cursor: 'pointer'}}>
                                                <Col className='text-start' xs={8}>
                                                    {shortedFileName(item.fileDto.name ?? t('file-not-found'))}
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
                                                    : t('brak-daty')}
                                                </Col>
                                            </Row>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className='d-flex flex-wrap gap-2'>
                                {filteredFiles.map((item, index) => (
                                    <FileIcon 
                                        onClick={() => {onLeftClickFile(item)}}
                                        key={index} 
                                        fileName={shortedFileName(item.fileDto.name ?? t('file-not-found'), 16)}  
                                        fileType={item.fileDto.type ?? 'errorType'}
                                        fileDate={item.fileDto.dateOfUpload}
                                        fileContent={item.file}
                                        >
                                    </FileIcon>
                                ))}                    
                            </div>
                        )}
                    </>
                    ) : (
                        <div className="input-group mb-3 mt-4 d-flex justify-content-center">
                            <input 
                                type="file" 
                                className="form-control" 
                                id="inputFileUpload" 
                                aria-describedby="inputFileUpload" 
                                aria-label={t('upload-files')}
                                multiple={true}
                                onChange={(e) => { setFilesToUpload(Array.from(e.target.files ?? [])) }}
                            />
                            <button 
                                className="btn btn-success" 
                                type="button" 
                                id="inputFileUpload" 
                                disabled={filesToUpload.length <= 0}  
                                onClick={() => {uploadFiles()}}>
                                    {t('upload')} 
                            </button>
                            <button 
                                className="btn btn-danger" 
                                type="button" 
                                id="inputFileUpload" 
                                disabled={filesToUpload.length <= 0}  
                                onClick={() => {setFilesToUpload([])}}>
                                    {t('cancel')} 
                                </button>
                        </div>
                    )}
                    </>
                )}
                </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
          {totalPages > 1 &&  activeTab === "yourFiles" && (
                            <div className="d-flex justify-content-center align-items-center mt-3">
                                <Pagination className="mb-0">
                                    <Pagination.Prev
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    />
                                    {renderPaginationItems()}
                                    <Pagination.Next
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    />
                                </Pagination>
                            </div>
                        )}
            <Button variant="secondary" onClick={handleClose}>
              {t('close')} 
            </Button>
          </Modal.Footer>
        </Modal>
        <FileDetailsModal 
            showModal={showFileDetailsModal} 
            onClose={() => setShowFileDetailsModal(false)}
            materialId={materialId ?? undefined}
            filePair={selectedFilePair}
            enableAddToMaterial={true}
            enableRemoveFromMaterial={false}
            enableEdit={true}
            onAction={onAction}
        />
      </>
    )
}
export default UploadFileModal;