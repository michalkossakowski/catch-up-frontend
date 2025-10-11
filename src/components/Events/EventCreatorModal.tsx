import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useAuth } from '../../Provider/authProvider';
import { addEvent } from '../../services/eventService';
import './EventCreatorModal.css';
import { EventDto } from '../../dtos/EventDto';

interface EventCreatorModalProps {
  show: boolean;
  onClose: () => void;
  onEventAdded: (message: string, color: string, newEvent?: EventDto) => void;
}

const EventCreatorModal: React.FC<EventCreatorModalProps> = ({ show, onClose, onEventAdded }) => {
  const { user } = useAuth();
  const ownerId = user?.id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isTitleValid, setIsTitleValid] = useState(false);
  const [isDescriptionValid, setIsDescriptionValid] = useState(false);
  const [isStartDateValid, setIsStartDateValid] = useState(false);
  const [isEndDateValid, setIsEndDateValid] = useState(false);
  const [isTypeValid, setIsTypeValid] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateTitle = (value: string) => {
    setIsTitleValid(value.trim().length >= 3);
    setTitle(value);
  };

  const validateDescription = (value: string) => {
    setIsDescriptionValid(value.trim().length >= 10);
    setDescription(value);
  };

  const validateStartDate = (value: string) => {
    const now = new Date();
    const start = new Date(value);
    setIsStartDateValid(start >= now);
    setStartDate(value);
  };

  const validateEndDate = (value: string) => {
    const start = new Date(startDate);
    const end = new Date(value);
    setIsEndDateValid(end >= start);
    setEndDate(value);
  };

  const validateType = (value: string) => {
    const validRoles = ['Newbie', 'Mentor', 'HR', 'Admin'];
    setIsTypeValid(value === '' || validRoles.includes(value));
    setType(value);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('');
    setStartDate('');
    setEndDate('');

    setIsTitleValid(false);
    setIsDescriptionValid(false);
    setIsStartDateValid(false);
    setIsEndDateValid(false);
    setIsTypeValid(true);
  };

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isTitleValid || !isDescriptionValid || !isStartDateValid || !isEndDateValid) {
          onEventAdded('Please fill in all required fields correctly.', 'red');
          return;
      }

      setIsSubmitting(true);

      try {
          const createdEvent: EventDto = await addEvent({
              id: 0,
              title,
              description,
              startDate: new Date(startDate).toISOString(),
              endDate: new Date(endDate).toISOString(),
              ownerId,
              targetUserType: type || '',
          });

          onEventAdded('Event successfully added.', 'green', createdEvent);
          
          setTimeout(() => {
              onClose();
              resetForm();
              setIsSubmitting(false);
          }, 50);

      } catch (error: any) {
          setIsSubmitting(false);
          onEventAdded(error.message || 'Failed to create event', 'red');
      }
  };


  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleCreateEvent}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className={`form-control ${!isTitleValid ? 'is-invalid' : ''}`}
              value={title}
              onChange={(e) => validateTitle(e.target.value)}
              required
            />
            {!isTitleValid && (
              <div className="invalid-feedback">Title must be at least 3 characters long.</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className={`form-control ${!isDescriptionValid ? 'is-invalid' : ''}`}
              value={description}
              onChange={(e) => validateDescription(e.target.value)}
              rows={3}
              maxLength={150}
              required
            ></textarea>
            {!isDescriptionValid && (
              <div className="invalid-feedback">Description must be at least 10 characters long.</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="datetime-local"
              className={`form-control ${!isStartDateValid ? 'is-invalid' : ''}`}
              value={startDate}
              onChange={(e) => validateStartDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
            {!isStartDateValid && (
              <div className="invalid-feedback">Start date must be in the future.</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              type="datetime-local"
              className={`form-control ${!isEndDateValid ? 'is-invalid' : ''}`}
              value={endDate}
              onChange={(e) => validateEndDate(e.target.value)}
              min={startDate}
              required
            />
            {!isEndDateValid && (
              <div className="invalid-feedback">End date must be greater than or equal to start date.</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Target Users</label>
            <select
              className={`form-select ${!isTypeValid ? 'is-invalid' : ''}`}
              value={type}
              onChange={(e) => validateType(e.target.value)}
            >
              <option value="">Everyone</option>
              <option value="Newbie">Newbies</option>
              <option value="Mentor">Mentors</option>
              <option value="HR">HR-s</option>
              <option value="Admin">Admins</option>
            </select>
            {!isTypeValid && <div className="invalid-feedback">Invalid type selected.</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={
              isSubmitting ||
              !isTitleValid ||
              !isDescriptionValid ||
              !isStartDateValid ||
              !isEndDateValid
            }
          >
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EventCreatorModal;