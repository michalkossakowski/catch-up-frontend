import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { deleteRoadMapPoint } from '../../../services/roadMapPointService';
import './RoadMapPointDeleteModal.css';

interface RoadMapPointDeleteModalProps {
  isOpen: boolean;
  onClose: (deleted: boolean) => void;
  roadMapPointId: number;
  roadMapPointName?: string;
}

const RoadMapPointDeleteModal: React.FC<RoadMapPointDeleteModalProps> = ({ isOpen, onClose, roadMapPointId, roadMapPointName }) => {
  const [deleteTasksInside, setDeleteTasksInside] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await deleteRoadMapPoint(roadMapPointId, deleteTasksInside);
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
        <Modal.Title>Delete Road Map point</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="delete-roadmap-point-form">
          <div className="form-group">
            <p>
              Are you sure you want to delete Road Map point: <strong>{roadMapPointName}</strong> ?
            </p>
            <div className="single-form-switch-container">
              Delete all tasks inside this Road Map point
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

export default RoadMapPointDeleteModal;