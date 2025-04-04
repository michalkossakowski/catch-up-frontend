import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import axiosInstance from '../../../axiosConfig';
import { useAuth } from '../../Provider/authProvider';
import { useNavigate } from 'react-router-dom';

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
  description: string; // Dodano pole opisu
  start: Date;
  end: Date;
}

const CalendarNewbie: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(true); // Stan kontrolujący widoczność kalendarza
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // Stan dla wybranego wydarzenia
  const navigate = useNavigate();

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="mt-4">
      <h2>Calendar</h2>
      <h3>Upcoming Events</h3>
      <button
        className="btn btn-secondary mb-3"
        onClick={() => setIsCalendarVisible(!isCalendarVisible)}
      >
        {isCalendarVisible ? (
          <i className="bi bi-chevron-up"></i>
        ) : (
          <i className="bi bi-chevron-down"></i>
        )}
      </button>
      {isCalendarVisible && (
        <>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, margin: '20px' }}
            tooltipAccessor={(event: Event) => event.description}
            onSelectEvent={(event: Event) => setSelectedEvent(event)}
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
                      {selectedEvent.start.toDateString()} {selectedEvent.start.toLocaleTimeString()} - {selectedEvent.end.toDateString()} {selectedEvent.end.toLocaleTimeString()}
                    </p>
                    <br />
                    <p>{selectedEvent.description}</p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setSelectedEvent(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CalendarNewbie;