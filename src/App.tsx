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
import '../css/catchUpNight.css';

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
                    <div className="d-flex">
                        {/* Pionowy navbar po lewej stronie */}
                        <Navbar
                            expand="lg"
                            className="flex-column vh-100 p-3 bg-body-tertiary navbar-expand-lg left-sidebar"
                        >
                            <Navbar.Brand href="/" className="nav-brand">catchUp</Navbar.Brand>
                            <Nav className="flex-column w-100">
                                <NavLink to="/" className="nav-link"><i className="bi bi-house-door" /> Home</NavLink>
                                {role === 'Newbie' && (
                                    <NavLink to="/tasks" className="nav-link left-sidebar"><i className="bi bi-list-task" /> Tasks</NavLink>
                                )}
                                <NavLink to="/schoolinglist" className="nav-link"><i className="bi bi-book" /> Schoolings</NavLink>
                                <NavLink to="/feedbacks" className="nav-link"><i className="bi bi-arrow-clockwise" /> Feedbacks</NavLink>
                                <NavLink to="/badges" className="nav-link"><i className="bi bi-shield" /> Badges</NavLink>
                                <NavLink to="/faq" className="nav-link"><i className="bi bi-question-circle" /> FAQ</NavLink>
                                {role !== 'Newbie' && (
                                    <NavDropdown title={<><i className="bi bi-pencil-square" /> Manage Tools</>} id="basic-nav-dropdown">
                                        <NavDropdown.Item as={NavLink} to="/taskmanage" className="nav-dropdown-item"><i className="bi bi-list-task" /> Tasks</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={NavLink} to="/taskcontentmanage" className="nav-dropdown-item"><i className="bi bi-kanban" /> Task Contents</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={NavLink} to="/presetmanage" className="nav-dropdown-item"><i className="bi bi-stack-overflow" /> Presets</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={NavLink} to="/roadmapmanage" className="nav-dropdown-item"><i className="bi bi-compass" /> Road Maps</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={NavLink} to="/editMatList" className="nav-dropdown-item"><i className="bi bi-tools" /> Material Lists</NavDropdown.Item>
                                    </NavDropdown>
                                )}
                                {role === 'Admin' && (
                                    <NavDropdown title={<><i className="bi bi-person-lock" /> Admin Tools</>} id="basic-nav-dropdown">
                                        <NavDropdown.Item as={NavLink} to="/admin" className="nav-dropdown-item"><i className="bi bi-shield-lock" /> Admin Panel</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={NavLink} to="/employesassignment" className="nav-dropdown-item"><i className="bi bi-people" /> Assignment</NavDropdown.Item>
                                    </NavDropdown>
                                )}
                            </Nav>
                        </Navbar>

                        {/* Główna treść strony */}
                        <Container fluid className="main-content">
                            <Navbar expand="lg" className="bg-body-tertiary navbar-horizontal">
                                <Nav className="ms-auto d-flex align-items-center">
                                    <NavLink className="nav-link" to={`/profile/${user?.id}`}>
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
                                    </NavLink>
                                    <NavLink to="/notifications" className="nav-link"><i className="bi bi-bell" /></NavLink>
                                    <NavLink to="/settings" className="nav-link"><i className="bi bi-gear" /></NavLink>
                                    <NavLink title='Logout' to="/logout" onClick={logout} className="nav-link"><i className="bi bi-box-arrow-right"/></NavLink>
                                </Nav>
                            </Navbar>
                            <Routes>
                                <Route path="/" element={<Home />} />
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
                                <Route path="/schoolingpartedit/:id?" element={<SchoolingPartEdit />} />
                                <Route path="/schoolinglistparts" element={<SchoolingListParts />} />
                                <Route path="/preset/assign/:presetId" element={<PresetAssign />} />
                                <Route path="/schoolingdetails" element={<SchoolingDetails />} />
                                <Route path="/schoolingassignment" element={<SchoolingAssignment />} />
                                <Route path="/profile/:userId" element={<UserProfile />} />
                                <Route path="/settings" element={<><h1>Settings</h1></>} />
                                <Route path="/notifications" element={<><h1>Notifications</h1></>} />
                            </Routes>
                            <footer className="py-0 my-3 border-top">
                <p className="text-center text-muted">© 2024 UnhandledException</p>
            </footer>
                        </Container>
                    </div>
                </>
            )}

            {!user && (
                <LoginComponent />
            )}
        </>
    );
}

export default App;
