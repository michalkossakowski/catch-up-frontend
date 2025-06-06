import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { RoadMapDto } from '../../../dtos/RoadMapDto';
import { addRoadMap, editRoadMap } from '../../../services/roadMapService';
import './RoadMapEditModal.css';

interface RoadMapEditModalProps {
  isOpen: boolean;
  onClose: (success: boolean, isEdit: boolean) => void;
  newbieId: string | undefined;
  roadMap?: RoadMapDto | null;
}

const RoadMapEditModal: React.FC<RoadMapEditModalProps> = ({ isOpen, onClose, newbieId, roadMap }) => {
  const isEditMode = !!roadMap;
  const [title, setTitle] = useState<string>(roadMap?.title || '');
  const [description, setDescription] = useState<string>(roadMap?.description || '');
  const [isTitleValid, setTitleValid] = useState<boolean>(false);
  const [isDescriptionValid, setDescriptionValid] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(roadMap?.title || '');
      setDescription(roadMap?.description || '');
      setTitleValid((roadMap?.title?.length || 0) >= 3);
      setDescriptionValid((roadMap?.description?.length || 0) >= 5);
    }
  }, [isOpen, roadMap]);

  const validateTitle = (value: string) => {
    setTitleValid(value.length >= 3);
    setTitle(value);
  };

  const validateDescription = (value: string) => {
    setDescriptionValid(value.length >= 5);
    setDescription(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isTitleValid || !isDescriptionValid) {
      return;
    }

    const roadMapData: RoadMapDto = {
      id: roadMap?.id,
      title,
      description,
      newbieId,
    };

    try {
      if (isEditMode) {
        await editRoadMap(roadMapData);
      } else {
        await addRoadMap(roadMapData);
      }
      onClose(true, isEditMode);
      setTitle('');
      setDescription('');
      setTitleValid(false);
      setDescriptionValid(false);
    } catch (error) {
      console.error(`${isEditMode ? 'Editing' : 'Adding'} RoadMap failed:`, error);
      onClose(false, isEditMode);
    }
  };

  const handleCancel = () => {
    onClose(false, isEditMode);
  };

  return (
    <Modal show={isOpen} onHide={handleCancel} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditMode ? 'Edit Road Map' : 'Add new Road Map'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="edit-roadmap-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              className={`form-control ${!isTitleValid ? 'is-invalid' : ''}`}
              value={title}
              onChange={(e) => validateTitle(e.target.value)}
              required
            />
            {!isTitleValid && (
              <div className="invalid-feedback">Title must be at least 3 characters long.</div>
            )}
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              className={`form-control ${!isDescriptionValid ? 'is-invalid' : ''}`}
              value={description}
              onChange={(e) => validateDescription(e.target.value)}
              required
            />
            {!isDescriptionValid && (
              <div className="invalid-feedback">
                Description must be at least 5 characters long.
              </div>
            )}
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
          disabled={!isTitleValid || !isDescriptionValid}
        >
          {isEditMode ? 'Save' : 'Add'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoadMapEditModal;