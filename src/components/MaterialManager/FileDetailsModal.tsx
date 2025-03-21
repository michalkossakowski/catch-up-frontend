import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

interface FileDetailsModalProps {
    showModal: boolean;
    onClose(): void;
}
const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
    showModal,
    onClose
}) => {
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
        onClose()
    };
  
    return (
        <>
        <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
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
export default FileDetailsModal;
