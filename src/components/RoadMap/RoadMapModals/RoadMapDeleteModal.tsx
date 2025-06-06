import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { deleteRoadMap } from '../../../services/roadMapService';
import './RoadMapDeleteModal.css';

interface RoadMapDeleteModalProps {
  isOpen: boolean;
  onClose: (deleted: boolean) => void; // Updated to pass deletion status
  roadMapId: number;
  roadMapTitle?: string;
}

const RoadMapDeleteModal: React.FC<RoadMapDeleteModalProps> = ({ isOpen, onClose, roadMapId, roadMapTitle }) => {
  const [deleteTasksInside, setDeleteTasksInside] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await deleteRoadMap(roadMapId, deleteTasksInside);
      onClose(true);
    } catch (error: any) {
      onClose(false); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose(false);
  };

  return (
    <Modal show={isOpen} onHide={handleCancel} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Road Map</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="delete-roadmap-form">
          <div className="form-group">
            <p>
              Are you sure you want to delete Road Map: <strong>{roadMapTitle}</strong> ?
            </p>
            <div className="single-form-switch-container">
              Delete all tasks inside this Road Map
              <Form>
                <Form.Check
                  type="switch"
                  id="deleteTasksInside"
                  checked={deleteTasksInside}
                  onChange={(e) => setDeleteTasksInside(e.target.checked)}
                />
              </Form>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Deleting...' : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoadMapDeleteModal;