import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import './NotificationToast.css'; 

interface NotificationToastProps {
    show: boolean;
    title: string;
    message: string;
    color?: string;
    onClose: () => void;
}

export default function NotificationToast({ show, title, message, color, onClose }: NotificationToastProps): React.ReactElement{
    return (
        <ToastContainer position="bottom-end" className="p-3 m-3 notificationToast">
            <Toast onClose={onClose} show={show} delay={2000} autohide>
                <Toast.Header>
                    <strong className="me-auto">{title}</strong>
                </Toast.Header>
                <Toast.Body style={{color: color}}>
                    {message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
};