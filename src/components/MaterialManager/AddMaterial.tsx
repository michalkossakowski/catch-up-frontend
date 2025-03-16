import { Button, ButtonGroup, Col, Container, Form, InputGroup, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { uploadFile } from '../../services/fileService';
import { useState } from 'react';
import FileAdd from '../File/FileAdd';

const AddMaterial: React.FC = () => 
{
    const [show, setShow] = useState(true);
    const [open, setOpen] = useState(false);
    
    return (
        <>
          {show && (
            <Container> 
                <div className='d-flex align-items-center'>
                    <a  onClick={() => setOpen(!open)} className='fs-3 rounded-circle me-3'>
                        {open ? <i className="bi bi-chevron-down"></i> : <i className="bi bi-chevron-right"></i>}
                    </a>
                    <h3 className='mb-0'>Add content</h3>
                </div>
                {open && (
                    <div className='mt-3'>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Content name</InputGroup.Text>
                            <Form.Control
                                placeholder="ex. My lovely content"
                            />
                        </InputGroup>
                        <div>
                            <Row>
                                <Col className='d-flex justify-content-start gap-2'>
                                    <Button variant="outline-secondary"><i className="bi bi-file-earmark-arrow-up"></i></Button>
                                    <Button variant="outline-secondary"><i className="bi bi-file-earmark-arrow-down"></i></Button>
                                    <Button variant="outline-secondary"><i className="bi bi-file-earmark-x"></i></Button>
                                </Col>
                                <Col className='d-flex justify-content-end'>
                                    <ToggleButtonGroup type="radio" name="options" defaultValue={1} className='gap-0 mt-0' style={{display: 'inline'}}>
                                        <ToggleButton variant="outline-secondary" id="tbg-radio-1" value={1}>
                                            <i className="bi bi-list-ul"></i>                                        
                                        </ToggleButton>
                                        <ToggleButton variant="outline-secondary" id="tbg-radio-2" value={2}>
                                            <i className="bi bi-grid-3x3"></i>                                        
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Col>
                            </Row>
                            <FileAdd></FileAdd>
                        </div>
                        <div className="d-flex gap-2 mb-2">
                            <Button variant="success" type="submit" className='mt-3'>Save changes</Button>
                            <Button variant="secondary" type="reset" className='mt-3'>Cancel</Button>
                        </div>
                    </div>
                )}
            </Container>)}
        </>
      );
}

export default AddMaterial;
