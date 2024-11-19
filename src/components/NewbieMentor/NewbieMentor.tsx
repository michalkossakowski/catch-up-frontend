import React, { useState, useEffect } from 'react';
import { Button, Alert, Accordion } from 'react-bootstrap';
import NewbieMentorService from '../../services/newbieMentorService';
import { NewbieMentorDto } from '../../dtos/NewbieMentorDto';

const NewbieMentorComponent: React.FC = () => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [newbies, setNewbies] = useState<any[]>([]);
  const [assignedMentors, setAssignedMentors] = useState<NewbieMentorDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    getAllMentors();
    getAllUnassignedNewbies();
  }, []);

  const getAllMentors = async () => {
    try {
      const response = await NewbieMentorService.getAllMentors();
      setMentors(response.data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const getAllUnassignedNewbies = async () => {
    try {
      const response = await NewbieMentorService.getAllUnassignedNewbies();
      setNewbies(response.data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleAssignMentor = async (newbieId: string, mentorId: string) => {
      setMessage('Mentor assigned successfully!');
      getAllMentors(); 
  };

  return (
    <div className="container">
      <h2>Assign Mentor to Newbie</h2>

      {/* Error and success messages */}
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          <h3>Mentors</h3>
          <Accordion>
            {mentors.map((mentor) => (
              <Accordion.Item key={mentor.id} eventKey={mentor.id}>
                <Accordion.Header>{mentor.name}</Accordion.Header>
                <Accordion.Body>
                  <Button variant="primary" onClick={() => handleAssignMentor(newbies[0]?.id, mentor.id)}>
                    Assign Newbie to this Mentor
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          <h3>Unassigned Newbies</h3>
          <Accordion>
            {newbies.map((newbie) => (
              <Accordion.Item key={newbie.id} eventKey={newbie.id}>
                <Accordion.Header>{newbie.name}</Accordion.Header>
                <Accordion.Body>
                  <p>Details about the newbie...</p>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </>
      )}
    </div>
  );
};

export default NewbieMentorComponent;
