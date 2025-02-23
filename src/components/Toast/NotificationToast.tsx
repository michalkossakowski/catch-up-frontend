import React from 'react';
import { Button, Toast, ToastContainer } from 'react-bootstrap';
import './NotificationToast.css';
import { useNavigate } from 'react-router-dom';

interface NotificationToastProps {
    show: boolean;
    title: string;
    message: string;
    color?: string;
    time?: number;
    source?: string;
    onClose: () => void;
}

export default function NotificationToast({ show, title, message, color, time, source, onClose }: NotificationToastProps): React.ReactElement{
    const navigate = useNavigate();
    
    const handleCardClick = () => {
        if (source) {
            navigate(source);
        }
    };
    return (
        <ToastContainer position="bottom-end" className="p-3 m-3 notificationToast">
            <Toast onClose={onClose} show={show} delay={time ?? 2000} autohide>
                <Toast.Header>
                    <strong className="me-auto">{title}</strong>
                </Toast.Header>
                <Toast.Body  className="toast-body" style={{color: color}}>
                    <span>{message}</span>
                    { source &&(
                        <small className="text-secondary" onClick={() => handleCardClick()}>
                            See more: {source}
                        </small>
                    )}

                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
};