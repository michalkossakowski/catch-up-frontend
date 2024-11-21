import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import FaqComponent from './components/Faq/FaqComponent';
import Material from './components/Material/Material';
import FaqManage from './components/Faq/FaqManage';
import NewbieMentor from './components/NewbieMentor/NewbieMentor';
import AssignTask from './components/TaskAssigment/AssignTask';

function App() {
  const [selectedNav, setSelectedNav] = useState("Home");
  const materialCreated = (materialId: number) => {
    console.log("Zwrócono id nowo utworzonego materiału",materialId)
    return materialId
  }      
  const renderContent = () => {
    switch (selectedNav) {
        case "Home":
          return <h1>Welcome back John Lennon</h1>;
        case "Admin":
          return <h1>Admin</h1>;
        case "Faq":
          return <FaqComponent isAdmin={false}/>;
        case "FaqManage":
          return <FaqManage/>;
        case "AddFile":
          return <Material materialId={1060} showRemoveFile={true} showDownloadFile={true} showAddingFile={true} materialCreated={materialCreated}/>
        case "NewbieMentor":
         return <NewbieMentor/>
        case "AssignTask":
          return <AssignTask/>
        default:
            return <h1>Imagine All The People!</h1>;
    }
};

  return (
    <>
    <Navbar expand="lg" className="bg-body-tertiary navbar-expand-lg">
      <Container>
        <Navbar.Brand href="#home">catchUp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" onClick={() => setSelectedNav("Home")}>Home</Nav.Link>
            <Nav.Link href="#admin" onClick={() => setSelectedNav("Admin")}>Admin</Nav.Link>
            <Nav.Link href="#faq" onClick={() => setSelectedNav("Faq")}>Faq</Nav.Link>
            <Nav.Link href="#faqmanage" onClick={() => setSelectedNav("FaqManage")}>FaqManage</Nav.Link>      
            <Nav.Link href="#addfile" onClick={() => setSelectedNav("AddFile")}>AddFile</Nav.Link>
            <Nav.Link href="#newbiementor" onClick={() => setSelectedNav('NewbieMentor')}>NewbieMentor</Nav.Link>
            <Nav.Link href="#assignTask" onClick={() => setSelectedNav("AssignTask")}>AssignTask</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    {renderContent()}

    <footer className="py-3 my-4 border-top">
      <p className="text-center text-muted">© 2024 UnhandledException</p>
    </footer>
    
    </>
  )
}

export default App
