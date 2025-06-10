import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { RoadMapPointDto } from '../../../dtos/RoadMapPointDto';
import { addRoadMapPoint, editRoadMapPoint } from '../../../services/roadMapPointService';
import './RoadMapPointEditModal.css';

interface RoadMapPointEditModalProps {
  isOpen: boolean;
  onClose: (success: boolean, isEdit: boolean) => void;
  newbieId: string | undefined;
  roadMapPoint?: RoadMapPointDto | null;
  roadMapId?: number;
}

const RoadMapPointEditModal: React.FC<RoadMapPointEditModalProps> = ({ isOpen, onClose, newbieId, roadMapPoint, roadMapId }) => {
  const isEditMode = !!roadMapPoint;
  const [name, setName] = useState<string>(roadMapPoint?.name || '');
  const [isNameValid, setNameValid] = useState<boolean>(false); // Domyślnie true, aby nie pokazywać błędu na starcie
  const [deadline, setDeadline] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setName(roadMapPoint?.name || '');
      validateName(roadMapPoint?.name || '');
      if (roadMapPoint?.deadline) {
        let utcDeadline: Date | undefined;
    
        const localDate = new Date(roadMapPoint.deadline);
        utcDeadline = new Date(Date.UTC(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate(),
          localDate.getHours(),
          localDate.getMinutes()
        ));
        setDeadline(utcDeadline.toISOString().slice(0, 16));
      } else {
        setDeadline('');
      }
    }
  }, [isOpen, roadMapPoint]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submit deadline", deadline);
    if (!isNameValid) {
      return;
    }

    let utcDeadline: Date | undefined;
    
    if (deadline) {
      const localDate = new Date(deadline);
      utcDeadline = new Date(Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        localDate.getHours(),
        localDate.getMinutes()
      ));
    }

    const roadMapPointData: RoadMapPointDto = {
      id: roadMapPoint?.id,
      roadMapId: roadMapPoint?.roadMapId || roadMapId,
      name,
      deadline: utcDeadline,
      newbieId,
    };

    try {
      if (isEditMode) {
        await editRoadMapPoint(roadMapPointData);
      } else {
        await addRoadMapPoint(roadMapPointData);
      }
      onClose(true, isEditMode);
      setName('');
      setDeadline('');
    } catch (error) {
      console.error(`${isEditMode ? 'Editing' : 'Adding'} RoadMapPoint failed:`, error);
      onClose(false, isEditMode);
    }
  };

  const handleCancel = () => {
    onClose(false, isEditMode);
  };

  const validateName = (value: string) => {
    const isValid = value.length >= 3 && value.length <= 50;
    setName(value);
    setNameValid(isValid);
  };

  return (
    <Modal show={isOpen} onHide={handleCancel} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditMode ? 'Edit Road Map Point' : 'Add new Road Map Point'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="edit-roadmap-point-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              className={`form-control ${!isNameValid ? 'is-invalid' : ''}`}
              value={name}
              onChange={(e) => validateName(e.target.value)}
              required
            />
            {!isNameValid && (
              <div className="invalid-feedback">
                Name must be between 3 and 50 characters long.
              </div>
            )}
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="deadline">Deadline with time (optional):</label>
            <input
              type="datetime-local"
              id="deadline"
              className="form-control"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isNameValid}
        >
          {isEditMode ? 'Save' : 'Add'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoadMapPointEditModal;