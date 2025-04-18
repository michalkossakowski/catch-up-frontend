import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Provider/authProvider';
import CalendarNewbie from '../Newbie/CalendarNewbie';

const MentorHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container mt-4">
      <h1>Welcome to the Mentor Dashboard!</h1>
      <p className="lead">
        Here you can manage your mentees, tasks, and resources.
      </p>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Your Mentees</h5>
          <p className="card-text">
            View and manage your assigned mentees.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/profile/" + user?.id)}
          >
            View Mentees
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

export default MentorHomePage;