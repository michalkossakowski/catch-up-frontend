import { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row, Stack } from "react-bootstrap";
import { FilePair } from "../../interfaces/FilePair";
import { UserDto } from "../../dtos/UserDto";
import { getUserById } from "../../services/userService";
import styles from './material.module.css';
import fileService from "../../services/fileService";
import materialService from "../../services/materialService";
import { OnActionEnum } from "../../Enums/OnActionEnum";

interface FileDetailsModalProps {
    showModal: boolean;
    onClose(): void;
    onAction?(action: OnActionEnum, data?: any): void;
    filePair?: FilePair;
    materialId?: number;
    enableDownload?: boolean;
    enableDelete?: boolean;
    enableEdit?: boolean;
    enableAddToMaterial?: boolean;
    enableRemoveFromMaterial?: boolean;
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
    setShow(false)
    onClose();
  };
  const handleSave = () => {
    onAction?.(OnActionEnum.Saved, {filePair});
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
    if (!materialId || !filePair?.fileDto.id) 
    {
      return;
    }
    
    materialService.removeFile(materialId, filePair?.fileDto.id ?? 0).then(() => {
      console.log("File removed from material");
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
          <Modal.Title className="me-3">File details - {filePair?.fileDto.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack direction="horizontal" gap={2} className="mb-3">
            {enableDownload && <Button variant="secondary" onClick={() => onDownload()}>Download</Button>}
            {enableRemoveFromMaterial && <Button variant="secondary" onClick = {() => handleRemoveFromMaterial() }>Remove from material</Button>}
            {enableAddToMaterial && <Button variant="secondary">Add to material</Button>}
            {enableDelete && <Button variant="danger">Delete</Button>}
          </Stack>
          <Row className="text-start mb-2">
            <Col xs="3"><label>Name</label></Col>
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
            <Col xs="3">Owner</Col>
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
                    Twoja przeglądarka nie obsługuje elementu wideo.
                  <source src={URL.createObjectURL(filePair?.file)} type={filePair.fileDto.type} />
                </video>
              ) : 
                <i className={`${getFileIcon(filePair?.fileDto?.type)} ${styles.fileIconSize}` }></i>
              }
              </Col>
              <Col className="text-start">
                <p>Size: {getFileSize(filePair?.fileDto.sizeInBytes)}</p>
                <p>File type: {filePair?.fileDto.type}</p>
                <p>{filePair?.fileDto.dateOfUpload
                  ? new Date(filePair?.fileDto.dateOfUpload).toLocaleString("pl-PL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      })
                      : "Brak daty"}
                </p>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Stack direction="horizontal" gap={2} className="mb-3">
            {enableEdit && 
              <Button variant="secondary" onClick={handleSave}>Save Changes</Button>
            }
            <Button variant="primary" onClick={handleClose}> Close </Button>
          </Stack>
        </Modal.Footer>
      </Modal>
    </>
  )
}
export default FileDetailsModal;
