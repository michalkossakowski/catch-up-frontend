import React, { useState, useEffect } from 'react';
import { Table, Alert, Spinner, Button, Modal } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NewbieMentorService from '../../services/newbieMentorService';
import { UserAssignCountDto } from '../../dtos/UserAssignCountDto';
import './NewbieMentor.css';
import Loading from '../Loading/Loading';
import { RoleEnum } from '../../Enums/RoleEnum';

const AssignMentorToNewbieComponent: React.FC = () => {
  const [newbies, setNewbies] = useState<UserAssignCountDto[]>([]);
  const [selectedNewbieId, setSelectedNewbieId] = useState<string | null>(null);
  const [selectedNewbieName, setSelectedNewbieName] = useState<string | null>(null);
  const [selectedNewbieSurname, setSelectedNewbieSurname] = useState<string | null>(null);
  const [assignedMentors, setAssignedMentors] = useState<UserAssignCountDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [unassignedMentors, setUnassignedMentors] = useState<UserAssignCountDto[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deletingMentorId, setDeletingMentorId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // dla Nowych Pracowników
  const [searchTermAssigned, setSearchTermAssigned] = useState<string>(''); // dla Przypisanych Mentorów
  const [searchTermUnassigned, setSearchTermUnassigned] = useState<string>(''); // dla Nieprzypisanych Mentorów

  const [sortConfigNewbies, setSortConfigNewbies] = useState<{ key: string, direction: 'asc' | 'desc' }>({
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

  // Filtr dla każdej tabeli osobno
  const filteredNewbies = newbies.filter(
    (newbie) =>
      newbie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newbie.surname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssignedMentors = assignedMentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchTermAssigned.toLowerCase()) ||
      mentor.surname.toLowerCase().includes(searchTermAssigned.toLowerCase())
  );

  const filteredUnassignedMentors = unassignedMentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchTermUnassigned.toLowerCase()) ||
      mentor.surname.toLowerCase().includes(searchTermUnassigned.toLowerCase())
  );

  useEffect(() => {
    fetchNewbies();
  }, []);

  const fetchNewbies = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await NewbieMentorService.getUsers(RoleEnum.Newbie);
      setNewbies(response.users);
    } catch (error: any) {
      setError(error.message || 'Wystąpił błąd podczas pobierania nowych pracowników');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedMentors = async (newbieId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await NewbieMentorService.getAssignments(newbieId, RoleEnum.Newbie);
      setAssignedMentors(response.assignments);
    } catch (error: any) {
      setError(error.message || 'Wystąpił błąd podczas pobierania przypisanych mentorów');
      setAssignedMentors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedMentors = async (newbieId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await NewbieMentorService.getUsers(RoleEnum.Newbie, false, newbieId);
      setUnassignedMentors(response.users);
    } catch (error: any) {
      setError(error.message || 'Wystąpił błąd podczas pobierania nieprzypisanych mentorów');
      setUnassignedMentors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewbieClick = (newbieId: string, newbieName: string, newbieSurname: string) => {
    setSelectedNewbieName(newbieName);
    setSelectedNewbieSurname(newbieSurname);
    setSelectedNewbieId(newbieId);
    fetchAssignedMentors(newbieId);
    fetchUnassignedMentors(newbieId);
  };

  const handleDeleteClick = (mentorId: string) => {
    setDeletingMentorId(mentorId);
    setShowModal(true);
  };

  const handleUnassign = async () => {
    if (deletingMentorId && selectedNewbieId) {
      setLoading(true);
      setError('');
      try {
        await NewbieMentorService.setAssignmentState(selectedNewbieId, deletingMentorId, 'Deleted');
        setAssignedMentors((prev) => prev.filter((mentor) => mentor.id !== deletingMentorId));
        setShowModal(false);
        fetchAssignedMentors(selectedNewbieId);
        fetchUnassignedMentors(selectedNewbieId);
        fetchNewbies();
      } catch (error: any) {
        setError(error.message || 'Wystąpił błąd podczas usuwania przypisania');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAssignMentor = async (mentorId: string) => {
    if (selectedNewbieId) {
      setLoading(true);
      setError('');
      try {
        await NewbieMentorService.assignNewbieToMentor(selectedNewbieId, mentorId);
        fetchAssignedMentors(selectedNewbieId);
        fetchUnassignedMentors(selectedNewbieId);
        fetchNewbies();
      } catch (error: any) {
        setError(error.message || 'Wystąpił błąd podczas przypisywania mentora do nowego pracownika');
      } finally {
        setLoading(false);
      }
    }
  };

  // Sortowanie nowych pracowników
  const sortedNewbies = filteredNewbies.sort((a, b) => {
    const aValue = a[sortConfigNewbies.key as keyof UserAssignCountDto]?.toString().toLowerCase() || '';
    const bValue = b[sortConfigNewbies.key as keyof UserAssignCountDto]?.toString().toLowerCase() || '';

    if (aValue < bValue) {
      return sortConfigNewbies.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfigNewbies.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Sortowanie przypisanych mentorów
  const sortedAssignedMentors = filteredAssignedMentors.sort((a, b) => {
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

  // Sortowanie nieprzypisanych mentorów
  const sortedUnassignedMentors = filteredUnassignedMentors.sort((a, b) => {
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

  // Funkcja obsługująca sortowanie
  const handleSort = (key: string, table: 'newbies' | 'assigned' | 'unassigned') => {
    let direction: 'asc' | 'desc' = 'asc';

    if (table === 'newbies' && sortConfigNewbies.key === key && sortConfigNewbies.direction === 'asc') {
      direction = 'desc';
      setSortConfigNewbies({ key, direction });
    } else if (table === 'assigned' && sortConfigAssigned.key === key && sortConfigAssigned.direction === 'asc') {
      direction = 'desc';
      setSortConfigAssigned({ key, direction });
    } else if (table === 'unassigned' && sortConfigUnassigned.key === key && sortConfigUnassigned.direction === 'asc') {
      direction = 'desc';
      setSortConfigUnassigned({ key, direction });
    } else {
      if (table === 'newbies') setSortConfigNewbies({ key, direction });
      else if (table === 'assigned') setSortConfigAssigned({ key, direction });
      else if (table === 'unassigned') setSortConfigUnassigned({ key, direction });
    }
  };

  return (
    <div className="container mt-5">
      <h2>Lista Nowych Pracowników</h2>

      {loading ? (
        <Loading />
      ) : (
        <div className="row">
          <div className="col-md-6">
            <div className="mt-4">
              <div className="mb-3">
                <h3>Nowi Pracownicy</h3>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Szukaj nowego pracownika po imieniu lub nazwisku..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                </div>
              </div>
              <Table id="newbies" striped bordered hover responsive>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name', 'newbies')} style={{ cursor: 'pointer' }}>
                      Imię <i className="bi bi-arrow-down-up"></i>
                    </th>
                    <th onClick={() => handleSort('surname', 'newbies')} style={{ cursor: 'pointer' }}>
                      Nazwisko <i className="bi bi-arrow-down-up"></i>
                    </th>
                    <th onClick={() => handleSort('position', 'newbies')} style={{ cursor: 'pointer' }}>
                      Stanowisko <i className="bi bi-arrow-down-up"></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedNewbies.map((newbie) => (
                    <tr
                      key={newbie.id}
                      onClick={() => handleNewbieClick(newbie.id, newbie.name, newbie.surname)}
                      style={{ cursor: 'pointer' }}
                      className={newbie.id === selectedNewbieId ? 'table-active' : ''}
                    >
                      <td>{newbie.name}</td>
                      <td>{newbie.surname}</td>
                      <td>{newbie.position}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
          <div className="col-md-6">
            {selectedNewbieId && (
              <div className="mt-4">
                <h3>Przypisani Mentorzy dla {selectedNewbieName} {selectedNewbieSurname}</h3>
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Szukaj przypisanego mentora po imieniu lub nazwisku..."
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
                        Imię <i className="bi bi-arrow-down-up"></i>
                      </th>
                      <th onClick={() => handleSort('surname', 'assigned')} style={{ cursor: 'pointer' }}>
                        Nazwisko <i className="bi bi-arrow-down-up"></i>
                      </th>
                      <th onClick={() => handleSort('position', 'assigned')} style={{ cursor: 'pointer' }}>
                        Stanowisko <i className="bi bi-arrow-down-up"></i>
                      </th>
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAssignedMentors.map((mentor) => (
                      <tr key={mentor.id}>
                        <td>{mentor.name}</td>
                        <td>{mentor.surname}</td>
                        <td>{mentor.position}</td>
                        <td>
                          <Button variant="danger" onClick={() => handleDeleteClick(mentor.id)}>
                            Usuń
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {selectedNewbieId && (
              <div className="mt-4">
                <h3>Nieprzypisani Mentorzy dla {selectedNewbieName} {selectedNewbieSurname}</h3>
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Szukaj nieprzypisanego mentora po imieniu lub nazwisku..."
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
                        Imię <i className="bi bi-arrow-down-up"></i>
                      </th>
                      <th onClick={() => handleSort('surname', 'unassigned')} style={{ cursor: 'pointer' }}>
                        Nazwisko <i className="bi bi-arrow-down-up"></i>
                      </th>
                      <th onClick={() => handleSort('position', 'unassigned')} style={{ cursor: 'pointer' }}>
                        Stanowisko <i className="bi bi-arrow-down-up"></i>
                      </th>
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUnassignedMentors.map((mentor) => (
                      <tr key={mentor.id}>
                        <td>{mentor.name}</td>
                        <td>{mentor.surname}</td>
                        <td>{mentor.position}</td>
                        <td>
                          <Button variant="primary" onClick={() => handleAssignMentor(mentor.id)}>
                            Przypisz
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
          <Modal.Title>Potwierdź Usunięcie</Modal.Title>
        </Modal.Header>
        <Modal.Body>Czy na pewno chcesz usunąć przypisanie tego mentora dla nowego pracownika?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Anuluj
          </Button>
          <Button variant="danger" onClick={handleUnassign}>
            Usuń
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssignMentorToNewbieComponent;