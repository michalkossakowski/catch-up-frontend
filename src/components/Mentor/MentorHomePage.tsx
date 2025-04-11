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
            onClick={() => navigate("/mentees")}
          >
            View Mentees
          </button>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Tasks</h5>
          <p className="card-text">
            Assign and review tasks for your mentees.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/tasks")}
          >
            Manage Tasks
          </button>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Resources</h5>
          <p className="card-text">
            Share helpful resources with your mentees.
          </p>
          <button
            className="btn btn-success"
            onClick={() => navigate("/resources")}
          >
            View Resources
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