import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { getUserEvents } from '../../services/eventService';
import EventDetailsModal from './EventDetailsModal';
import { EventDto } from '../../dtos/EventDto';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string; 
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventDto | null>(null);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        setLoading(true);
        const data = await getUserEvents();
        setEvents(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching events.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUserEvents();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Calendar</h2>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : (
              <Calendar<EventDto>
                localizer={localizer}
                events={events.map(e => ({
                  ...e,
                  start: new Date(e.startDate),
                  end: new Date(e.endDate),
                }))}
                startAccessor={(event) => new Date(event.startDate)}
                endAccessor={(event) => new Date(event.endDate)}
                titleAccessor={(event) => event.title}
                tooltipAccessor={(event) => event.description}
                onSelectEvent={(event) => setSelectedEvent(event)}
                eventPropGetter={() => ({
                  style: { backgroundColor: '#DB91D1', color: 'white' },
                })}
                style={{ height: 500, margin: '0.1rem' }}
              />
              )}
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
};

export default CalendarModal;
