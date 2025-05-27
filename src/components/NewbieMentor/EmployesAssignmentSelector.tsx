import React, { useState } from 'react';
import AssignMentorToNewbie from './AssignMentorToNewbie';
import AssignNewbieToMentor from './AssignNewbieToMentor';

const EmployesAssignmentSelectorComponent: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="container text-center mt-5">
      <h1>Choose Assign Model:</h1>
      <div className="d-flex justify-content-center my-4">
        <button
          onClick={() => setSelectedOption('mentorToNewbie')}
          className={`btn me-3 ${
            selectedOption === 'mentorToNewbie' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          Mentor -&gt; Newbie
        </button>
        <button
          onClick={() => setSelectedOption('newbieToMentor')}
          className={`btn ${
            selectedOption === 'newbieToMentor' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          Newbie -&gt; Mentor
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