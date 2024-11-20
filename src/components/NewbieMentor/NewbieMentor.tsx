import React, { useState, useEffect } from 'react';
import { Table, Alert, Spinner } from 'react-bootstrap';
import NewbieMentorService from '../../services/newbieMentorService';
import { UserDto } from '../../dtos/UserDto'; 

const NewbieMentorComponent: React.FC = () => {
  const [newbieMentors, setNewbieMentors] = useState<UserDto[]>([]); // Przechowuje listę mentorów
  const [loading, setLoading] = useState<boolean>(true); // Flaga ładowania
  const [error, setError] = useState<string>(''); // Flaga błędu

  useEffect(() => {
    fetchNewbieMentors();
  }, []);

  const fetchNewbieMentors = async () => {
    setLoading(true);
    setError('');
    try {
      const mentors = await NewbieMentorService.getAllMentors();
      const mentorsWithNewbiesCount = await Promise.all(mentors.map(async (mentor) => {
        mentor.newbiesCount = await NewbieMentorService.getNewbieCountByMentor(mentor.id);
        console.log(mentor.newbiesCount);
        return { ...mentor }
      }));
      setNewbieMentors(mentorsWithNewbiesCount);
    } catch (error: any) {
      setError(error.message || 'An error occurred while fetching newbie mentors');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>List of Newbie Mentors</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>Position</th>
              <th>Assigned Newbies</th> 
            </tr>
          </thead>
          <tbody>
            {newbieMentors.map((mentor) => (
              <tr key={mentor.id}>
                <td>{mentor.name}</td> 
                <td>{mentor.surname}</td>
                <td>{mentor.position}</td>
                <td>{mentor.newbiesCount || 0}</td> {/* Liczba przypisanych newbies */}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default NewbieMentorComponent;
