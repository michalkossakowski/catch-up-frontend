import React, { useState, useEffect } from 'react';
import './UpcomingEvents.css';
import CalendarModal from '../CalendarModal';
import { useAuth } from '../../../Provider/authProvider';
import axiosInstance from '../../../../axiosConfig';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

const UpcomingEvents: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); 

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get(`/Event/GetUserEvents/${userId}`);
        setEvents(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  return (
    <div className="upcoming-events-container">
      <h2>Upcoming Events</h2>

      {loading && <p>Loading events...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && events.length === 0 && (
        <p>No upcoming events found.</p>
      )}

      {!loading && !error && events.length > 0 && (
        <ul className="ul">
          {events.map((event) => (
            <li
              key={event.id}
              className="event-item"
              onClick={() => setSelectedEvent(event)} 
            >
              <hr className="event-divider" />
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>
                <strong>Start:</strong>{' '}
                {new Date(event.startDate).toLocaleString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </p>
              <p>
                <strong>End:</strong>{' '}
                {new Date(event.endDate).toLocaleString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </p>
            </li>
          ))}
        </ul>
      )}

      <button className="btn btn-primary calendar-button" onClick={openModal}>
        <i className="bi-calendar-event" /> Open Calendar
      </button>

      <CalendarModal
        isOpen={isModalOpen}
        onClose={closeModal}
        userId={userId}
      />

      {selectedEvent && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title w-100 text-center fw-bold">{selectedEvent.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedEvent(null)}
                ></button>
              </div>
              <div className="modal-body" style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                <p className="fw-bold">
                  {new Date(selectedEvent.startDate).toLocaleString()} -{' '}
                  {new Date(selectedEvent.endDate).toLocaleString()}
                </p>
                <p>{selectedEvent.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;