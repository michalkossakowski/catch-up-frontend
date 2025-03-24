import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { FeedbackDto } from '../../dtos/FeedbackDto';
import { UserDto } from '../../dtos/UserDto';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';
import { addFeedback } from '../../services/feedbackService';
import { getAdmins } from '../../services/userService';
import NotificationToast from '../Toast/NotificationToast';
import { useAuth } from '../../Provider/authProvider';

interface AddFeedbackDialogProps {
    resourceId: number;
    resourceType: ResourceTypeEnum;
    receiverId: string;
    onClose: () => void;
}

export const AddFeedbackDialog: React.FC<AddFeedbackDialogProps> = ({ resourceId, resourceType, receiverId, onClose }) => {
    const { user } = useAuth();
    const [admins, setAdmins] = useState<UserDto[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('');
    const [chosen, setChosen] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackDto>({
        title: '',
        description: '',
        senderId: user?.id || '',
        receiverId,
        resourceType,
        resourceId,
        resourceName: '',
        isDone: false,
        createdDate: new Date(),
    });
    useEffect(() => {
        const loadAdmins = async () => {
            try {
                const adminList = await getAdmins();
                setAdmins(adminList);
            } catch {
                setToastMessage('Failed to load administrators');
                setToastColor('red');
                setShowToast(true);
            }
        };

        loadAdmins();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await addFeedback(feedback);
            setToastMessage('Feedback successfully added');
            setToastColor('green');
            setShowToast(true);

            setTimeout(() => {
                onClose();
            }, 2000);
        } catch {
            setToastMessage('Failed to submit feedback');
            setToastColor('red');
            setShowToast(true);
        }
    };

    return (
        <>
            <Modal show={true} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={feedback.title}
                                onChange={(e) => setFeedback({ ...feedback, title: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                required
                                value={feedback.description}
                                onChange={(e) => setFeedback({ ...feedback, description: e.target.value })}
                            />
                        </Form.Group>

                        {(feedback.receiverId === ""  || chosen == true) && (
                            <Form.Group className="mb-3">
                                <Form.Label>Receiver</Form.Label>
                                <Form.Select
                                    required
                                    value={feedback.receiverId}
                                    onChange={(e) => {
                                        setFeedback({ ...feedback, receiverId: e.target.value });
                                        setChosen(true);
                                    }}
                                >
                                    <option value="">Select an admin or mentor</option>
                                    {admins.map((admin) => (
                                        <option key={admin.id} value={admin.id}>
                                            {admin.name} {admin.surname}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        )}

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <NotificationToast
                show={showToast}
                title="Feedback Operation"
                message={toastMessage}
                color={toastColor}
                onClose={() => setShowToast(false)}
            />
        </>
    );
};
