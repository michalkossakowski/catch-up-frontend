import './App.css';
import { Alert, Button, Image, NavDropdown } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home/Home.tsx';
import { useAuth } from './Provider/authProvider';
import Badge from './components/Badge/BadgeComponent';
import FaqComponent from './components/Faq/FaqComponent';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import AddUser from "./components/Admin/AddUser.tsx";
import defaultUserIcon from './assets/defaultUserIcon.jpg';
import UserProfile from './components/User/UserProfile.tsx';
import RoadMapManage from './components/RoadMap/RoadMapManage';
import LoginComponent from './components/Login/LoginComponent';
import PresetManage from "./components/Preset/PresetManage.tsx";
import TaskContentManage from './components/Task/TaskContentManage';
import { Container, Nav, Navbar } from 'react-bootstrap';
import TaskDashboard from "./components/TaskDashboard/TaskDashboard.tsx";
import EmployeesManager from './components/NewbieMentor/EmployeesManager.tsx';
import TaskManager from "./components/TaskDashboard/TaskManager.tsx";
import SchoolingAssignment from './components/Schooling/SchoolingAssignment.tsx';
import PresetAssign from './components/Preset/PresetAssign';
import FeedbackList from './components/Feedback/FeedbackListPage.tsx';
import MaterialTest from './components/MaterialManager/MaterialTest.tsx';
import '../css/catchUpBase.css';
import NotificationPage from './components/Notification/NotificationPage.tsx';
import { startConnection, connection } from "./services/signalRService";
import { NotificationDto } from './dtos/NotificationDto.ts';
import NotificationToast from './components/Toast/NotificationToast.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { setNotifications, addNotification, setNotificationsCount, markNotificationAsRead } from './store/notificationSlice';
import { getNotifications, readNotification } from './services/notificationService';
import TaskContentDetails from './components/Task/TaskContentDetails';
import AIAssistant from './components/AI/AIAssistant.tsx';
import { useTranslation } from "react-i18next";
import "./i18n.ts";
import TaskPage from './components/TaskDetails/TaskPage.tsx';
import {availableLanguages, changeLanguage, normalizeLanguage} from "./i18n.ts";
import RoadMapExplore from './components/RoadMap/RoadMapExplore.tsx';
import RoadMapDetails from './components/RoadMap/RoadMapDetails.tsx';
import Schooling from './components/Schooling/Schooling.tsx';
import SettingsComponent from './components/Settings/Settings.tsx';
import SchoolingList from './components/Schooling/SchoolingList/SchoolingList.tsx';
import SchoolingManager from './components/Schooling/SchoolingManager.tsx';

function App() {
    const { user, getRole, avatar, logout } = useAuth();
    const [role, setRole] = useState<string | null>(null);
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [theme, setTheme] = useState<'night' | 'day'>('night');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hasUnread = useSelector((state: RootState) => state.notifications.hasUnread);
    const notifications = useSelector((state: RootState) => state.notifications.notifications);
    const location = useLocation();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSource, setToastSource] = useState('');
    const notificationSound = new Audio('/Notifications/notification.mp3');
    const notificationDropdownRef = useRef<HTMLDivElement>(null);

    const { t, i18n } = useTranslation();

    const fetchRole = async () => {
        if (user?.id) {
            const userRole = await getRole();
            setRole(userRole);
            startConnection();
            handleNotifications();
            window.userId = user.id;
        }
    };

    useEffect(() => {
        loadTheme();
        fetchRole();
    }, [user?.id]);

    const handleNotifications = async () => {
        const data = await getNotifications(1, 50);
        dispatch(setNotifications(data.notifications));
        dispatch(setNotificationsCount(data.totalCount));

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

    const handleNotificationClick = (notification: NotificationDto) => {
        if (!notification.isRead) {
            dispatch(markNotificationAsRead(notification.notificationId));
            readNotification(notification.notificationId)
        }
        navigate(notification.source);

        if (notificationDropdownRef.current) {
            const dropdownToggle = notificationDropdownRef.current.querySelector('.dropdown-toggle');
            if (dropdownToggle) {
                (dropdownToggle as HTMLElement).click(); 
            }
        }
    };

    const handleSeeMoreNotifications = () => {
        navigate('/notifications');
        if (notificationDropdownRef.current) {
            const dropdownToggle = notificationDropdownRef.current.querySelector('.dropdown-toggle');
            if (dropdownToggle) {
                (dropdownToggle as HTMLElement).click(); 
            }
        }
    };

    const isManageToolsActive = [
        "/taskmanage",
        "/taskcontentmanage",
        "/presetmanage",
        "/roadmapmanage",
        "/schoolinglist"
    ].some(path => location.pathname.startsWith(path));

    const isHRToolsActive = [
        "/adduser",
        "/employeesassignment"
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

    const latestNotifications = notifications.slice(0, 5);

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
                                <Nav className="flex-column w-100" data-tour="left-sidebar">
                                    <NavLink to='/' className="nav-link">
                                        <i className="bi bi-house-door" /> <span>{t('home')}</span>
                                    </NavLink>
                                    {role === "Newbie" && (
                                        <>
                                        <NavLink to="/tasks" className="nav-link left-sidebar">
                                            <i className="bi bi-list-task" /> <span>{t('tasks')}</span>
                                        </NavLink>
                                        <NavLink to="/roadmapexplore" className="nav-link left-sidebar">
                                            <i className="bi bi-compass" /> <span>{t('roadmaps')}</span>
                                        </NavLink>
                                        {/* <NavLink to="/schoolinglist" className="nav-link">
                                            <i className="bi bi-book" /> <span>{t('schoolings')}</span>
                                        </NavLink> */}
                                        </>
                                    )}
                                    <NavLink to="/feedbacks" className="nav-link">
                                        <i className="bi bi-arrow-clockwise" /> <span>{t('feedbacks')}</span>
                                    </NavLink>
                                    {role != "Newbie" &&(
                                        <NavLink to="/badges" className="nav-link">
                                            <i className="bi bi-shield" /> <span>{t('badges')}</span>
                                        </NavLink>
                                    )}
                                    <NavLink to="/faq" className="nav-link" data-tour="faq-nav-link">
                                        <i className="bi bi-question-circle" /> <span>{t('faq')}</span>
                                    </NavLink>
                                    {(role == "Mentor" || role == "Admin") && (
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
                                            <NavDropdown.Item as={NavLink} to="/schoolinglist" className="nav-dropdown-item">
                                                <i className="bi bi-book" /> {t('schoolings')}
                                            </NavDropdown.Item>
                                            <NavDropdown.Divider />
                                        </NavDropdown>
                                    )}
                                    {(role === "Admin" || role == "HR")  && (
                                        <NavDropdown
                                            className={isHRToolsActive ? "navdropdown-active" : ""}
                                            title={<><i className="bi bi-person-lock" /> <span>HR Tools</span></>}
                                        >
                                            <NavDropdown.Item as={NavLink} to="/adduser" className="nav-dropdown-item">
                                                <i className="bi bi-person-plus" /> {t('Add User')}
                                            </NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as={NavLink} to="/employeesassignment" className="nav-dropdown-item">
                                                <i className="bi bi-people" /> Assignment
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    )}
                                </Nav>
                                <footer className="mt-auto">
                                    <p className="text-center text-muted small">© 2024-2025 Made by UnhandledException</p>
                                </footer>
                            </Navbar>
                        </div>

                        <Button
                            title="Show/hide sidebar"
                            className="btn-secondary toggle-sidebar-btn"
                            onClick={() => setSidebarVisible(!isSidebarVisible)}
                            data-tour="hide-sidebar"
                        >
                            {isSidebarVisible ? <i className="bi bi-arrow-left-square" /> : <i className="bi bi-arrow-right-square" />}
                        </Button>

                        <Container fluid className={`main-content ${isSidebarVisible ? "sidebar-visible" : "sidebar-hidden"}`}>
                            <Navbar expand="lg" className="bg-body-tertiary navbar-horizontal">
                                <Nav className="ms-auto d-flex align-items-center flex-row flex-wrap" data-tour="top-navbar">
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
                                    <NavDropdown
                                        id="notifications-dropdown"
                                        ref={notificationDropdownRef}
                                        title={
                                            <span className="notification-wrapper">
                                                <i className="bi bi-bell" />
                                                {hasUnread && <span className="unread-dot" />}
                                            </span>
                                        }
                                        align="end"
                                        className="notifications-dropdown-containter">
                                        <div className="notifications-dropdown text-center">
                                            {latestNotifications.length === 0 ? (
                                                <NavDropdown.ItemText style={{ padding: '10px', width: '260px' }}>
                                                    You don't have any notifications
                                                </NavDropdown.ItemText>
                                            ) : (
                                                <>
                                                    {latestNotifications.map((notification, index) => (
                                                        <div
                                                            key={index}
                                                            className="notification-card-container"
                                                        >
                                                            {!notification.isRead && (
                                                                <small className="text-primary notification-new-nav" >
                                                                    New
                                                                </small>
                                                            )}
                                                            <div
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => handleNotificationClick(notification)}
                                                                className={`notification-card-nav ${!notification.isRead ? 'notification-card-nav-unread' : ''}`}
                                                            >
                                                                <h5 style={{ fontSize: '1rem', marginBottom: '5px' }}>{notification.title}</h5>
                                                                <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>{notification.message}</p>
                                                                <div className="notification-footer" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                                                    <small className="text-primary">
                                                                        See more: {notification.source}
                                                                    </small>
                                                                    <small className="text-muted">
                                                                        {new Date(notification.sendDate).toLocaleString()}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button className='btn btn-primary mb-2 more-notifications' onClick={() => handleSeeMoreNotifications()}>
                                                        See more notifications
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </NavDropdown>
                                    <NavLink title="Settings" to="/settings" className="nav-link"><i className="bi bi-gear" /></NavLink>
                                    <NavLink title="Logout" to="/logout" onClick={logout} className="nav-link" data-tour="top-navbar-logout">
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
                                <Route path="/" element={<Home role={role}/>} /> 
                                <Route path="/home" element={<Home role={role}/>} /> 
                                <Route path="/tasks" element={<TaskDashboard />} />
                                <Route path="/adduser" element={<AddUser/>}/>
                                <Route path="/faq" element={<FaqComponent isAdmin={role === "Admin"} />} />
                                <Route path="/employeesassignment" element={<EmployeesManager />} />
                                <Route path="/taskmanage" element={<TaskManager />} />
                                <Route path="/taskcontentmanage" element={<TaskContentManage />} />
                                <Route path="/taskcontent" element={<TaskContentManage />} />
                                <Route path="/taskcontent/details/:id" element={<TaskContentDetails />} />
                                <Route path="/roadmapmanage" element={<RoadMapManage />} />
                                <Route path="/roadmapexplore" element={<RoadMapExplore manageMode={role == "Admin"||role == "Mentor"} />} />
                                <Route path="/roadmap/:roadMapId/:title" element={<RoadMapDetails manageMode={role == "Admin"||role == "Mentor"}/>} />
                                <Route path="/feedbacks" element={<FeedbackList />} />
                                <Route path="/badges" element={<Badge />} />
                                <Route path="/presetmanage" element={<PresetManage />} />
                                <Route path="/preset/assign/:presetId" element={<PresetAssign />} />
                                <Route path="/profile/:userId" element={<UserProfile />} />
                                <Route path="/settings" element={<SettingsComponent/>} />
                                <Route path="/notifications" element={<><NotificationPage /></>} />
                                <Route path="/material" element={<MaterialTest />} />
                                <Route path="/task/:id" element={<TaskPage />} />
                                <Route path="/schoolingassignment" element={<SchoolingAssignment />} />
                                <Route path="/schooling/:schoolingId/part/:partId" element={<Schooling />} />
                                <Route path="/schooling/:schoolingId/" element={<Schooling />} />
                                <Route path="/schoolinglist" element={<SchoolingList />} />
                                <Route path="/schoolingmanager" element={<SchoolingManager />} />
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
                    <Button variant="primary" className='ai-button' title="AI Assistant" data-tour="ai-assistant" onClick={handleToggleAIChat}>
                        <i className="bi bi-stars" style={{ fontSize: '1.5rem' }} />
                    </Button>
                    <AIAssistant show={showAIChat} onHide={() => setShowAIChat(false)} />
                </>
            )}
            {!user && <LoginComponent toggleTheme={toggleTheme} theme={theme} />}
        </>
    );
}

export default App;