import React from 'react';
import UnassignedNewbiesList from './UnassignedNewbiesList';
import CalendarHR from '../Newbie/CalendarNewbie';
import { useNavigate } from 'react-router-dom'; 
const HRHomePage: React.FC = () => {
  const navigate = useNavigate(); 
  return (
    <div className="container mt-4">
      <h1>Welcome to the HR Dashboard!</h1>
      <p className="lead">
        Here you can see new employees, incomming event and crate new ones.
      </p>
      <br />
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Create New Event</h5>
          <p className="card-text">
            Create new events for newbies, mentors and other staff to manage their onboarding process or learn new technologies.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/eventCreator")}
          >
            Create Event
          </button>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Go to Assignments</h5>
          <p className="card-text">
            Assign newbies to mentors and manage their onboarding process.
          </p>
          <button className="btn btn-secondary"
           onClick ={() =>navigate("/employesassignment ")}>Assignments</button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <UnassignedNewbiesList />
        </div>
        <div className="col-md-8">
          <CalendarHR />
        </div>
      </div>
    </div>
  );
};

export default HRHomePage;