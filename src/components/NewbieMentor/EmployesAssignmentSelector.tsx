import React, { useState } from 'react';
import AssignMentorToNewbie from './AssignMentorToNewbie'; 
import AssignNewbieToMentor from './AssignNewbieToMentor'; 

const EmployesAssignmentSelectorComponent = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="text-center">
      <h1 className='title'><i className="bi bi-people"/> Select Assignment Model</h1>
      <div className="d-flex justify-content-center">
        <button
          onClick={() => setSelectedOption('mentorToNewbie')}
          className={`btn me-3 ${
            selectedOption === 'mentorToNewbie' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          Assign Mentor To Newbie
        </button>
        <button
          onClick={() => setSelectedOption('newbieToMentor')}
          className={`btn ${
            selectedOption === 'newbieToMentor' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          Assign Newbie To Mentor
        </button>
      </div>
      <div>
        {selectedOption === 'mentorToNewbie' && <AssignMentorToNewbie />}
        {selectedOption === 'newbieToMentor' && <AssignNewbieToMentor />}
      </div>
    </div>
  );
};

export default EmployesAssignmentSelectorComponent;
