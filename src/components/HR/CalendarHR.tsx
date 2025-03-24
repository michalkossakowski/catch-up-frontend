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
  start: Date;
  end: Date;
}

const CalendarHR: React.FC = () => {
  const { user } = useAuth(); 
  const userId = user?.id; 

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(true); // Stan kontrolujący widoczność kalendarza
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
        className="btn btn-primary mb-3"
        onClick={() => navigate("/eventCreator")}
      >
        Create New Event
      </button>
      <button
        className="btn btn-secondary mb-3"
        onClick={() => setIsCalendarVisible(!isCalendarVisible)} // Zmiana widoczności kalendarza
      >
        {isCalendarVisible ? (
          <i className="bi bi-chevron-up"></i> // Strzałka w górę
        ) : (
          <i className="bi bi-chevron-down"></i> // Strzałka w dół
        )}
      </button>
      {isCalendarVisible && ( // Renderowanie kalendarza tylko, gdy isCalendarVisible jest true
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: '20px' }}
        />
      )}
    </div>
  );
};

export default CalendarHR;