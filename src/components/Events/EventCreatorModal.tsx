import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import { useAuth } from '../../Provider/authProvider';
import NotificationToast from '../Toast/NotificationToast';
import './EventCreatorModal.css';

const EventCreatorModal: React.FC<{ show: boolean; onClose: () => void }> = ({ show, onClose }) => {
  const { user, getRole } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const ownerId = user?.id;
  const navigate = useNavigate();
  const [eventType, setEventType] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState('');
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTitleValid, setTitleValid] = useState<boolean>(false);
  const [isDescriptionValid, setDescriptionValid] = useState<boolean>(false);
  const [isPositionValid, setPositionValid] = useState<boolean>(false);
  const [isTypeValid, setTypeValid] = useState<boolean>(false);
  const [isStartDateValid, setStartDateValid] = useState<boolean>(false);
  const [isEndDateValid, setEndDateValid] = useState<boolean>(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('');

  const validateTitle = (value: string) => {
    setTitleValid(value.length >= 3);
    setTitle(value);
  };

  const validateDescription = (value: string) => {
    setDescriptionValid(value.length >= 10);
    setDescription(value);
  };

  const validatePosition = (value: string) => {
    setPositionValid(value.length >= 3);
    setPosition(value);
  };

  const validateType = (value: string) => {
    const validRoles = ['Newbie', 'Mentor', 'HR', 'Admin'];
    setTypeValid(validRoles.includes(value));
    setType(value);
  };

  const validateStartDate = (value: string) => {
    const now = new Date();
    const start = new Date(value);
    setStartDateValid(start >= now);
    setStartDate(value);
  };

  const validateEndDate = (value: string) => {
    const start = new Date(startDate);
    const end = new Date(value);
    setEndDateValid(end >= start);
    setEndDate(value);
  };

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !isTitleValid ||
      !isDescriptionValid ||
      !isStartDateValid ||
      !isEndDateValid ||
      (eventType === 'position' && !isPositionValid) ||
      (eventType === 'type' && !isTypeValid)
    ) {
      setMessage('Please fill in all required fields correctly.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedStartDate = new Date(startDate).toISOString();
      const formattedEndDate = new Date(endDate).toISOString();

      let endpoint = '';
      let params: any = { ownerId, title, description, startDate: formattedStartDate, endDate: formattedEndDate };

      if (eventType === 'position') {
        endpoint = '/Event/AddEventByPosition';
        params.position = position;
      } else if (eventType === 'type') {
        endpoint = '/Event/AddEventByType';
        params.type = type;
      } else if (eventType === 'allGroups') {
        endpoint = '/Event/AddEventForAllGroups';
      }

      await axiosInstance.post(endpoint, null, { params });

      setToastMessage('Event successfully added');
      setToastColor('green');
      setShowToast(true);

      const userRole = await getRole();
      setRole(userRole);

      setTimeout(() => {
        setIsSubmitting(false);
        setTitle('');
        setDescription('');
        setPosition('');
        setType('');
        setStartDate('');
        setEndDate('');
        setEventType(null);
        onClose();
      }, 2000);
    } catch (error: any) {
      setToastMessage(error.response?.data?.message || 'Failed to create event');
      setToastColor('red');
      setShowToast(true);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleCreateEvent}>
          <div className="mb-3">
            <label className="form-label">Select Event Type</label>
            <select
              className="form-select"
              value={eventType || ''}
              onChange={(e) => setEventType(e.target.value)}
              required
            >
              <option value="" disabled>
                -- Select Event Type --
              </option>
              <option value="position">By Position</option>
              <option value="type">By Type</option>
              <option value="allGroups">For All Groups</option>
            </select>
          </div>

          {eventType && (
            <>
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
                  <div className="invalid-feedback">End date must be greater than or equal to the start date.</div>
                )}
              </div>
            </>
          )}

          {eventType === 'position' && (
            <div className="mb-3">
              <label className="form-label">Position</label>
              <input
                type="text"
                className={`form-control ${!isPositionValid ? 'is-invalid' : ''}`}
                value={position}
                onChange={(e) => validatePosition(e.target.value)}
                required
              />
              {!isPositionValid && (
                <div className="invalid-feedback">Position must be at least 3 characters long.</div>
              )}
            </div>
          )}

          {eventType === 'type' && (
            <div className="mb-3">
              <label className="form-label">Type</label>
              <select
                className={`form-control ${!isTypeValid ? 'is-invalid' : ''}`}
                value={type}
                onChange={(e) => validateType(e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="Newbie">Newbie</option>
                <option value="Mentor">Mentor</option>
                <option value="HR">HR</option>
                <option value="Admin">Admin</option>
              </select>
              {!isTypeValid && <div className="invalid-feedback">Type must be selected.</div>}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              isSubmitting ||
              !isTitleValid ||
              !isDescriptionValid ||
              !isStartDateValid ||
              !isEndDateValid ||
              (eventType === 'position' && !isPositionValid) ||
              (eventType === 'type' && !isTypeValid)
            }
          >
            Create Event
          </button>
        </form>
        <NotificationToast
          show={showToast}
          title="Event Operation"
          message={toastMessage}
          color={toastColor}
          onClose={() => setShowToast(false)}
        />
      </Modal.Body>
      <NotificationToast
        show={showToast}
        title="Event Operation"
        message={toastMessage}
        color={toastColor}
        onClose={() => setShowToast(false)}
      />
    </Modal>
  );
};

export default EventCreatorModal;