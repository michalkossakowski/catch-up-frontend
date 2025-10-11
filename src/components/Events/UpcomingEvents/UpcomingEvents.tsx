import React, { useState, useEffect } from 'react';
import './UpcomingEvents.scss';
import CalendarModal from '../CalendarModal';
import { useAuth } from '../../../Provider/authProvider';
import { getUserEvents } from '../../../services/eventService';
import EventDetailsModal from '../EventDetailsModal';
import { EventDto } from '../../../dtos/EventDto';

interface UpcomingEventsProps {
  events: EventDto[];
  setEvents: React.Dispatch<React.SetStateAction<EventDto[]>>;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, setEvents }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventDto | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      try {
        const fetchedEvents = await getUserEvents();
        setEvents(fetchedEvents);
      } catch (err: any) {
        console.error(err.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [setEvents]);

  return (
    <>
      <h2><i className="bi bi-calendar-week"></i> Upcoming Events</h2>
      <div className="upcoming-events-container">

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
                <h4>{event.title}</h4>
                <small className="text-center">
                  {new Date(event.startDate).toLocaleString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                  {' '}-{' '}
                  {new Date(event.endDate).toLocaleString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </small>
                <p>{event.description}</p>
              </li>
            ))}
          </ul>
        )}

        <CalendarModal
          isOpen={isModalOpen}
          onClose={closeModal}
          userId={user?.id}
        />

        {selectedEvent && (
          <EventDetailsModal
            event={selectedEvent ? {
              id: selectedEvent.id,
              title: selectedEvent.title,
              description: selectedEvent.description,
              start: selectedEvent.startDate,
              end: selectedEvent.endDate,
              ownerId: selectedEvent.ownerId,
            } : null}
            onClose={() => setSelectedEvent(null)}
            onDeleteSuccess={(deletedId) => {
              setEvents(events.filter(e => e.id !== deletedId));
            }}
          />

        )}
      </div>

      <button className="btn btn-primary calendar-button" onClick={openModal}>
        <i className="bi-calendar-event" /> Open Calendar
      </button>
    </>
  );
};

export default UpcomingEvents;