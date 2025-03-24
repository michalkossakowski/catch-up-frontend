import React, { useState } from 'react';
import axiosInstance from '../../../axiosConfig';
import { useAuth } from '../../Provider/authProvider';

const EventCreator: React.FC = () => {
  const { user } = useAuth();
  const ownerId = user?.id;

  const [eventType, setEventType] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // Dodane pole Description
  const [position, setPosition] = useState('');
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateEvent = async () => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Walidacja dat
    if (start < now) {
      setMessage('Start date cannot be in the past.');
      return;
    }

    if (end < start) {
      setMessage('End date must be greater than or equal to the start date.');
      return;
    }

    // Walidacja pól
    if (!title || !description || !startDate || !endDate || (eventType === 'position' && !position) || (eventType === 'type' && !type)) {
      setMessage('Please fill in all required fields.');
      return;
    }

    try {
      const formattedStartDate = start.toISOString();
      const formattedEndDate = end.toISOString();

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

      console.log('Sending data:', params);

      await axiosInstance.post(endpoint, null, { params });

      setMessage('Event created successfully!');
    } catch (error: any) {
      console.error('Error response:', error.response || error);
      setMessage(error.response?.data?.message || 'Failed to create event.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Event</h2>
      {message && <p className={`text-${message.includes('successfully') ? 'success' : 'danger'}`}>{message}</p>}
      <form>
        <div className="mb-3">
          <label className="form-label">Select Event Type</label>
          <select
            className="form-select"
            value={eventType || ''}
            onChange={(e) => setEventType(e.target.value)}
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
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={150}
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Start Date</label>
              <input
                type="datetime-local"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">End Date</label>
              <input
                type="datetime-local"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          </>
        )}

        {eventType === 'position' && (
          <div className="mb-3">
            <label className="form-label">Position</label>
            <select
              className="form-select"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              <option value="" disabled>
                -- Select Position --
              </option>
              <option value="Newbie">Newbie</option>
              <option value="Mentor">Mentor</option>
              <option value="HR">HR</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        )}

        {eventType === 'type' && (
          <div className="mb-3">
            <label className="form-label">Type</label>
            <input
              type="text"
              className="form-control"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
        )}

        {eventType && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCreateEvent}
          >
            Create Event
          </button>
        )}
      </form>
    </div>
  );
};

export default EventCreator;