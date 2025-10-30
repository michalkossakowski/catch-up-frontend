import { useEffect, useState, useRef } from "react";
import { Button, Container, Modal, Row, Col, Stack } from "react-bootstrap";
import { FilePair } from "../../interfaces/FilePair";
import { UserDto } from "../../dtos/UserDto";
import { getUserById } from "../../services/userService";
import fileService from "../../services/fileService";
import styles from './material.module.scss';
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
  enableAddToMaterial?: boolean;
  enableRemoveFromMaterial?: boolean;
  isFileInMaterial?: boolean;
}

const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
  showModal,
  onClose,
  filePair,
  enableDownload = true,
}) => {
  const [show, setShow] = useState(false);
  const [owner, setOwner] = useState<UserDto>();
  const [fileUrl, setFileUrl] = useState<string>();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startOffset = useRef({ x: 0, y: 0 });

  const hasPreview =
    filePair?.fileDto.type?.startsWith("image/") ||
    filePair?.fileDto.type?.startsWith("video/") ||
    filePair?.fileDto.type === "application/pdf";

  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [filePair]);

  const getFileIcon = (fileType?: string) => {    
    if (!fileType) return "bi-file-earmark";
    if (fileType.startsWith("image/") || fileType.startsWith("video/")) return "" 
    if (fileType === "application/pdf") return "bi-file-earmark-pdf"; 
    if (fileType.includes("word")) return "bi-file-earmark-word";
    if (fileType.includes("excel")) return "bi-file-earmark-excel";
    if (fileType.includes("zip")) return "bi-file-earmark-zip";
    return "bi-file-earmark"; 
  };
  useEffect(() => {
    if (showModal && filePair) {
      if (hasPreview) {
        setShow(true);
        loadFileUrl();
      } else {
        setShowInfoModal(true);
      }
    } else {
      setShow(false);
      setShowInfoModal(false);
    }
  }, [showModal, filePair]);

  const loadFileUrl = async () => {
    try {
      if (!filePair) return;
      let url: string;
      if (!filePair.file && filePair.fileDto.id) {
        const data = await fileService.downloadFile(filePair.fileDto.id);
        url = URL.createObjectURL(data);
      } else if (filePair.file) {
        url = URL.createObjectURL(filePair.file);
      } else return;
      setFileUrl(url);
    } catch (error) {
      console.error("Failed to load file:", error);
    }
  };

  useEffect(() => {
    if (filePair?.fileDto.owner) getUserById(filePair.fileDto.owner).then(setOwner);
  }, [filePair]);

  const handleClose = () => {
    setShow(false);
    setShowInfoModal(false);
    onClose();
  };

  const onDownload = async () => {
    try {
      let url: string | undefined;
      if (!filePair?.file && filePair?.fileDto.id) {
        const data = await fileService.downloadFile(filePair.fileDto.id);
        url = URL.createObjectURL(data);
      } else if (filePair?.file) {
        url = URL.createObjectURL(filePair.file);
      }
      if (!url) throw new Error("URL is undefined");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filePair?.fileDto.name}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const getFileSize = (size?: number) => {
    if (!size) return "0 KB";
    let temp = size / 1024;
    if (temp < 1024) return `${temp.toFixed(2)} KB`;
    temp /= 1024;
    if (temp < 1024) return `${temp.toFixed(2)} MB`;
    temp /= 1024;
    return `${temp.toFixed(2)} GB`;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!filePair?.fileDto.type?.startsWith("image/")) return;
    e.preventDefault(); 
    if (e.deltaY < 0) setZoom((z) => Math.min(z + 0.2, 5));
    else setZoom((z) => Math.max(z - 0.2, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!filePair?.fileDto.type?.startsWith("image/") || zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    startOffset.current = { ...position };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setPosition({ x: startOffset.current.x + dx, y: startOffset.current.y + dy });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="xl" animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{filePair?.fileDto.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="d-flex justify-content-center align-items-center bg-light"
          style={{
            aspectRatio: "16/9",
            overflow: "hidden",
            cursor: isDragging ? "grabbing" : zoom > 1 ? "grab" : "default",
            position: "relative",
          }}
        >
          {filePair?.fileDto.type?.startsWith("image/") && fileUrl && (
            <img
              src={fileUrl}
              alt={filePair?.fileDto.name}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: "center",
                transition: isDragging ? "none" : "transform 0.1s ease",
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                userSelect: "none",
                display: "block",
              }}
              draggable={false}
            />
          )}
          {filePair?.fileDto.type?.startsWith("video/") && fileUrl && (
            <video controls style={{ maxWidth: "100%", maxHeight: "70vh" }}>
              <source src={fileUrl} type={filePair.fileDto.type} />
            </video>
          )}
          {filePair?.fileDto.type === "application/pdf" && fileUrl && (
            <iframe
              src={fileUrl}
              title="PDF Preview"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            ></iframe>
          )}
        </Modal.Body>

        <Modal.Footer className="justify-content-between">
          <Stack direction="horizontal" gap={2}>
            {filePair?.fileDto.type?.startsWith("image/") && (
              <>
                <Button variant="outline-secondary" onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}>
                  −
                </Button>
                <span>{Math.round(zoom * 100)}%</span>
                <Button variant="outline-secondary" onClick={() => setZoom((z) => Math.min(z + 0.2, 5))}>
                  +
                </Button>
              </>
            )}
          </Stack>
          <Stack direction="horizontal" gap={2}>
            <Button variant="success" onClick={() => setShowInfoModal(true)}>
              Details
            </Button>
            {enableDownload && (
              <Button variant="primary" onClick={onDownload}>
                {t("download")}
              </Button>
            )}
          </Stack>
        </Modal.Footer>
      </Modal>

      <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("file-details")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} md={5} className="text-center mb-3">
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
              <Col className="text-start" style={{wordWrap:'break-word'}}>
                <p>{t("name")}: {filePair?.fileDto?.name}</p>
                <p>{t("owner")}: {owner?.name} {owner?.surname}</p>
                <p>{t("size")} {getFileSize(filePair?.fileDto.sizeInBytes)}</p> 
                <p>{t("file-type")} {filePair?.fileDto.type}</p>
                <p>Uploaded: {' '}
                  {filePair?.fileDto.dateOfUpload
                    ? new Date(filePair.fileDto.dateOfUpload).toLocaleString("pl-PL")
                    : t("undefine-date")}
                </p>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {enableDownload && (
            <Button variant="primary" onClick={onDownload}>
              {t("download")}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FileDetailsModal;