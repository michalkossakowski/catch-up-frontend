import React, { useState } from 'react';
import './UpcomingEvents.css'; 
import CalendarModal from '../CalendarModal'; 
import './UpcomingEvents.css';
import { useAuth } from '../../../Provider/authProvider';

const UpcomingEvents: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="upcoming-events-container">
        Place for upcoming events
        <button className="btn btn-primary calendar-button" onClick={openModal}>
          <i className='bi-calendar-event'/> Open Calendar
        </button>
        <CalendarModal isOpen={isModalOpen} onClose={closeModal} userId={userId} />
    </div>
  );
};

export default UpcomingEvents;