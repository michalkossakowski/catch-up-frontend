import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { FeedbackDto } from '../../dtos/FeedbackDto';
import { UserDto } from '../../dtos/UserDto';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';
import { addFeedback } from '../../services/feedbackService';
import { getAdmins } from '../../services/userService';
import NotificationToast from '../Toast/NotificationToast';
import { useAuth } from '../../Provider/authProvider';
import MaterialItem from '../MaterialManager/MaterialItem';

interface AddFeedbackDialogProps {
    resourceId: number;
    resourceType: ResourceTypeEnum;
    receiverId: string;
    onClose: () => void;
    onShowToast: (message: string, color: string) => void; // nowy callback
}

export const AddFeedbackDialog: React.FC<AddFeedbackDialogProps> = ({ resourceId, resourceType, receiverId, onClose, onShowToast }) => {
    const { user } = useAuth();
    const [admins, setAdmins] = useState<UserDto[]>([]);
    const [chosen, setChosen] = useState(false);
    const [materialId, setMaterialId] = useState<number | null>(null);
    const [isTitleValid, setTitleValidation] = useState<boolean>(false);
    const [isReceiverValid, setReceiverValidation] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<FeedbackDto>({
        title: '',
        description: '',
        senderId: user?.id || '',
        receiverId,
        resourceType,
        resourceId,
        resourceName: '',
        isResolved: false,
        createdDate: new Date(),
    });

    useEffect(() => {
        const loadAdmins = async () => {
            try {
                const adminList = await getAdmins();
                setAdmins(adminList);
            } catch {
                onShowToast('Failed to load administrators', 'red');
            }
        };
        loadAdmins();
    }, []);

    const validateTitle = (title: string) => {
        setTitleValidation(title.length >= 5);
        setFeedback({ ...feedback, title: title });
    };

    const validateReceiver = (receiver: string) => {
        setReceiverValidation(receiver !== null);
        setFeedback({ ...feedback, receiverId: receiver });
    };

    const materialCreated = (materialId: number) => {
        setMaterialId(materialId);
        setFeedback({ ...feedback, materialId: materialId });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addFeedback(feedback);
            onShowToast('Feedback successfully added', 'green');
            onClose();
        } catch {
            onShowToast('Failed to submit feedback', 'red');
        }
    };

    return (
        <Modal show={true} onHide={onClose} size='xl'>
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
                            className={`form-control ${!isTitleValid ? 'is-invalid' : ''}`}
                            value={feedback.title}
                            onChange={(e) => validateTitle(e.target.value)}
                        />
                        {!isTitleValid && (
                            <div className="invalid-feedback">
                                The title must be at least 5 characters long
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={feedback.description}
                            onChange={(e) => setFeedback({ ...feedback, description: e.target.value })}
                        />
                    </Form.Group>

                    {(feedback.receiverId === "" || chosen) && (
                        <Form.Group className="mb-3">
                            <Form.Label>Receiver</Form.Label>
                            <Form.Select
                                required
                                value={feedback.receiverId}
                                className={`form-control ${!isReceiverValid ? 'is-invalid' : ''}`}
                                onChange={(e) => {
                                    validateReceiver(e.target.value);
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

                    <MaterialItem
                        materialId={materialId ?? undefined}
                        materialCreated={materialCreated}
                        enableAddingFile
                        enableDownloadFile
                        enableRemoveFile
                        enableEdittingMaterialName
                    />

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={!isTitleValid || feedback.receiverId === ""}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
