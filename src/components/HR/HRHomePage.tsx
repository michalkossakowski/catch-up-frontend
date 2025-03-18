import React from 'react';
import UnassignedNewbiesList from './UnassignedNewbiesList';

const HRHomePage: React.FC = () => {
  return (
    <div className="container mt-5">
      <h1 className="display-4 text-primary">Welcome to the HR Dashboard</h1>
      <div className="col-md-4">
          <UnassignedNewbiesList />
      </div>
    </div>
  );
};

export default HRHomePage;