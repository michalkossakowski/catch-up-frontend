import React, { useEffect } from "react";
import { TaskCommentDto } from '../../dtos/TaskCommentDto';
import { Modal, Form, ModalBody, Button } from 'react-bootstrap';
import { useState } from 'react';
import MaterialItem from '../MaterialManager/MaterialItem';

interface TaskCommentModalProps {
    show: boolean;
    handleClose: () => void;
    handleSave: (data: TaskCommentDto) => void;
    initialData?: TaskCommentDto;
    taskId?: number;    
}

const TaskCommentModal: React.FC<TaskCommentModalProps> = ({show, handleClose, handleSave, initialData,taskId }) => {
    const [formData, setFormData] = useState<TaskCommentDto>(
    initialData || { content: '', materialId: undefined, taskId: taskId }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ content: '', materialId: undefined, taskId: taskId });
    }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave(formData);
        setFormData({ content: '', materialId: undefined, taskId: taskId });
        handleClose();
    };
    const materialCreated = (materialId: number) => {
        setFormData((prev) => ({ ...prev, materialId }));
    };
    return(
        <>
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? 'Edit Comment' : 'Add Comment'}</Modal.Title>
            </Modal.Header>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formDescription" style={{textAlign:"left"}}>
                        <label>Content:</label>
                        <Form.Control
                        type="text"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        />
                    </Form.Group>
                    <MaterialItem
                        materialId={formData.materialId ?? undefined} 
                        materialCreated={materialCreated} 
                        enableAddingFile={true}
                        enableDownloadFile={true}
                        enableRemoveFile={true}
                        enableEdittingMaterialName={true}
                        >
                    </MaterialItem>
                    <div className="d-flex justify-content-end">
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </div>

                </Form>
            </ModalBody>
        </Modal>
        </>
    );
};

export default TaskCommentModal;