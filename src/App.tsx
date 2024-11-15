import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import FaqComponent from './components/Faq/FaqComponent';
import FaqAdd from './components/Faq/FaqAdd';
import Material from './components/Material/Material';

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
          return <FaqComponent/>;
        case "AddFaq":
          return <FaqAdd/>
        case "AddFile":
          return <Material materialId={1060} showRemoveFile={true} showDownloadFile={true} showAddingFile={true} materialCreated={materialCreated}/>
        default:
            return <h1>Imagine</h1>;
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
            <Nav.Link href="#addfaq" onClick={() => setSelectedNav("AddFaq")}>AddFaq</Nav.Link>
            <Nav.Link href="#addfile" onClick={() => setSelectedNav("AddFile")}>AddFile</Nav.Link>
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

    </>
  )
}

export default App
