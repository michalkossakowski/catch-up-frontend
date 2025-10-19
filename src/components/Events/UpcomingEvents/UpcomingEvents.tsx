import React, { useState, useEffect } from 'react';
import './UpcomingEvents.scss';
import CalendarModal from '../CalendarModal';
import { useAuth } from '../../../Provider/authProvider';
import { getUserEvents } from '../../../services/eventService';
import EventDetailsModal from '../EventDetailsModal';
import { EventDto } from '../../../dtos/EventDto';
import Loading from '../../Loading/Loading';
import { Alert } from 'react-bootstrap';

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
      <div className="upcoming-events-container mt-3">
        {loading && (
          <div
            style={{margin: '2rem'}}
          >
            <Loading />
          </div>
        )}
        {error && (
          <div
            style={{margin: '2rem'}}
          >
            <div className="alert alert-danger">{error}</div>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
                    <div
            style={{margin: '2rem'}}
          >
            <Alert>There is no any upcoming events.</Alert>
            <i className="bi bi-calendar-x events-placeholder"></i>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="event-list">
            {events.map((event) => (
              <div className="event-list-element"
                key={event.id}
                onClick={() => setSelectedEvent(event)}
              >
                <h5 className="event-title" >{event.title} {event.isNew && (<span style={{color: '#DB91D1'}}>(New)</span>)}</h5>
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
                <br/>
                <small>Participants: {event.targetUserType || 'Everyone'}</small>
                {event.ownerId == window.userId && (
                  <>
                    <br/>
                    <small className='event-owner'>(You are the owner of this event)</small>
                  </>
                )}
              </div>
            ))}
          </div>
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
        <i className="bi-calendar-event" /> Explore events in calendar
      </button>
    </>
  );
};

export default UpcomingEvents;