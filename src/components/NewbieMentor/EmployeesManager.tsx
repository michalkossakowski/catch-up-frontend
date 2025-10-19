import React, { useState } from 'react';
import ManageNewbies from './NewbieManager';
import ManageMentors from './MentorManager';

const EmployeesManagerComponent: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div >
      <h1 className='title'><i className='bi bi-people'/> Assign Mentors and Newbies</h1>
      {selectedOption == undefined ? (
        <>
          <div className="d-flex justify-content-center align-items-center">
            <div className="assignment-card"
            onClick={() => setSelectedOption('mentorToNewbie')}>
              <i className="bi bi-mortarboard" /> 
              <h2>Newbies</h2>
              <p>Assign mentors for selected newbie</p>
            </div>
            
            <div className="assignment-separator">
            </div>
            
            <div className="assignment-card"
            onClick={() => setSelectedOption('newbieToMentor')}>
              <i className="bi bi-feather" /> 
              <h2>Mentors</h2>
              <p>Assign newbies for selected mentor</p>
            </div>
          </div>
        </>
      ):(
        <div className="d-flex justify-content-center">
          <button 
            onClick={() => setSelectedOption('mentorToNewbie')}
            className={`btn me-3 manage-assign-button  ${
              selectedOption === 'mentorToNewbie' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            <i className='bi bi-mortarboard'/> Manage Newbies
          </button>
          <button
            onClick={() => setSelectedOption('newbieToMentor')}
            className={`btn manage-assign-button  ${
              selectedOption === 'newbieToMentor' ? 'btn-primary' : 'btn-secondary'
            }`}
          >   
            <i className='bi bi-feather'/> Manage Mentors
          </button>
        </div>

      )}

      <div>
        {selectedOption === 'mentorToNewbie' && <ManageNewbies />}
        {selectedOption === 'newbieToMentor' && <ManageMentors />}
      </div>
    </div>
  );
};

export default EmployeesManagerComponent;