import './App.css';
import { Alert, Button, Image } from 'react-bootstrap';
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
import SchoolingPartEdit from './components/Schooling/SchoolingPartEdit.tsx';
import SchoolingAssignment from './components/Schooling/SchoolingAssignment.tsx';
import PresetAssign from './components/Preset/PresetAssign';
import FeedbackList from './components/Feedback/FeedbackListPage.tsx';
import '../css/catchUpBase.css';
import { useLocation } from 'react-router-dom';

function App() {
    const { user, getRole, avatar, logout } = useAuth();
    const [role, setRole] = useState<string | null>(null);
    const [isSidebarVisible, setSidebarVisible] = useState(true); // Sidebar visibility state
    const [theme, setTheme] = useState<'night' | 'day'>('night');

    const fetchRole = async () => {
        if (user?.id) {
            const userRole = await getRole(user.id);
            setRole(userRole);
        }
    };

    useEffect(() => {
        fetchRole();
    }, [user?.id]);

    const location = useLocation();
    const isManageToolsActive = [
        "/taskmanage",
        "/taskcontentmanage",
        "/presetmanage",
        "/roadmapmanage",
        "/editMatList"
    ].some(path => location.pathname.startsWith(path));

    const isAdminToolsActive = [
        "/admin",
        "/employesassignment"
    ].some(path => location.pathname.startsWith(path));

    const toggleTheme = () => {
        const newTheme = theme === 'night' ? 'day' : 'night';
        setTheme(newTheme);
    };

    return (
        <>
            {/* Dynamically load the theme CSS */}
            <link
                rel="stylesheet"
                href={theme === 'night' ? '/css/catchUpNight.css' : '/css/catchUpDay.css'}
            />
            {user && (
                <>
                <div className="d-flex">
                    {/* Left Sidebar */}
                    <div
                        className={`left-sidebar ${
                            isSidebarVisible ? "visible" : "hidden"
                        }`}
                    >
                        <Navbar
                            expand="lg"
                            className="flex-column vh-100 p-3 bg-body-tertiary navbar-expand-lg left-navbar"
                        >
                            <Navbar.Brand href="/" className="nav-brand">
                                catchUp
                            </Navbar.Brand>
                            <Nav className="flex-column w-100">
                                <NavLink to="/" className="nav-link">
                                    <i className="bi bi-house-door" /> <span>Home</span>
                                </NavLink>
                                {role === "Newbie" && (
                                    <NavLink
                                        to="/tasks"
                                        className="nav-link left-sidebar"
                                    >
                                        <i className="bi bi-list-task" /> <span>Tasks</span>
                                    </NavLink>
                                )}
                                <NavLink
                                    to="/schoolinglist"
                                    className="nav-link"
                                >
                                    <i className="bi bi-book" />  <span>Schoolings</span>
                                </NavLink>
                                <NavLink to="/feedbacks" className="nav-link">
                                    <i className="bi bi-arrow-clockwise" /> <span>Feedbacks</span>
                                </NavLink>
                                <NavLink to="/badges" className="nav-link">
                                    <i className="bi bi-shield" /> <span>Badges</span>
                                </NavLink>
                                <NavLink to="/faq" className="nav-link">
                                    <i className="bi bi-question-circle" /> <span>FAQ</span>
                                </NavLink>
                                {role !== "Newbie" && role != null && (
                                    <NavDropdown
                                        className={
                                            isManageToolsActive
                                                ? "navdropdown-active"
                                                : ""
                                        }
                                        title={
                                            <>
                                                <i className="bi bi-pencil-square" />{" "}
                                                <span>Manage Tools</span>
                                            </>
                                        }
                                    >
                                        <NavDropdown.Item
                                            as={NavLink}
                                            to="/taskmanage"
                                            className="nav-dropdown-item"
                                        >
                                            <i className="bi bi-list-task" />{" "}
                                            Tasks
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item
                                            as={NavLink}
                                            to="/taskcontentmanage"
                                            className="nav-dropdown-item"
                                        >
                                            <i className="bi bi-kanban" /> Task
                                            Contents
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item
                                            as={NavLink}
                                            to="/presetmanage"
                                            className="nav-dropdown-item"
                                        >
                                            <i className="bi bi-stack-overflow" />{" "}
                                            Task Presets
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item
                                            as={NavLink}
                                            to="/roadmapmanage"
                                            className="nav-dropdown-item"
                                        >
                                            <i className="bi bi-compass" /> Road
                                            Maps
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item
                                            as={NavLink}
                                            to="/editMatList"
                                            className="nav-dropdown-item"
                                        >
                                            <i className="bi bi-tools" />{" "}
                                            Material Lists
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                )}
                                {role === "Admin" && (
                                    <NavDropdown
                                        className={
                                            isAdminToolsActive
                                                ? "navdropdown-active"
                                                : ""
                                        }
                                        title={
                                            <>
                                                <i className="bi bi-person-lock" />{" "}
                                                <span>Admin Tools</span>
                                            </>
                                        }
                                    >
                                        <NavDropdown.Item
                                            as={NavLink}
                                            to="/adminpanel"
                                            className="nav-dropdown-item"
                                        >
                                            <i className="bi bi-shield-lock" />{" "}
                                            Panel
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item
                                            as={NavLink}
                                            to="/employesassignment"
                                            className="nav-dropdown-item"
                                        >
                                            <i className="bi bi-people" />{" "}
                                            Assignment
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                )}
                            </Nav>
                            <footer className="mt-auto">
                                <p className="text-center text-muted small">
                                    © 2024 Made by UnhandledException
                                </p>
                            </footer>
                        </Navbar>
                    </div>

                    {/* Toggle Sidebar Button */}
                    <Button title="Show/hide sidebar"
                        className="btn-secondary toggle-sidebar-btn"
                        onClick={() => setSidebarVisible(!isSidebarVisible)}
                    >
                        {isSidebarVisible ? <i className="bi bi-arrow-left-square"/> : <i className="bi bi-arrow-right-square"/>}
                    </Button>

                        {/* Główna treść strony */}
                        <Container
                            fluid
                            className={`main-content ${isSidebarVisible ? "sidebar-visible" : "sidebar-hidden"}`}
                        >
                        <Navbar expand="lg" className="bg-body-tertiary navbar-horizontal">
                            <Nav className="ms-auto d-flex align-items-center flex-row flex-wrap"> 
                                {/* Theme Switcher Button */}
                                <Button
                                    onClick={toggleTheme}
                                    className='theme-btn'
                                    title='Dark/Light theme'
                                >
                                    {theme === 'night' ? <i className="bi bi-brightness-high"/> : <i className="bi bi-moon"/>}
                                </Button>                         
                                <NavLink className="nav-link  nav-user" to={`/profile/${user?.id}`}>
                                    <div className="d-flex align-items-center ">
                                        <span>{user.name} {user.surname}</span>
                                        <Image
                                            src={avatar || defaultUserIcon}
                                            className="avatar rounded-circle"
                                            width={30}
                                            height={30}
                                            alt="User avatar"
                                        />
                                    </div>
                                </NavLink>
                                <NavLink title="Notifications" to="/notifications" className="nav-link"><i className="bi bi-bell" /></NavLink>
                                <NavLink title="Settings" to="/settings" className="nav-link"><i className="bi bi-gear" /></NavLink>
                                <NavLink title="Logout" to="/logout" onClick={logout} className="nav-link">
                                    <i className="bi bi-box-arrow-right" />
                                </NavLink>
                            </Nav>
                        </Navbar>
                            { role == null &&(
                                <Alert className='alert api-alert' variant='danger'>
                                    <i className="bi bi-exclamation-triangle"/> Api is offline try refreshing the page <i className="bi bi-exclamation-triangle"/>
                                </Alert>
                            )}
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/tasks" element={<TaskDashboard />} />
                                <Route path="/adminpanel" element={<AdminPanel isAdmin={role === "Admin"} />} />
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
