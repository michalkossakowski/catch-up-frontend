import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import CalendarNewbie from './CalendarNewbie';
const NewbieHomePage: React.FC = () => {
  const navigate = useNavigate(); 

  return (
    <div className="container mt-4">
      <h1>Welcome to the Newbie Dashboard!</h1>
      <p className="lead">
        Here you can find resources, tasks, and updates to help you get started.
      </p>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Your Tasks</h5>
          <p className="card-text">
            Check out your assigned tasks and start working on them.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/tasks")} 
          >
            View Tasks
          </button>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Resources</h5>
          <p className="card-text">
            Access helpful resources to guide you through your onboarding process.
          </p>
          <button className="btn btn-secondary"
           onClick ={() =>navigate("/schoolinglist")}>View Resources</button>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Contact Your Mentor</h5>
          <p className="card-text">
            Need help? Reach out to your mentors for guidance and support.
          </p>
          <button className="btn btn-success">Contact Mentor</button>
        </div>
      </div>
      <div>
         <CalendarNewbie/>
        </div>
    </div>
  );
};

export default NewbieHomePage;