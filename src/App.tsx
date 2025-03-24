import './App.css';
import { Alert, Button, Image } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home/Home.tsx';
import { useAuth } from './Provider/authProvider';
import Badge from './components/Badge/BadgeComponent';
import FaqComponent from './components/Faq/FaqComponent';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import AdminPanel from "./components/Admin/AdminPanel.tsx";
import defaultUserIcon from './assets/defaultUserIcon.jpg';
import UserProfile from './components/User/UserProfile.tsx';
import RoadMapManage from './components/RoadMap/RoadMapManage';
import LoginComponent from './components/Login/LoginComponent';
import PresetManage from "./components/Preset/PresetManage.tsx";
import TaskContentManage from './components/Task/TaskContentManage';
import TaskContentCreate from './components/Task/TaskContentCreate';
import TaskContentEditPage from './components/Task/TaskContentEditPage';
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
import NotificationPage from './components/Notification/NotificationPage.tsx';
import { startConnection, connection } from "./services/signalRService";
import { NotificationDto } from './dtos/NotificationDto.ts';
import NotificationToast from './components/Toast/NotificationToast.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { setNotifications, addNotification } from './store/notificationSlice';
import { getNotifications } from './services/notificationService';
import TaskContentDetails from './components/Task/TaskContentDetails';
import AIAssistant from './components/AI/AIAssistant.tsx';
import { useTranslation } from "react-i18next";
import "./i18n.ts";
import { useNavigate } from 'react-router-dom';
import HRHomePage from './components/HR/HRHomePage.tsx';
import EventCreator from './components/HR/EventCreator.tsx';
function App() {
    const { user, getRole, avatar, logout } = useAuth();
    const [role, setRole] = useState<string | null>(null);
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [theme, setTheme] = useState<'night' | 'day'>('night');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { hasUnread } = useSelector((state: RootState) => state.notifications);
    const location = useLocation();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSource, setToastSource] = useState('');
    const notificationSound = new Audio('/Notifications/notification.mp3');

    const { t, i18n } = useTranslation();
    const availableLanguages: { [key: string]: string } = {
        'en': "English",
        'pl': "Polski",
        'fr': "Français",
        'de': "Deutsch",
        'es': "Español",
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        if (!availableLanguages.hasOwnProperty(lng)) {
            i18n.changeLanguage("en");
            return "en";
        }
        localStorage.setItem("i18nextLng", lng);
    };

    const normalizeLanguage = (lng: string) => {
        if (!lng) return "en";
        if (!availableLanguages.hasOwnProperty(lng)) {
            i18n.changeLanguage("en");
            return "en";
        }
        return lng.split("-")[0];
    };

    const fetchRole = async () => {
        if (user?.id) {
            const userRole = await getRole(user.id);
            setRole(userRole);
            startConnection();
            handleNotifications();
            if (location.pathname === '/') {
                if (userRole === 'HR') {
                    navigate('/hrhomepage');
                } else {
                    navigate('/');
                }
            }
        }
    };

    useEffect(() => {
        loadTheme();
        fetchRole();
    }, [user?.id]);

    const handleNotifications = async () => {
        const data = await getNotifications();
        dispatch(setNotifications(data));

        connection.on("ReceiveNotification", (notification: NotificationDto) => {
            notificationSound.play().catch(() => {
                console.log("Sound is locked. Waiting for user interaction.");
            });
            dispatch(addNotification(notification));
            setToastMessage(notification.title);
            setToastSource("/notifications");
            setShowToast(true);
        });
    };

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
        localStorage.setItem('theme', newTheme);
    };

    const loadTheme = () => {
        const savedTheme = localStorage.getItem('theme') as 'night' | 'day' | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    };

    const [showAIChat, setShowAIChat] = useState(false);

    const handleToggleAIChat = () => {
        setShowAIChat(prev => !prev);
    };

    return (
        <>
            <link
                rel="stylesheet"
                href={theme === 'night' ? '/css/catchUpNight.css' : '/css/catchUpDay.css'}
            />
            {user && (
                <>
                    <div className="d-flex">
                        <div className={`left-sidebar ${isSidebarVisible ? "visible" : "hidden"}`}>
                            <Navbar expand="lg" className="flex-column vh-100 p-3 bg-body-tertiary navbar-expand-lg left-navbar">
                                <Navbar.Brand href="/" className="nav-brand">catchUp</Navbar.Brand>
                                <Nav className="flex-column w-100">
                                    <NavLink to={role === 'HR' ? '/hrhomepage' : '/'} className="nav-link">
                                        <i className="bi bi-house-door" /> <span>{t('home')}</span>
                                    </NavLink>
                                    {role === "Newbie" && (
                                        <NavLink to="/tasks" className="nav-link left-sidebar">
                                            <i className="bi bi-list-task" /> <span>{t('tasks')}</span>
                                        </NavLink>
                                    )}
                                    <NavLink to="/schoolinglist" className="nav-link">
                                        <i className="bi bi-book" /> <span>{t('schoolings')}</span>
                                    </NavLink>
                                    <NavLink to="/feedbacks" className="nav-link">
                                        <i className="bi bi-arrow-clockwise" /> <span>{t('feedbacks')}</span>
                                    </NavLink>
                                    <NavLink to="/badges" className="nav-link">
                                        <i className="bi bi-shield" /> <span>{t('badges')}</span>
                                    </NavLink>
                                    <NavLink to="/faq" className="nav-link">
                                        <i className="bi bi-question-circle" /> <span>{t('faq')}</span>
                                    </NavLink>
                                    {role !== "Newbie" && role != null && (
                                        <NavDropdown
                                            className={isManageToolsActive ? "navdropdown-active" : ""}
                                            title={<><i className="bi bi-pencil-square" /> <span>{t('manage-tools')}</span></>}
                                        >
                                            <NavDropdown.Item as={NavLink} to="/taskmanage" className="nav-dropdown-item">
                                                <i className="bi bi-list-task" /> {t('tasks')}
                                            </NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as={NavLink} to="/taskcontentmanage" className="nav-dropdown-item">
                                                <i className="bi bi-kanban" /> {t('task-contents')}
                                            </NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as={NavLink} to="/presetmanage" className="nav-dropdown-item">
                                                <i className="bi bi-stack-overflow" /> {t('task-presets')}
                                            </NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as={NavLink} to="/roadmapmanage" className="nav-dropdown-item">
                                                <i className="bi bi-compass" /> {t('road-maps')}
                                            </NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as={NavLink} to="/editMatList" className="nav-dropdown-item">
                                                <i className="bi bi-tools" /> {t('material-lists')}
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    )}
                                    {role === "Admin" && (
                                        <NavDropdown
                                            className={isAdminToolsActive ? "navdropdown-active" : ""}
                                            title={<><i className="bi bi-person-lock" /> <span>{t('admin-tools')}</span></>}
                                        >
                                            <NavDropdown.Item as={NavLink} to="/adminpanel" className="nav-dropdown-item">
                                                <i className="bi bi-shield-lock" /> {t('panel')}
                                            </NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as={NavLink} to="/employesassignment" className="nav-dropdown-item">
                                                <i className="bi bi-people" /> {t('assignment')}
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    )}
                                    {role === "HR" && (
                                        <NavDropdown
                                            className={isAdminToolsActive ? "navdropdown-active" : ""}
                                            title={
                                                <>
                                                    <i className="bi bi-person-lock" />{" "}
                                                    <span>HR Tools</span>
                                                </>
                                            }
                                        >
                                            <NavDropdown.Item
                                                as={NavLink}
                                                to="/employesassignment"
                                                className="nav-dropdown-item"
                                            >
                                                <i className="bi bi-people" />{" "}
                                                Assignment
                                            </NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item
                                                as={NavLink}
                                                to="/eventCreator"
                                                className="nav-dropdown-item"
                                            >
                                                <i className="bi bi-calendar-plus" />{" "}
                                                Event Creator
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    )}
                                </Nav>
                                <footer className="mt-auto">
                                    <p className="text-center text-muted small">© 2024 Made by UnhandledException</p>
                                </footer>
                            </Navbar>
                        </div>

                        <Button
                            title="Show/hide sidebar"
                            className="btn-secondary toggle-sidebar-btn"
                            onClick={() => setSidebarVisible(!isSidebarVisible)}
                        >
                            {isSidebarVisible ? <i className="bi bi-arrow-left-square" /> : <i className="bi bi-arrow-right-square" />}
                        </Button>

                        <Container fluid className={`main-content ${isSidebarVisible ? "sidebar-visible" : "sidebar-hidden"}`}>
                            <Navbar expand="lg" className="bg-body-tertiary navbar-horizontal">
                                <Nav className="ms-auto d-flex align-items-center flex-row flex-wrap">
                                    <Button onClick={toggleTheme} className='theme-btn' title='Dark/Light theme'>
                                        {theme === 'night' ? <i className="bi bi-brightness-high" /> : <i className="bi bi-moon" />}
                                    </Button>
                                    <NavDropdown
                                        id="nav-language-dropdown"
                                        title={<img src={`/locales/${normalizeLanguage(i18n.language)}/1x1.svg`} alt={i18n.language} className='nav-language-img' width="30" height="30" />}
                                        align="end"
                                        drop="down"
                                    >
                                        {Object.keys(availableLanguages).map((lng) => (
                                            <NavDropdown.Item key={lng} onClick={() => changeLanguage(lng)}>
                                                <img src={`/locales/${normalizeLanguage(lng)}/4x3.svg`} alt={lng} width="20" height="15" style={{ marginRight: "10px" }} />
                                                {availableLanguages[lng]}
                                            </NavDropdown.Item>
                                        ))}
                                    </NavDropdown>
                                    <NavLink className="nav-link nav-user" to={`/profile/${user?.id}`}>
                                        <div className="d-flex align-items-center">
                                            <span>{user.name} {user.surname}</span>
                                            <Image src={avatar || defaultUserIcon} className="avatar rounded-circle" width={30} height={30} alt="User avatar" />
                                        </div>
                                    </NavLink>
                                    <NavLink title="Notifications" to="/notifications" className="nav-link">
                                        <span className="notification-wrapper">
                                            <i className="bi bi-bell" />
                                            {hasUnread && <span className="unread-dot" />}
                                        </span>
                                    </NavLink>
                                    <NavLink title="Settings" to="/settings" className="nav-link"><i className="bi bi-gear" /></NavLink>
                                    <NavLink title="Logout" to="/logout" onClick={logout} className="nav-link">
                                        <i className="bi bi-box-arrow-right" />
                                    </NavLink>
                                </Nav>
                            </Navbar>
                            {role == null && (
                                <Alert className='alert api-alert' variant='danger'>
                                    <i className="bi bi-exclamation-triangle" /> {t('api-is-offline-try-refreshing-the-page')} <i className="bi bi-exclamation-triangle" />
                                </Alert>
                            )}
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/hrhomepage" element={<HRHomePage />} />
                                <Route path="/tasks" element={<TaskDashboard />} />
                                <Route path="/adminpanel" element={<AdminPanel isAdmin={role === "Admin"} />} />
                                <Route path="/faq" element={<FaqComponent isAdmin={role === "Admin"} />} />
                                <Route path="/employesassignment" element={<EmployesAssignmentSelector />} />
                                <Route path="/taskmanage" element={<TaskManager />} />
                                <Route path="/taskcontentmanage" element={<TaskContentManage />} />
                                <Route path="/taskcontent" element={<TaskContentManage />} />
                                <Route path="/taskcontent/create" element={<TaskContentCreate />} />
                                <Route path="/taskcontent/edit/:id" element={<TaskContentEditPage />} />
                                <Route path="/taskcontent/details/:id" element={<TaskContentDetails />} />
                                <Route path="/editmatlist" element={<EditMatList />} />
                                <Route path="/roadmapmanage" element={<RoadMapManage />} />
                                <Route path="/feedbacks" element={<FeedbackList />} />
                                <Route path="/badges" element={<Badge />} />
                                <Route path="/presetmanage" element={<PresetManage />} />
                                <Route path="/schoolingedit" element={<SchoolingEdit />} />
                                <Route
                                    path="/schoolinglist"
                                    element={role === 'Admin' || role === 'Mentor' ? <SchoolingListMentor /> : <SchoolingListNewbie />}
                                />
                                <Route path="/schoolingpartedit/:id?" element={<SchoolingPartEdit />} />
                                <Route path="/schoolinglistparts" element={<SchoolingListParts />} />
                                <Route path="/preset/assign/:presetId" element={<PresetAssign />} />
                                <Route path="/schoolingdetails" element={<SchoolingDetails />} />
                                <Route path="/schoolingassignment" element={<SchoolingAssignment />} />
                                <Route path="/profile/:userId" element={<UserProfile />} />
                                <Route path="/settings" element={<><h1>Settings</h1></>} />
                                <Route path="/notifications" element={<><NotificationPage /></>} />
                                <Route path="/eventCreator" element={<EventCreator />} />
                            </Routes>
                        </Container>
                        <NotificationToast
                            show={showToast}
                            title={"New Notification"}
                            message={toastMessage}
                            color={"#DB91D1"}
                            time={4000}
                            source={toastSource}
                            onClose={() => setShowToast(false)}
                        />
                    </div>
                    <Button variant="primary" className='ai-button' title="AI Assistant" onClick={handleToggleAIChat}>
                        <i className="bi bi-stars" style={{ fontSize: '1.5rem' }} />
                    </Button>
                    <AIAssistant show={showAIChat} onHide={() => setShowAIChat(false)} />
                </>
            )}
            {!user && <LoginComponent />}
        </>
    );
}

export default App;