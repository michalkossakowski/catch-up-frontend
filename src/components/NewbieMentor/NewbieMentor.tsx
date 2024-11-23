import React, { useState, useEffect } from 'react';
import { Table, Alert, Spinner, Button, Modal } from 'react-bootstrap';
import NewbieMentorService from '../../services/newbieMentorService';
import { UserDto } from '../../dtos/UserDto';
import './NewbieMentor.css';

const NewbieMentorComponent: React.FC = () => {
  const [newbieMentors, setNewbieMentors] = useState<UserDto[]>([]);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [assignedNewbies, setAssignedNewbies] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [unassignedNewbies, setUnassignedNewbies] = useState<UserDto[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deletingNewbieId, setDeletingNewbieId] = useState<string | null>(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    setError('');
    try {
      const mentors = await NewbieMentorService.getAllMentors();
      const mentorsWithNewbiesCount = await Promise.all(
        mentors.map(async (mentor) => {
          mentor.newbiesCount = await NewbieMentorService.getNewbieCountByMentor(mentor.id);
          return { ...mentor };
        })
      );
      setNewbieMentors(mentorsWithNewbiesCount);
    } catch (error: any) {
      setError(error.message || 'An error occurred while fetching newbie mentors');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedNewbies = async (mentorId: string) => {
    setLoading(true);
    setError('');
    try {
      const newbies = await NewbieMentorService.getAssignmentsByMentor(mentorId);
      setAssignedNewbies(newbies);
    } catch (error: any) {
      setError(error.message || 'An error occurred while fetching assigned newbies');
      setAssignedNewbies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedNewbies = async (mentorId: string) => {
    setLoading(true);
    setError('');
    try {
      const newbies = await NewbieMentorService.getAllUnassignedNewbies(mentorId);
      setUnassignedNewbies(newbies);
    } catch (error: any) {
      setError(error.message || 'An error occurred while fetching unassigned newbies');
      setUnassignedNewbies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMentorClick = (mentorId: string) => {
    setSelectedMentorId(mentorId);
    fetchAssignedNewbies(mentorId);
    fetchUnassignedNewbies(mentorId);
  };

  const handleDeleteClick = (newbieId: string) => {
    setDeletingNewbieId(newbieId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (deletingNewbieId && selectedMentorId) {
      setLoading(true);
      setError('');
      try {
        await NewbieMentorService.deleteAssignment(deletingNewbieId, selectedMentorId);
        setAssignedNewbies((prev) => prev.filter((newbie) => newbie.id !== deletingNewbieId));
        setShowModal(false);
        fetchAssignedNewbies(selectedMentorId);
        fetchUnassignedNewbies(selectedMentorId);
        fetchMentors();
      } catch (error: any) {
        setError(error.message || 'An error occurred while deleting the assignment');
      } finally {
        setLoading(false);
      }
    }
  };
  const handleAssignNewbie = async (newbieId: string) => {
    if (selectedMentorId) {
      setLoading(true);
      setError('');
      try {
        await NewbieMentorService.assignNewbieToMentor(newbieId, selectedMentorId);
        fetchAssignedNewbies(selectedMentorId);
        fetchUnassignedNewbies(selectedMentorId);
        fetchMentors();
      } catch (error: any) {
        setError(error.message || 'An error occurred while assigning the newbie to the mentor');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>List of Mentors</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <div className="mt-4">
              <h3>Mentors</h3>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Position</th>
                    <th>Number of Newbies</th>
                  </tr>
                </thead>
                <tbody>
                  {newbieMentors.map((mentor) => (
                    <tr
                      key={mentor.id}
                      onClick={() => handleMentorClick(mentor.id)}
                      style={{ cursor: 'pointer' }}
                      className={mentor.id === selectedMentorId ? 'table-active' : ''}
                    >
                      <td>{mentor.name}</td>
                      <td>{mentor.surname}</td>
                      <td>{mentor.position}</td>
                      <td>{mentor.newbiesCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>

          <div className="col-md-6">
            {selectedMentorId && (
              <div className="mt-4">
                <h3>Assigned Newbies</h3>
                {assignedNewbies.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Position</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedNewbies.map((newbie) => (
                        <tr key={newbie.id}>
                          <td>{newbie.name}</td>
                          <td>{newbie.surname}</td>
                          <td>{newbie.position}</td>
                          <td>
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteClick(newbie.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">No newbies assigned to this mentor.</Alert>
                )}

                <h3 className="mt-4">Unassigned Newbies</h3>
                {unassignedNewbies.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Position</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
  {unassignedNewbies.map((newbie) => (
    <tr key={newbie.id}>
      <td>{newbie.name}</td>
      <td>{newbie.surname}</td>
      <td>{newbie.position}</td>
      <td>
        <Button
              variant="primary"
              onClick={() => handleAssignNewbie(newbie.id)}
                  >
                  Assign
                  </Button>
                </td>
              </tr>
                ))}
                </tbody>
                  </Table>
                ) : (
                  <Alert variant="info">No unassigned newbies found.</Alert>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to unassign this newbie from the mentor?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NewbieMentorComponent;
