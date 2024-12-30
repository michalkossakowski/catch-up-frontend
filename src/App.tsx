import {BrowserRouter as Router, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import AuthProvider, { useAuth } from './Provider/authProvider';
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
import { useEffect, useState } from 'react';
import UserProfile from "./components/User/UserProfile.tsx";

const Navigation = () => {
    const { user, logout, getRole } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchRole = async () => {
            if (user?.id) {
                const userRole = getRole(user.id);
                setRole(userRole);
            }
        };
        fetchRole();
    }, [user?.id, getRole]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <Navbar expand="lg" className="bg-body-tertiary navbar-expand-lg">
            <Container fluid className="px-4">
                <Navbar.Brand href="/" className="me-4">catchUp</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/tasks">Tasks</Nav.Link>
                        <Nav.Link href="/faq">FAQ</Nav.Link>
                        <Nav.Link href="/faqmanage">FAQ Manage</Nav.Link>
                        <Nav.Link href="/addfile">Add File</Nav.Link>
                        <Nav.Link href="/employesassignment">Employes Assignment</Nav.Link>
                        <Nav.Link href="/assigntask">Assign Task</Nav.Link>
                        <Nav.Link href="/taskcontentmanage">Task Content Manage</Nav.Link>
                        <Nav.Link href="/roadmapmanage">RoadMap Manage</Nav.Link>
                        <Nav.Link href="/presetmanage">Preset Manage</Nav.Link>
                        <Nav.Link href="/badges">Badges</Nav.Link>
                        {role === 'Admin' && (
                            <NavDropdown title="Admin Tools" id="basic-nav-dropdown">
                                <Nav.Link href="/admin">Add User</Nav.Link>
                            </NavDropdown>
                        )}
                    </Nav>
                    <NavDropdown
                        title={`${user.name} ${user.surname}`}
                        id="user-dropdown"
                        align="end"
                    >
                        <NavDropdown.Item href="/profile"> <i className="bi bi-person-circle"></i> My Profile</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item
                            onClick={handleLogout}
                            className="text-primary">
                            <i className="bi bi-box-arrow-right"></i> Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

const AppRoutes = () => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user && location.pathname !== '/login') {
        return <Navigate to="/login" replace />;
    }

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
                user ? (
                    <>
                        <Navigation />
                        <h1>Welcome back {user.name}</h1>
                    </>
                ) : (
                    <Navigate to="/login" replace />
                )
            } />

            {user && (
                <>
                    <Route path="/tasks" element={<><Navigation /><TaskDashboard /></>} />
                    <Route path="/admin" element={<><Navigation /><AdminPanel /></>} />
                    <Route path="/faq" element={<><Navigation /><FaqComponent isAdmin={false} /></>} />
                    <Route path="/faqmanage" element={<><Navigation /><FaqManage /></>} />
                    <Route path="/addfile" element={
                        <>
                            <Navigation />
                            <Material
                                showRemoveFile={true}
                                showDownloadFile={true}
                                showAddingFile={true}
                            />
                        </>
                    } />
                    <Route path="/employesassignment" element={<><Navigation /><EmployesAssignmentSelector /></>} />
                    <Route path="/assigntask" element={<><Navigation /><AssignTask /></>} />
                    <Route path="/taskcontentmanage" element={<><Navigation /><TaskContentManage /></>} />
                    <Route path="/editmatlist" element={<><Navigation /><EditMatList /></>} />
                    <Route path="/roadmapmanage" element={<><Navigation /><RoadMapManage /></>} />
                    <Route path="/badges" element={<><Navigation /><Badge /></>} />
                    <Route path="/presetmanage" element={<><Navigation /><PresetManage /></>} />
                    <Route path="/profile" element={<><Navigation /><UserProfile /></>} />
                </>
            )}

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

const Footer = () => (
    <footer className="py-0 my-3 border-top">
        <p className="text-center text-muted">© 2024 UnhandledException</p>
    </footer>
);

function App() {
    return (
        <AuthProvider>
            <Router future={{ // flags fix the warning, it's related to a new React router version coming up
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}>
                <AppRoutes />
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;