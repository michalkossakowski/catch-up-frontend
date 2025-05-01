import React from 'react';
import HomeCard from './HomeCard/HomeCard';
import './Home.css';
import UpcomingEvents from '../Events/UpcomingEvents/UpcomingEvents';
import { useAuth } from '../../Provider/authProvider';

const NewbieHomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <h1 className="title"><i className='bi bi-house-door'/> Welcome to the Newbie Dashboard!</h1>
      <p className="lead">
        Here you can find resources, tasks, and updates to help you get started.
      </p>
      <div className="home-container">
        <div className="home-cards-container">          
          <HomeCard
            title="Tasks" 
            description="Check out your assigned tasks and start working on them." 
            iconName="bi-list-check" 
            path="/tasks"
          />
          
          <HomeCard
            title="Schoolings" 
            description="Access helpful schoolings to learn and grow." 
            iconName="bi-book" 
            path="/schoolinglist"
          />

          <HomeCard
            title="Roadmaps" 
            description="Process roadmaps to guide your learning journey." 
            iconName="bi-compass" 
            path="/roadmapexplore"
          />

          <HomeCard
            title="Feedbacks" 
            description="Explore yours feedbacks." 
            iconName="bi-arrow-clockwise" 
            path="/feedbacks"
          />
          
          <HomeCard
            title="FAQ" 
            description="Find answear for frequently asked questions." 
            iconName="bi-question-circle" 
            path="/faq"
          />
          
          <HomeCard
            title="Yours Mentors" 
            description="View your profile and assigned mentors." 
            iconName="bi-person" 
            path={`/profile/${user?.id}`}
          />
          
          <HomeCard
            title="Settings" 
            description="Customize your application preferences." 
            iconName="bi-gear" 
            path="/settings"
          />
          
          <HomeCard
            title="Notifications" 
            description="Check your notifications and updates." 
            iconName="bi-bell" 
            path="/notifications"
          />

        </div>        

        <div className="home-events-container">
          <UpcomingEvents />
        </div>
      </div>
    </>
  );
};

export default NewbieHomePage;
