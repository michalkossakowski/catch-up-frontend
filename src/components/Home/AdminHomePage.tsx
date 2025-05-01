import React from 'react';
import HomeCard from './HomeCard/HomeCard';
import './Home.css';
import UpcomingEvents from '../Events/UpcomingEvents/UpcomingEvents';

const AdminHomePage: React.FC = () => {

  return (
    <>
      <h1 className="title"><i className='bi bi-house-door'/> Welcome to the Admin Dashboard!</h1>
      <p className="lead">
        Here you can manage users, events, and system settings.
      </p>
      <div className="home-container">
        <div className="home-cards-container">
          <HomeCard
            title="Tasks Manager" 
            description="Assign, process and manage tasks for your newbies." 
            iconName="bi-list-check" 
            path="/taskmanage"
          />
          
          <HomeCard
            title="Add Users" 
            description="Add new users to your organization." 
            iconName="bi-person-plus" 
            path="/adminpanel"
          />

          <HomeCard
            title="Create Events" 
            description="Create new events for newbies, mentors and other staff." 
            iconName="bi-calendar-event" 
            path="/eventCreator"
          />

          <HomeCard
            title="Assignments" 
            description=" Assign newbies to mentors and manage their onboarding process." 
            iconName="bi-people" 
            path="/employesassignment"
          />

          <HomeCard
            title="Task Presets" 
            description="Create new task presets for your mentees to follow." 
            iconName="bi-stack-overflow" 
            path="/presetmanage"
          />

          <HomeCard
            title="Task Contents" 
            description="Create new task presets for your mentees to follow." 
            iconName="bi-kanban" 
            path="/taskcontentmanage"
          />
          
          <HomeCard
            title="Roadmaps" 
            description="Create and manage roadmaps for your newbies to follow." 
            iconName="bi-compass" 
            path="/roadmapmanage"
          />

          <HomeCard
            title="Feedbacks" 
            description="Explore and manage feedbacks from your newbies." 
            iconName="bi-arrow-clockwise" 
            path="/feedbacks"
          />
        </div>

        <div className="home-events-container">
          <UpcomingEvents />
        </div>
      </div>
    </>
  );
};

export default AdminHomePage;