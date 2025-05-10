import React, { useState } from 'react';
import EventCreatorModal from './EventCreatorModal';
import HomeCard from '../Home/HomeCard/HomeCard';
const EventCreator: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    return (
        <>

            <HomeCard
                title="Create Events"
                description="Create events for newbies, mentors and other staff."
                iconName="bi-calendar-event"
                path="#"
                onClick={() => setShowEventModal(true)}
            />

            <EventCreatorModal
                show={showModal}
                onClose={() => setShowModal(false)}
            />
            <EventCreatorModal
                        show={showEventModal}
                        onClose={() => setShowEventModal(false)} // Zamknięcie modala
                    /> 
        </>
        
    );
};

export default EventCreator;