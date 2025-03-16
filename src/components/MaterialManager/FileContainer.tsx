import { useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";

const FileContainer: React.FC = () => 
{
    const [show, setShow] = useState(false);
    
    return (
        <>
        <Button variant="primary" onClick={() => setShow(true)}>
            Custom Width Modal
        </Button>
    
        <Modal
            show={show}
            onHide={() => setShow(false)}
            backdrop="static"
            aria-labelledby="example-custom-modal-styling-title"
            centered
            size="lg"
        >
            <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
                Custom Modal Styling
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col xs={6} md={4}></Col>
                        <Col xs={12} md={8}></Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
        </>
    )
}
    
export default FileContainer;
    