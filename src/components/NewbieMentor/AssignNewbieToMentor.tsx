import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NewbieMentorService from '../../services/newbieMentorService';
import { UserAssignCountDto } from '../../dtos/UserAssignCountDto';
import './NewbieMentor.css';
import Loading from '../Loading/Loading';
import { TypeEnum } from '../../Enums/TypeEnum';

const AssignNewbieToMentorComponent: React.FC = () => {
  const [mentors, setMentors] = useState<UserAssignCountDto[]>([]);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [selectedMentorName, setSelectedMentorName] = useState<string | null>(null);
  const [selectedMentorSurname, setSelectedMentorSurname] = useState<string | null>(null);
  const [assignedNewbies, setAssignedNewbies] = useState<UserAssignCountDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [unassignedNewbies, setUnassignedNewbies] = useState<UserAssignCountDto[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deletingNewbieId, setDeletingNewbieId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // for Mentors
  const [searchTermAssigned, setSearchTermAssigned] = useState<string>(''); // for Assigned Newbies
  const [searchTermUnassigned, setSearchTermUnassigned] = useState<string>(''); // for Unassigned Newbies

  const [sortConfigMentors, setSortConfigMentors] = useState<{ key: string, direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc',
  });

  const [sortConfigAssigned, setSortConfigAssigned] = useState<{ key: string, direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc',
  });

  const [sortConfigUnassigned, setSortConfigUnassigned] = useState<{ key: string, direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc',
  });

  // Filter for each table separately
  const filteredMentors = mentors.filter(
    (mentor) =>
      (mentor.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (mentor.surname?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  const filteredAssignedNewbies = assignedNewbies.filter(
    (newbie) =>
      newbie.name?.toLowerCase().includes(searchTermAssigned.toLowerCase()) ||
      newbie.surname?.toLowerCase().includes(searchTermAssigned.toLowerCase())
  );

  const filteredUnassignedNewbies = unassignedNewbies.filter(
    (newbie) =>
      newbie.name?.toLowerCase().includes(searchTermUnassigned.toLowerCase()) ||
      newbie.surname?.toLowerCase().includes(searchTermUnassigned.toLowerCase())
  );

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await NewbieMentorService.getUsers(TypeEnum.Mentor);
      setMentors(response || []);
    } catch (error: any) {
      setError(error.message || 'An error occurred while fetching mentors');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedNewbies = async (mentorId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await NewbieMentorService.getAssignments(mentorId, TypeEnum.Mentor);
      console.log('Assigned Newbies Response:', response);
      setAssignedNewbies(response || []);
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
      const response = await NewbieMentorService.getUsers(TypeEnum.Newbie, false, mentorId);
      setUnassignedNewbies(response || []);
    } catch (error: any) {
      setError(error.message || 'An error occurred while fetching unassigned newbies');
      setUnassignedNewbies([]);
    } finally {
      setLoading(false);
    }
  };


  const handleMentorClick = (mentorId: string, mentorName: string, mentorSurname: string) => {
    setSelectedMentorName(mentorName);
    setSelectedMentorSurname(mentorSurname);
    setSelectedMentorId(mentorId);
    fetchAssignedNewbies(mentorId);
    fetchUnassignedNewbies(mentorId);
  };

  const handleDeleteClick = (newbieId: string) => {
    setDeletingNewbieId(newbieId);
    setShowModal(true);
  };

  const handleUnassign = async () => {
    if (deletingNewbieId && selectedMentorId) {
      //setLoading(true);
      setError('');
      try {
        await NewbieMentorService.setAssignmentState(deletingNewbieId, selectedMentorId, 'Deleted');
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
      //setLoading(true);
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

  // Sort mentors
  const sortedMentors = filteredMentors.sort((a, b) => {
    const aValue = a[sortConfigMentors.key as keyof UserAssignCountDto]?.toString().toLowerCase() || '';
    const bValue = b[sortConfigMentors.key as keyof UserAssignCountDto]?.toString().toLowerCase() || '';

    if (aValue < bValue) {
      return sortConfigMentors.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfigMentors.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Sort assigned newbies
  const sortedAssignedNewbies = filteredAssignedNewbies.sort((a, b) => {
    const aValue = a[sortConfigAssigned.key as keyof UserAssignCountDto]?.toString().toLowerCase() || '';
    const bValue = b[sortConfigAssigned.key as keyof UserAssignCountDto]?.toString().toLowerCase() || '';

    if (aValue < bValue) {
      return sortConfigAssigned.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfigAssigned.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Sort unassigned newbies
  const sortedUnassignedNewbies = filteredUnassignedNewbies.sort((a, b) => {
    const aValue = a[sortConfigUnassigned.key as keyof UserAssignCountDto]?.toString().toLowerCase() || '';
    const bValue = b[sortConfigUnassigned.key as keyof UserAssignCountDto]?.toString().toLowerCase() || '';

    if (aValue < bValue) {
      return sortConfigUnassigned.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfigUnassigned.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Function to handle sorting
  const handleSort = (key: string, table: 'mentors' | 'assigned' | 'unassigned') => {
    let direction: 'asc' | 'desc' = 'asc';

    if (table === 'mentors' && sortConfigMentors.key === key && sortConfigMentors.direction === 'asc') {
      direction = 'desc';
      setSortConfigMentors({ key, direction });
    } else if (table === 'assigned' && sortConfigAssigned.key === key && sortConfigAssigned.direction === 'asc') {
      direction = 'desc';
      setSortConfigAssigned({ key, direction });
    } else if (table === 'unassigned' && sortConfigUnassigned.key === key && sortConfigUnassigned.direction === 'asc') {
      direction = 'desc';
      setSortConfigUnassigned({ key, direction });
    } else {
      if (table === 'mentors') setSortConfigMentors({ key, direction });
      else if (table === 'assigned') setSortConfigAssigned({ key, direction });
      else if (table === 'unassigned') setSortConfigUnassigned({ key, direction });
    }
  };

  return (
    <div className="container mt-5">
      <h2>List of Mentors</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="row">
          <div className="col-md-6">
            <div className="mt-4">
              <div className="mb-3">
                <h3>Mentors</h3>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search mentor by name or surname..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                </div>
              </div>
              <Table id="mentors" striped bordered hover responsive>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name', 'mentors')} style={{ cursor: 'pointer' }}>
                      Name <i className="bi bi-arrow-down-up"></i>
                    </th>
                    <th onClick={() => handleSort('surname', 'mentors')} style={{ cursor: 'pointer' }}>
                      Surname <i className="bi bi-arrow-down-up"></i>
                    </th>
                    <th onClick={() => handleSort('position', 'mentors')} style={{ cursor: 'pointer' }}>
                      Position <i className="bi bi-arrow-down-up"></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMentors.map((mentor) => (
                    <tr
                      key={mentor.id}
                      onClick={() => handleMentorClick(mentor.id??' ', mentor.name??' ', mentor.surname?? ' ')}
                      style={{ cursor: 'pointer' }}
                      className={mentor.id === selectedMentorId ? 'table-active' : ''}
                    >
                      <td>{mentor.name}</td>
                      <td>{mentor.surname}</td>
                      <td>{mentor.position}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
          <div className="col-md-6">
            {selectedMentorId && (
              <div className="mt-4">
                <h3>Assigned Newbies to {selectedMentorName} {selectedMentorSurname}</h3>
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search assigned newbies by name or surname..."
                      value={searchTermAssigned}
                      onChange={(e) => setSearchTermAssigned(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                  </div>
                </div>
                <Table id="assigned" striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('name', 'assigned')} style={{ cursor: 'pointer' }}>
                        Name <i className="bi bi-arrow-down-up"></i>
                      </th>
                      <th onClick={() => handleSort('surname', 'assigned')} style={{ cursor: 'pointer' }}>
                        Surname <i className="bi bi-arrow-down-up"></i>
                      </th>
                      <th onClick={() => handleSort('position', 'assigned')} style={{ cursor: 'pointer' }}>
                        Position <i className="bi bi-arrow-down-up"></i>
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAssignedNewbies.map((newbie) => (
                      <tr key={newbie.id}>
                        <td>{newbie.name}</td>
                        <td>{newbie.surname}</td>
                        <td>{newbie.position}</td>
                        <td>
                          <Button variant="danger" onClick={() => handleDeleteClick(newbie.id ?? '')}>
                            Unassign
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {selectedMentorId && (
              <div className="mt-4">
                <h3>Unassigned Newbies for {selectedMentorName} {selectedMentorSurname}</h3>
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search unassigned newbies by name or surname..."
                      value={searchTermUnassigned}
                      onChange={(e) => setSearchTermUnassigned(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                  </div>
                </div>
                <Table id="unassigned" striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('name', 'unassigned')} style={{ cursor: 'pointer' }}>
                        Name <i className="bi bi-arrow-down-up"></i>
                      </th>
                      <th onClick={() => handleSort('surname', 'unassigned')} style={{ cursor: 'pointer' }}>
                        Surname <i className="bi bi-arrow-down-up"></i>
                      </th>
                      <th onClick={() => handleSort('position', 'unassigned')} style={{ cursor: 'pointer' }}>
                        Position <i className="bi bi-arrow-down-up"></i>
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUnassignedNewbies.map((newbie) => (
                      <tr key={newbie.id}>
                        <td>{newbie.name}</td>
                        <td>{newbie.surname}</td>
                        <td>{newbie.position}</td>
                        <td>
                          <Button variant="primary" onClick={() => handleAssignNewbie(newbie.id?? '')}>
                            Assign
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Unassignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to unassign this newbie from this mentor?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleUnassign}>
            Unassign
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssignNewbieToMentorComponent;