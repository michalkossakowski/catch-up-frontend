import { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row, Stack } from "react-bootstrap";
import { FilePair } from "../../interfaces/FilePair";
import { UserDto } from "../../dtos/UserDto";
import { getUserById } from "../../services/userService";
import styles from './material.module.css';
import fileService from "../../services/fileService";
import materialService from "../../services/materialService";
import { OnActionEnum } from "../../Enums/OnActionEnum";
import { t } from "i18next";

interface FileDetailsModalProps {
    showModal: boolean;
    onClose(): void;
    onAction(action: OnActionEnum, data?: any, fileInMaterial?: boolean): void;
    filePair?: FilePair;
    materialId?: number;
    enableDownload?: boolean;
    enableDelete?: boolean;
    enableEdit?: boolean;
    enableAddToMaterial?: boolean;
    enableRemoveFromMaterial?: boolean;
    isFileInMaterial?: boolean;
}
const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
    showModal,
    onClose,
    onAction,
    filePair,
    materialId,
    enableDownload = true,
    enableDelete = false,
    enableEdit = false,
    enableAddToMaterial = false,
    enableRemoveFromMaterial = false,
    isFileInMaterial = false,
}) => {
  const [show, setShow] = useState(false);
  const [owner, setOwner] = useState<UserDto>();

  const [fileName, setFileName] = useState<string>("");
  
  useEffect(() => {
    if(filePair){
      
      if (filePair.fileDto.owner) {
        getUserById(filePair.fileDto.owner).then((data) => {
          setOwner(data);
        });
      }

      setFileName(filePair.fileDto.name ?? "");
    }
  }, [filePair]);

  useEffect(() => {
    setShow(showModal);
  }, [showModal]);

  useEffect(() => {
    if (materialId === 0 || materialId === null || materialId === undefined) {
      enableRemoveFromMaterial = false;
      enableAddToMaterial = false;
    }
  }, [materialId]);

  const handleClose = () => {
    setFileName(filePair?.fileDto.name ?? "");
    setShow(false)
    onClose();
  };

  const handleSave = async () => {
    var changedFileDto = filePair?.fileDto;
    if(changedFileDto === undefined) return;
    if(changedFileDto.name === fileName) return;
    changedFileDto.name = fileName;
    if(!isFileInMaterial)
    {
      onAction(OnActionEnum.FileEdited, {fileNameAndIndex: {fileName: changedFileDto.name , index: changedFileDto.id}}, false);
      return;
    }
    fileService.changeFile(changedFileDto).then(() => {
      onAction(OnActionEnum.FileEdited, {filePair: {...filePair, fileDto: changedFileDto}}, true);
    })
  };

  const onDownload = async () => { 
    var url;
    if(!filePair?.file)
    {
      if(filePair?.fileDto.id)
        await fileService.downloadFile(filePair?.fileDto.id).then((data) => {
          url = URL.createObjectURL(data);
        }).catch((error) => {
          console.error("Failed to fetch file data:", error);
        });
    }  
    else{
      url = URL.createObjectURL(filePair.file);
    }
    const a = document.createElement('a');
    if (url) 
      a.href = url;
    else {
      console.error("URL is undefined. Cannot set href.");
      return;
    }
    a.download = `${filePair?.fileDto.name}`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  const handleRemoveFromMaterial = () => {
    if (!isFileInMaterial) {
      console.log(filePair?.fileDto.id);
      onAction(OnActionEnum.FileRemovedFromMaterial, {index: filePair?.fileDto.id}, false);
      handleClose();
      return;
    }
    if (!materialId || !filePair?.fileDto.id) 
    { return; }
    
    materialService.removeFile(materialId, filePair?.fileDto.id ?? 0).then(() => {
      onAction(OnActionEnum.FileRemovedFromMaterial, {fileId: filePair?.fileDto.id}, true);
      handleClose();
    }).catch((error) => {
      console.error("Failed to remove file from material:", error);
    });
  }

  const getFileIcon = (fileType?: string) => {    
    if (!fileType) return "bi-file-earmark"; // Domyślna ikona
    if (fileType.startsWith("image/") || fileType.startsWith("video/")) return "" // Nie pokazujemy ikon dla obrazów
    if (fileType === "application/pdf") return "bi-file-earmark-pdf"; 
    if (fileType.includes("word")) return "bi-file-earmark-word";
    if (fileType.includes("excel")) return "bi-file-earmark-excel";
    if (fileType.includes("zip")) return "bi-file-earmark-zip";
    return "bi-file-earmark"; // Domyślna ikona
  };
  const onAddToMaterial = () => {
    if (!materialId || !filePair?.fileDto.id)
    { return; }
    materialService.addFile(materialId, filePair?.fileDto.id ?? 0).then(() => {
      onAction(OnActionEnum.FileAddedToMaterial, {data: filePair});
      handleClose();
    }
    ).catch((error) => {
      console.error("Failed to add file to material:", error);
    })
  }
  const getFileSize = (size?: number) => {
    var tempSize = size;
    if (!tempSize) return "0 KB";

    tempSize = tempSize / 1024;
    if (tempSize < 1024) return tempSize.toFixed(2) + " KB";
    tempSize = tempSize / 1024;

    if  (tempSize < 1024 ) return (tempSize).toFixed(2) + " MB";

    tempSize = tempSize / 1024;
    if  (tempSize < 1024 ) return (tempSize).toFixed(2) + " GB";
  };
  return (
      <>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="me-3">{t('file-details')} {filePair?.fileDto.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack direction="horizontal" gap={2} className="mb-3">
            {enableDownload && <Button variant="secondary" onClick={() => onDownload()}>{t('download')}</Button>}
            {enableRemoveFromMaterial && <Button variant="secondary" onClick = {() => handleRemoveFromMaterial() }>{t('remove-from-material')}</Button>}
            {enableAddToMaterial && <Button variant="secondary" onClick={() => onAddToMaterial()}>{t('add-to-material')}</Button>}
            {enableDelete && <Button variant="danger">{t('delete')}</Button>}
          </Stack>
          <Row className="text-start mb-2">
            <Col xs="3"><label>{t('name')}</label></Col>
            <Col>
              {enableEdit ?(
                <input 
                  value={fileName} 
                  type="text" 
                  className="form-control" 
                  onChange={(e) => setFileName(e.target.value)}
                />              
              ):(
                <span>{filePair?.fileDto?.name ?? " "}</span>
              )}
            </Col>
          </Row>
          <Row className="text-start mb-2">
            <Col xs="3">{t('owner')}</Col>
            <Col>{owner?.name + " " +owner?.surname}</Col>
          </Row>
          <hr />
          <Container>
            <Row>
            <Col xs={5} className="text-start">

              {filePair?.fileDto.type?.startsWith("image/") && filePair?.file ? (
                <img 
                    src={URL.createObjectURL(filePair?.file)} 
                    alt={filePair?.fileDto.name} 
                    className={`${styles.imageThumbnail} rounded shadow-sm`}
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}
                />
              ):
              filePair?.fileDto.type?.startsWith("video/") && filePair?.file ? (
                <video 
                  controls 
                  className={`${styles.videoThumbnail} rounded shadow-sm`}
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  > 
                    {t('your-browser-does-not-support-the-video-element')}  
                    <source src={URL.createObjectURL(filePair?.file)} type={filePair.fileDto.type} />
                </video>
              ) : 
                <i className={`${getFileIcon(filePair?.fileDto?.type)} ${styles.fileIconSize}` }></i>
              }
              </Col>
              <Col className="text-start">
                <p>{t('size')} {getFileSize(filePair?.fileDto.sizeInBytes)}</p>
                <p>{t('file-type')} {filePair?.fileDto.type}</p>
                <p>{filePair?.fileDto.dateOfUpload
                  ? new Date(filePair?.fileDto.dateOfUpload).toLocaleString("pl-PL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      })
                      : t('undefine-date')}
                </p>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Stack direction="horizontal" gap={2} className="mb-3">
            {enableEdit && 
              <Button variant="secondary" onClick={handleSave}>{t('save-changes')}</Button>
            }
            <Button variant="primary" onClick={handleClose}>{t('close')}</Button>
          </Stack>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default FileDetailsModal;