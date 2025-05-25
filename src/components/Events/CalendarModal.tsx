import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import axiosInstance from '../../../axiosConfig';

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

interface Event {
  title: string;
  description: string;
  start: Date;
  end: Date;
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | undefined;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, userId }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchHistoryEvents = async () => {
      try {
        if (!userId) {
          throw new Error('You must be logged in to view this page.');
        }

        const response = await axiosInstance.get(`/Event/GetUserEvents/${userId}`);
        const data = response.data;

        const mappedEvents = data.map((event: any) => ({
          title: event.title,
          description: event.description,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
        }));

        setEvents(mappedEvents);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching events.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryEvents();
  }, [userId]);

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
                <>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, margin: '0.1rem' }}
                    tooltipAccessor={(event: Event) => event.description}
                    onSelectEvent={(event: Event) => setSelectedEvent(event)}
                    eventPropGetter={() => ({
                      style: { backgroundColor: '#DB91D1', color: 'white' },
                    })}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

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
                  {selectedEvent.start.toLocaleDateString('en-GB')} {selectedEvent.start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} -{' '}
                  {selectedEvent.end.toLocaleDateString('en-GB')} {selectedEvent.end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <br />
                <p>{selectedEvent.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarModal;