import React, { useEffect } from "react";
import { Alert, Card } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { markAsRead } from '../../store/notificationSlice';
import { readNotifications } from '../../services/notificationService';


const NotificationPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { notifications } = useSelector((state: RootState) => state.notifications);

    const handleCardClick = (source: string) => {
        navigate(source);
    };

    useEffect(() => {
        return () => {
            readNotifications();
            dispatch(markAsRead());
        };
    }, [dispatch]);

    return (
        <div>
            <h1><i className="bi bi-bell"/> Notifications</h1>
            <div className="notification-container">
                { notifications.length === 0 ? (
                    <div className='alertBox'>
                        <Alert className='info' variant='danger'>
                            You don’t have any notifications
                        </Alert>
                    </div>
                ) : (
                    notifications.map((notification, index) => (
                        <div className="notification-card-container" key={index} > 
                            {!notification.isRead && (
                                <small className="text-primary notification-new">
                                    New
                                </small>
                            )}
                            <Card 

                                style={{ cursor: 'pointer' }} 
                                onClick={() => handleCardClick(notification.source)}
                                className={`notification-card ${!notification.isRead ? 'notification-card-unread' : ''}`}
                            >
                                <Card.Body>
                                    <Card.Title as="h5">{notification.title}</Card.Title>
                                    <Card.Text>{notification.message}</Card.Text>
                                    <div className="notification-footer">
                                        <small className="text-primary">
                                            See more: {notification.source}
                                        </small>
                                        <small className="text-muted">
                                            {new Date(notification.sendDate).toLocaleString()}
                                        </small>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
export default NotificationPage;
