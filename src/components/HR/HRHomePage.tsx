import React from 'react';
import UnassignedNewbiesList from './UnassignedNewbiesList';
import CalendarHR from './CalendarHR';

const HRHomePage: React.FC = () => {
  return (
    <div className="container mt-5">
      <h1 className="display-4 text-primary">Welcome to the HR Dashboard</h1>
      <br />
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