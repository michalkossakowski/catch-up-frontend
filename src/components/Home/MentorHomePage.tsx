import React from 'react';
import HomeCard from './HomeCard/HomeCard';
import './Home.css';
import UpcomingEvents from '../Events/UpcomingEvents/UpcomingEvents';
import { useAuth } from '../../Provider/authProvider';

const MentorHomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <h1 className="title"><i className='bi bi-house-door'/> Welcome to the Mentor Dashboard!</h1>
      <p className="lead">
        Here you can manage your mentees, tasks, and resources.
      </p>
      <div className="home-container">
        <div className="home-cards-container">          
          <HomeCard
            title="Your Newbies" 
            description="View and manage your assigned mentees." 
            iconName="bi-people" 
            path={`/profile/${user?.id}`}
          />
          
          <HomeCard
            title="Tasks Manager" 
            description="Assign, process and manage tasks for your newbies." 
            iconName="bi-list-check" 
            path="/taskmanage"
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
          
          <HomeCard
            title="Schoolings" 
            description="Create and manage schoolings for your newbies to follow." 
            iconName="bi-book" 
            path="/schoolinglist"
          />
          
          <HomeCard
            title="Materials" 
            description="Edit and manage materials like pdfs photos videos and other files." 
            iconName="bi-tools" 
            path="/editMatList"
          />
        </div>
        
        <div className="home-events-container">
          <UpcomingEvents />
        </div>
      </div>
    </>
  );
};

export default MentorHomePage;
