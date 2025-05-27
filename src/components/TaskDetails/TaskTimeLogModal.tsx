import React, { useEffect } from "react";
import { Modal, Form, ModalBody, Button } from 'react-bootstrap';
import { useState } from 'react';
import MaterialItem from '../MaterialManager/MaterialItem';
import { TaskTimeLogDto } from "../../dtos/TaskTimeLogDto";

interface TaskTimeLogModalProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (data: TaskTimeLogDto) => void;
    initialData?: TaskTimeLogDto;
    taskId?: number;    
}

const TaskTimeLogModal: React.FC<TaskTimeLogModalProps> = ({show, handleClose, handleSave, initialData,taskId }) => {
    const [formData, setFormData] = useState<TaskTimeLogDto>(
    initialData || { description: '', taskId: taskId, hours: 0, minutes: 0}
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ description: '', taskId: taskId, hours: 0, minutes: 0 });
    }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave(formData);
        setFormData({ description: '', taskId: taskId, hours: 0, minutes: 0 });
        handleClose();
    };
    const materialCreated = (materialId: number) => {
        setFormData((prev) => ({ ...prev, materialId }));
    };
    return(
        <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? 'Edit comment' : 'Add comment'}</Modal.Title>
            </Modal.Header>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formHours">
                        <Form.Label>Hours</Form.Label>
                        <Form.Control
                            type="number"
                            name="hours"
                            value={formData.hours}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formMinutes">
                        <Form.Label>Minutes</Form.Label>
                        <Form.Control
                            type="number"
                            name="minutes"
                            value={formData.minutes}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                </Form>
            </ModalBody>
        </Modal>
        </>
    );
};

export default TaskTimeLogModal;