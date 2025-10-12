import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmModalProps {
    show: boolean;
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function ConfirmModal({ show, title,  message, onCancel, onConfirm }: ConfirmModalProps): React.ReactElement{
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton> 
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="success" onClick={onConfirm}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};