import React from 'react';
import HomeCard from './HomeCard/HomeCard';
import './Home.css';
import UpcomingEvents from '../Events/UpcomingEvents/UpcomingEvents';
import UnassignedNewbiesList from '../HR/UnassignedNewbiesList';

const HRHomePage: React.FC = () => {

  return (
    <>
      <h1 className="title"><i className='bi bi-house-door'/> Welcome to the HR Dashboard!</h1>
      <p className="lead">
        Here you can see new employees, incomming event and crate new ones.
      </p>
      <div className="home-container">
        <div className="home-cards-container">          
          <HomeCard
            title="Add Users" 
            description="Add new users to your organization." 
            iconName="bi-person-plus" 
            path="/adminpanel"
          />

          <HomeCard
            title="Assignments" 
            description=" Assign newbies to mentors and manage their onboarding process." 
            iconName="bi-people" 
            path="/employesassignment"
          />

          <HomeCard
            title="Create Events" 
            description="Create new events for newbies, mentors and other staff." 
            iconName="bi-calendar-event" 
            path="/eventCreator"
          />

          <HomeCard
            title="Feedbacks" 
            description="Explore and manage feedbacks from your newbies." 
            iconName="bi-arrow-clockwise" 
            path="/feedbacks"
          />
        </div>

        <div className="home-extra-container">
          <UnassignedNewbiesList />
        </div>

        <div className="home-events-container">
          <UpcomingEvents />
        </div>

      </div>
    </>
  );
};

export default HRHomePage;
