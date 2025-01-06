import './App.css';
import { Image } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './Provider/authProvider';
import Badge from './components/Badge/BadgeComponent';
import FaqComponent from './components/Faq/FaqComponent';
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
import { Routes, Route, NavLink } from 'react-router-dom';
import TaskDashboard from "./components/TaskDashboard/TaskDashboard.tsx";
import SchoolingDetails from "./components/Schooling/SchoolingDetails.tsx";
import SchoolingListNewbie from "./components/Schooling/SchoolingListNewbie.tsx";
import EmployesAssignmentSelector from './components/NewbieMentor/EmployesAssignmentSelector';

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
        console.log(role)
    }, [getRole]);

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
                                            <NavLink to="/admin" className="nav-link">Admin Panel</NavLink>
                                            <NavLink to="/editMatList" className="nav-link">MaterialList</NavLink>
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
                                    <NavDropdown.Item href={`/profile/${user?.id}`}>
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
                        <Route path="/" element={<><h1>Welcome back John Lennon</h1></>} />
                        <Route path="/tasks" element={<TaskDashboard />} />
                        <Route path="/admin" element={<AdminPanel isAdmin={role === "Admin"} />} />
                        <Route path="/faq" element={<FaqComponent isAdmin={role === "Admin"} />} />
                        <Route path="/employesassignment" element={<EmployesAssignmentSelector />} />
                        <Route path="/assigntask" element={<AssignTask />} />
                        <Route path="/taskcontentmanage" element={<TaskContentManage />} />
                        <Route path="/editmatlist" element={<EditMatList />} />
                        <Route path="/roadmapmanage" element={<RoadMapManage />} />
                        <Route path="/badges" element={<Badge />} />
                        <Route path="/presetmanage" element={<PresetManage />} />
                        <Route path="/schoolinglistnewbie" element={<SchoolingListNewbie />} />
                        <Route path="/schoolingdetails" element={<SchoolingDetails />} />
                        <Route path="/profile/:userId" element={<UserProfile />} />
                    </Routes>
                </>
            )}

            {!user && (
                <LoginComponent />
            )}

            <footer className="py-0 my-3 border-top">
                <p className="text-center text-muted">© 2024 UnhandledException</p>
            </footer>
        </>
    );
}

export default App;
