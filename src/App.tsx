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
import PresetManage from "./components/Preset/PresetManage.tsx";
import TaskContentManage from './components/Task/TaskContentManage';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import EditMatList from './components/Material/DndMaterial/EditMatList';
import TaskDashboard from "./components/TaskDashboard/TaskDashboard.tsx";
import SchoolingDetails from "./components/Schooling/SchoolingDetails.tsx";
import SchoolingListNewbie from "./components/Schooling/SchoolingListNewbie.tsx";
import SchoolingEdit from "./components/Schooling/SchoolingEdit.tsx";
import SchoolingListMentor from "./components/Schooling/SchoolingListMentor.tsx";
import SchoolingListParts from "./components/Schooling/SchoolingListParts.tsx";
import EmployesAssignmentSelector from './components/NewbieMentor/EmployesAssignmentSelector';
import TaskManager from "./components/TaskDashboard/TaskManager.tsx";
import Loading from './components/Loading/Loading.tsx';
import SchoolingPartEdit from './components/Schooling/SchoolingPartEdit.tsx';
import SchoolingAssignment from './components/Schooling/SchoolingAssignment.tsx';
import PresetAssign from './components/Preset/PresetAssign';
import FeedbackList from './components/Feedback/FeedbackListPage.tsx';

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
                                    {role == 'Newbie' && (
                                    <NavLink to="/tasks" className="nav-link">Tasks</NavLink>
                                    )}
                                    <NavLink to="/faq" className="nav-link">FAQ</NavLink>
                                    <NavLink to="/schoolinglist" className="nav-link">Schoolings</NavLink>
                                    {role !== 'Newbie' && (
                                        <NavLink to="/taskmanage" className="nav-link">Manage Tasks</NavLink>
                                    )}
                                    <NavLink to="/taskcontentmanage" className="nav-link">Task Content Manage</NavLink>
                                    <NavLink to="/roadmapmanage" className="nav-link">RoadMap Manage</NavLink>
                                    <NavLink to="/presetmanage" className="nav-link">Preset Manage</NavLink>
                                    <NavLink to="/feedbacks" className="nav-link">Feedbacks</NavLink>
                                    <NavLink to="/badges" className="nav-link">Badges</NavLink>
                                    {role === 'Admin' && (
                                        <NavDropdown title="Admin Tools" id="basic-nav-dropdown">
                                            <NavDropdown.Item as={NavLink} to="/admin" className="nav-link">Admin Panel</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as={NavLink} to="/editMatList" className="nav-link">MaterialList</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as={NavLink} to="/employesassignment" className="nav-link">Employes Assignment</NavDropdown.Item>
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
                        <Route path="/" element={<><Home/></>} />
                        <Route path="/tasks" element={<TaskDashboard />} />
                        <Route path="/admin" element={<AdminPanel isAdmin={role === "Admin"} />} />
                        <Route path="/faq" element={<FaqComponent isAdmin={role === "Admin"} />} />
                        <Route path="/employesassignment" element={<EmployesAssignmentSelector />} />
                        <Route path="/taskmanage" element={<TaskManager />} />
                        <Route path="/taskcontentmanage" element={<TaskContentManage />} />
                        <Route path="/editmatlist" element={<EditMatList />} />
                        <Route path="/roadmapmanage" element={<RoadMapManage />} />
                        <Route path="/feedbacks" element={<FeedbackList />} />
                        <Route path="/badges" element={<Badge />} />
                        <Route path="/presetmanage" element={<PresetManage />} />
                        <Route path="/schoolingedit" element={<SchoolingEdit />} />
                        <Route 
                            path="/schoolinglist" 
                            element={
                                role === 'Admin' || role === 'Mentor' 
                                    ? <SchoolingListMentor /> 
                                    : <SchoolingListNewbie />
                            } 
                        />
                        <Route path="/schoolinglist" element={<div className='mt-4'><span className='mt-4'>Error with loading schooling</span><Loading/></div>} />
                        <Route path="/schoolingpartedit/:id?" element={<SchoolingPartEdit />} />

                        <Route path="/schoolinglistparts" element={<SchoolingListParts />} />
                        <Route path="/preset/assign/:presetId" element={<PresetAssign />} />
                        <Route path="/schoolingdetails" element={<SchoolingDetails />} />
                        <Route path="/schoolingassignment" element={<SchoolingAssignment />} />
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
