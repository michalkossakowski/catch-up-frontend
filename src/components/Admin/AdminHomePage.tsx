import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Provider/authProvider';
import CalendarNewbie from '../Newbie/CalendarNewbie';

const AdminHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container mt-4">
      <h1>Welcome to the Admin Dashboard!</h1>
      <p className="lead">
        Here you can manage users, events, and system settings.
      </p>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Admin Panel</h5>
          <p className="card-text">  
            Add users to system.  
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/adminpanel")}
          >
            Manage Users
          </button>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Create New Event</h5>
          <p className="card-text">
            Create new events for newbies, mentors and other staff to manage their onboarding process or learn new technologies.
          </p>
          <button
            className="btn btn-secondary"
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
           onClick ={() =>navigate("/employesassignment ")}
           >Assignments
           </button>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Create New Task Preset</h5>
          <p className="card-text">
            Create new task presets for your mentees to follow.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/presetmanage")}
          >
            Create Preset
          </button>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Manage Task Content</h5>
          <p className="card-text">
            Create and manage task content for your mentees.
          </p>
          <button
            className="btn btn-secondary" 
            onClick={() => navigate("/taskcontentmanage")}
          >
            View Mentees
          </button>
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Roadmap Manager</h5>
          <p className="card-text">
            Create and manage roadmaps for your mentees to follow.
          </p>
          <button
            className="btn btn-success"
            onClick={() => navigate("/roadmapmanage")}
          >
            Manage Roadmaps
          </button>
        </div>
      </div>

      <div>
        <CalendarNewbie />
      </div>
    </div>
  );
};

export default AdminHomePage;