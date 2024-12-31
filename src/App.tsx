import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import AuthProvider, { useAuth } from './Provider/authProvider';
import ProtectedRoute from './Routes/ProtectedRoute';
import LoginPage from './components/Login/LoginComponent';
import FaqComponent from './components/Faq/FaqComponent';
import Material from './components/Material/Material';
import FaqManage from './components/Faq/FaqManage';
import AssignTask from './components/TaskAssigment/AssignTask';
import TaskContentManage from './components/Task/TaskContentManage';
import RoadMapManage from './components/RoadMap/RoadMapManage';
import EmployesAssignmentSelector from './components/NewbieMentor/EmployesAssignmentSelector';
import Badge from './components/Badge/BadgeComponent';
import EditMatList from './components/Material/DndMaterial/EditMatList';
import { useNavigate } from 'react-router-dom';
import TaskDashboard from "./components/TaskDashboard/TaskDashboard.tsx";
import PresetManage from "./components/Preset/PresetManage.tsx";
import AdminPanel from "./components/Admin/AdminPanel.tsx";
import PresetAssign from './components/Preset/PresetAssign';

const AppContent = () => {
    const { user, logout, getRole } = useAuth();
    const role = getRole(user?.id || "NotFound");
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary navbar-expand-lg">
                <Container>
                    <Navbar.Brand href="/">catchUp</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/tasks">Tasks</Nav.Link>
                            {role === 'Admin'  && (
                            <Nav.Link href="/admin">Admin</Nav.Link>
                            )}
                            <Nav.Link href="/faq">Faq</Nav.Link>
                            <Nav.Link href="/faqmanage">FaqManage</Nav.Link>
                            <Nav.Link href="/addfile">AddFile</Nav.Link>
                            <Nav.Link href="/employesassignment">EmployesAssignment</Nav.Link>
                            <Nav.Link href="/assigntask">AssignTask</Nav.Link>
                            <Nav.Link href="/taskcontentmanage">TaskContentManage</Nav.Link>
                            <Nav.Link href="/roadmapmanage">RoadMapManage</Nav.Link>
                            <Nav.Link href="/badges">Badges</Nav.Link>
                            <Nav.Link href="/presetmanage">PresetManage</Nav.Link>
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/editmatlist">EditMatList</NavDropdown.Item>
                                <NavDropdown.Item href="/editmatlist_sidebar">EditMatList_SideBar</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
                <b>Logged as: {user?.name}</b>
                <Button onClick={handleLogout}>Logout</Button>
            </Navbar>

            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <h1>Welcome back {user?.name}</h1>
                        </ProtectedRoute>
                    }
                />
                <Route path="/tasks" element={<ProtectedRoute><TaskDashboard/></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminPanel/></ProtectedRoute>} />
                <Route path="/faq" element={<ProtectedRoute><FaqComponent isAdmin={false} /></ProtectedRoute>} />
                <Route path="/faqmanage" element={<ProtectedRoute><FaqManage /></ProtectedRoute>} />
                <Route path="/addfile" element={
                    <ProtectedRoute>
                        <Material
                            showRemoveFile={true}
                            showDownloadFile={true}
                            showAddingFile={true}
                        />
                    </ProtectedRoute>
                } />
                <Route path="/employesassignment" element={<ProtectedRoute><EmployesAssignmentSelector /></ProtectedRoute>} />
                <Route path="/assigntask" element={<ProtectedRoute><AssignTask /></ProtectedRoute>} />
                <Route path="/taskcontentmanage" element={<ProtectedRoute><TaskContentManage /></ProtectedRoute>} />
                <Route path="/editmatlist" element={<ProtectedRoute><EditMatList /></ProtectedRoute>} />
                <Route path="/roadmapmanage" element={<ProtectedRoute><RoadMapManage /></ProtectedRoute>} />
                <Route path="/badges" element={<ProtectedRoute><Badge /></ProtectedRoute>} />
                <Route path="/presetmanage" element={<ProtectedRoute><PresetManage /></ProtectedRoute>} />
                <Route path="/preset/assign/:presetId" element={<ProtectedRoute><PresetAssign /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            <footer className="py-3 my-4 border-top">
                <p className="text-center text-muted">© 2024 UnhandledException</p>
            </footer>
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                    <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;