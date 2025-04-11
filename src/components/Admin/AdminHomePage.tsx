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
          <h5 className="card-title">Manage Users</h5>
          <p className="card-text">
            Add, edit, or remove users from the system.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/usermanagement")}
          >
            Manage Users
          </button>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Manage Events</h5>
          <p className="card-text">
            Create and manage events for the organization.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/eventmanagement")}
          >
            Manage Events
          </button>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">System Settings</h5>
          <p className="card-text">
            Configure system-wide settings and preferences.
          </p>
          <button
            className="btn btn-success"
            onClick={() => navigate("/settings")}
          >
            View Settings
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