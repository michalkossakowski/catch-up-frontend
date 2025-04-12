import { useState } from "react";
import { Button, Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import "./SchoolingProgressBar.css";
import SchoolingProgressBarElement from "./SchoolingProgressBarElement";
import SchoolingItem from "../SchoolingItem";
const SchoolingProgressBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <Row className="mt-3">
      <Col md={isOpen ? 4 : 2} className="p-0 m-0">      
        <div className="sidebar-container">
          <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <Navbar expand="lg" className="flex-column p-0 m-0">
              <Nav className="flex-column p-0 m-0 ms-3" style={{ width: '100%' }}>
                <Nav.Link className="sidebar-navlink" href="#1">
                  <SchoolingProgressBarElement showVl hide = {isOpen} isDone = {true} ></SchoolingProgressBarElement>
                </Nav.Link>
                <Nav.Link className="sidebar-navlink" href="#2">
                  <SchoolingProgressBarElement showVl hide = {isOpen} isDone = {true}/>
                </Nav.Link>
                <Nav.Link className="sidebar-navlink" href="#3">
                  <SchoolingProgressBarElement showVl hide = {isOpen}/>
                </Nav.Link>
                <Nav.Link className="sidebar-navlink" href="#4">
                  <SchoolingProgressBarElement hide = {isOpen}/>
                </Nav.Link>
              </Nav>
            </Navbar>
          </div>
          <Button
            onClick={toggleSidebar}
            className={`sidebar-button ${isOpen ? 'open' : 'closed'}`}
          >
            <i className="bi bi-arrow-left-square"></i>
          </Button>
        </div>
      </Col>
      <Col md={isOpen ? 8 : 10} className="p-0 m-0 d-flex flex-column align-items-center pe-5 ">
        <SchoolingItem/>
      </Col>
    </Row>
  );
};
export default SchoolingProgressBar;