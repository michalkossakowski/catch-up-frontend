import './App.css';
import { Image } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home/Home.tsx';
import { useAuth } from './Provider/authProvider';
import Badge from './components/Badge/BadgeComponent';
import FaqComponent from './components/Faq/FaqComponent';
import { Routes, Route, NavLink } from 'react-router-dom';
import AdminPanel from "./components/Admin/AdminPanel.tsx";
import defaultUserIcon from './assets/defaultUserIcon.jpg';
import UserProfile from './components/User/UserProfile.tsx';
import RoadMapManage from './components/RoadMap/RoadMapManage';
import LoginComponent from './components/Login/LoginComponent';
import AssignTask from './components/TaskAssigment/AssignTask';
import PresetManage from "./components/Preset/PresetManage.tsx";
import TaskContentManage from './components/Task/TaskContentManage';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import EditMatList from './components/Material/DndMaterial/EditMatList';
import TaskDashboard from "./components/TaskDashboard/TaskDashboard.tsx";
import SchoolingDetails from "./components/Schooling/SchoolingDetails.tsx";
import SchoolingListNewbie from "./components/Schooling/SchoolingListNewbie.tsx";
import EmployesAssignmentSelector from './components/NewbieMentor/EmployesAssignmentSelector';
import PresetManage from "./components/Preset/PresetManage.tsx";
import AdminPanel from "./components/Admin/AdminPanel.tsx";
import PresetAssign from './components/Preset/PresetAssign';

function App() {
    const { user, getRole, avatar, logout } = useAuth();
    const [role, setRole] = useState<string | null>(null);

    const fetchRole = async () => {
        if (user?.id) {
            const userRole = await getRole(user.id);
            setRole(userRole);
        }
    };

    useEffect(() => {
        fetchRole();
    }, [user?.id]);

    return (
        <>
            {user && (
                <>
                    <Navbar expand="lg" className="bg-body-tertiary navbar-expand-lg">
                        <Container fluid className="px-4">
                            <Navbar.Brand href="/" className="me-4">catchUp</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    <NavLink to="/" className="nav-link">Home</NavLink>
                                    <NavLink to="/tasks" className="nav-link">Tasks</NavLink>
                                    <NavLink to="/faq" className="nav-link">FAQ</NavLink>
                                    <NavLink to="/schoolinglistnewbie" className="nav-link">Schoolings</NavLink>
                                    <NavLink to="/employesassignment" className="nav-link">Employes Assignment</NavLink>
                                    <NavLink to="/assigntask" className="nav-link">Assign Task</NavLink>
                                    <NavLink to="/taskcontentmanage" className="nav-link">Task Content Manage</NavLink>
                                    <NavLink to="/roadmapmanage" className="nav-link">RoadMap Manage</NavLink>
                                    <NavLink to="/presetmanage" className="nav-link">Preset Manage</NavLink>
                                    <NavLink to="/badges" className="nav-link">Badges</NavLink>
                                    {role === 'Admin' && (
                                        <NavDropdown title="Admin Tools" id="basic-nav-dropdown">
                                            <NavDropdown.Item as={NavLink} to="/admin" className="nav-link">Admin Panel</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as={NavLink} to="/editMatList" className="nav-link">MaterialList</NavDropdown.Item>
                                        </NavDropdown>
                                    )}
                                </Nav>
                                <NavDropdown
                                    title={
                                        <div className="d-flex align-items-center">
                                            {`${user.name} ${user.surname}`}
                                            <Image
                                                src={avatar || defaultUserIcon}
                                                className="ms-2 rounded-circle"
                                                width={30}
                                                height={30}
                                                alt="User avatar"
                                            />
                                        </div>
                                    }
                                    id="user-dropdown"
                                    className="nav-dropdown"
                                    align="end">    
                                    <NavDropdown.Item as={NavLink} to={`/profile/${user?.id}`}>
                                        <i className="bi bi-person-circle"></i> My Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item
                                        onClick={logout}
                                        className="text-primary">
                                        <i className="bi bi-box-arrow-right"></i> Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Navbar.Collapse>
                        </Container>
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
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>

                    <footer className="py-0 my-3 border-top">
                        <p className="text-center text-muted">© 2024 UnhandledException</p>
                    </footer>
                </>
            )}
        </>
    );
}

export default App;
