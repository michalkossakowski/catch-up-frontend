import React, { useEffect, useState } from 'react';
import { RoadMapDto } from '../../dtos/RoadMapDto';
import { getByNewbieId, getMyRoadMaps } from '../../services/roadMapService';
import Loading from '../Loading/Loading';
import { Alert, Card, ProgressBar, Form, InputGroup, Button } from 'react-bootstrap';
import { StatusEnum } from '../../Enums/StatusEnum';
import { useNavigate } from 'react-router-dom';
import './RoadMapExplore.css';
import RoadMapEditModal from './RoadMapModals/RoadMapEditModal';
import RoadMapDeleteModal from './RoadMapModals/RoadMapDeleteModal';
import NotificationToast from '../Toast/NotificationToast';

interface RoadMapExploreProps {
  newbieId?: string;
  manageMode: boolean;
}

const RoadMapExplore: React.FC<RoadMapExploreProps> = ({ newbieId, manageMode }) => {
  const [myRoadMaps, setMyRoadMaps] = useState<RoadMapDto[]>([]);
  const [filteredRoadMaps, setFilteredRoadMaps] = useState<RoadMapDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [searchPhrase, setSearchPhrase] = useState('');
  const [showSearchMessage, setShowSearchMessage] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [sortOption, setSortOption] = useState( manageMode ? 'newest' : 'oldest');
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedRoadMap, setSelectedRoadMap] = useState<RoadMapDto | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastColor, setToastColor] = useState<string>('green');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRoadmaps();
  }, []);

  useEffect(() => {
    if (newbieId != null) {
      fetchMyRoadmaps();
    }
  }, [newbieId]);

  useEffect(() => {
    filterAndSortRoadmaps();
  }, [myRoadMaps, searchPhrase, sortOption]);

  const handleOpenEditModal = (roadMap?: RoadMapDto) => {
    setSelectedRoadMap(roadMap || null);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = (success: boolean, isEdit: boolean) => {
    setIsEditModalOpen(false);
    setSelectedRoadMap(null);
    if (success) {
      setToastMessage(isEdit ? 'RoadMap successfully edited' : 'RoadMap successfully added');
      setToastColor('green');
      setShowToast(true);
      fetchMyRoadmaps();
    } 
  };

  const handleOpenDeleteModal = (id: number, title?: string) => {
    setSelectedRoadMap({ id, title } as RoadMapDto);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = (deleted: boolean) => {
    setIsDeleteModalOpen(false);
    setSelectedRoadMap(null);

    if (deleted) {
      setToastMessage('RoadMap successfully deleted!');
      setToastColor('green');
      fetchMyRoadmaps();
      setShowToast(true);
    } 
  };

  const fetchMyRoadmaps = async () => {
    if (manageMode) {
      if (newbieId != null && newbieId?.trim() !== '') {
        try {
          setLoading(true);
          const data = await getByNewbieId(newbieId);
          setMyRoadMaps(data);
        } catch (error: any) {
          setShowAlert(true);
          setAlertMessage('Error: ' + (error?.message || 'Unknown error'));
        } finally {
          setLoading(false);
          setShowAlert(false);
        }
      } else {
        setShowAlert(true);
        setAlertMessage('Newbie not selected');
      }
    } else {
      try {
        setLoading(true);
        const data = await getMyRoadMaps();
        setMyRoadMaps(data);
      } catch (error: any) {
        setShowAlert(true);
        setAlertMessage('Error: ' + (error?.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    }
  };

  const filterAndSortRoadmaps = () => {
    let filtered = [...myRoadMaps];

    if (searchPhrase.trim()) {
      filtered = filtered.filter((roadMap) =>
        roadMap.title!.toLowerCase().includes(searchPhrase.toLowerCase())
      );

      if (filtered.length === 0) {
        setShowSearchMessage(true);
        setSearchMessage(`No Road Maps found matching "${searchPhrase}"`);
      } else {
        setShowSearchMessage(false);
      }
    } else {
      setShowSearchMessage(false);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.assignDate!).getTime();
      const dateB = new Date(b.assignDate!).getTime();
      return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredRoadMaps(filtered);
  };

  const getIconClass = (roadMap: RoadMapDto) => {
    if (roadMap.status === StatusEnum.Done) {
      return 'bi bi-check-circle-fill';
    } else if (roadMap.status === StatusEnum.ToDo) {
      return 'bi bi-dash-circle';
    } else {
      return 'bi bi-hourglass-split';
    }
  };

  return (
    <>
      {manageMode ? (
        <h1 className="title"></h1>
      ) : (
        <h1 className="title">
          <i className="bi bi-compass" /> My Road Maps
        </h1>
      )}

      <div className="roadmap-search-contaier">
        <div className="roadmap-search">
          {manageMode && (
              <Button
                variant="primary add-new-roadmap-button"
                onClick={() => handleOpenEditModal()}
              >
                <i className="bi bi-plus-lg" /> Add new Road Map
              </Button>
            )}
          {!showAlert && !loading && myRoadMaps.length > 0 && (
            <>
              <InputGroup className="inputGroup serach-bar-item-left">
                <Form.Control
                  placeholder="Search by title..."
                  value={searchPhrase}
                  onChange={(e) => setSearchPhrase(e.target.value)}
                />
                <Button variant="primary" id="searchButton">
                  <i className="bi bi-search"></i>
                </Button>
              </InputGroup>

              <Form.Select
                className="serach-bar-item-right"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="oldest">Oldest First</option>
                <option value="newest">Newest First</option>
              </Form.Select>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loaderBox">
          <Loading />
        </div>
      ) : (
        <>
          {showSearchMessage && (
            <div className="d-flex justify-content-center align-items-center m-4">
              <Alert className="alertBox" variant="warning">
                {searchMessage}
              </Alert>
            </div>
          )}
          {showAlert && (
            <div className="d-flex justify-content-center align-items-center m-4">
              <Alert className="alert" variant="danger">
                {alertMessage}
              </Alert>
            </div>
          )}
          <div className="roadmap-list-container">
            {!showAlert && filteredRoadMaps.length > 0 ? (
              filteredRoadMaps.map((roadMap) => (
                <Card
                  key={roadMap.id}
                  className="roadmap-list-item"
                  onMouseDown={(e) => {
                    if (e.button === 1) {
                      window.open(`/roadmap/${roadMap.id}/${encodeURIComponent(roadMap.title!)}`, '_blank');
                    }
                  }}
                  
                  onClick={() => navigate(`/roadmap/${roadMap.id}/${encodeURIComponent(roadMap.title!)}`)}
                >
                  <Card.Body className="d-flex">
                    <div className="roadmap-list-item-icon me-3">
                      <i className={`${getIconClass(roadMap)} fs-1`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <Card.Title ><a className="single-roadmap-title" href={`/roadmap/${roadMap.id}/${encodeURIComponent(roadMap.title!)}`}>{roadMap.title}</a></Card.Title>
                        {manageMode && (
                          <div>
                            <Button
                              className="edit-button me-2"
                              variant="info"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditModal(roadMap);
                              }}
                            >
                              <i className="bi bi-pencil" /> Edit
                            </Button>
                            <Button
                              className="delete-button"
                              variant="danger"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDeleteModal(roadMap.id!, roadMap.title);
                              }}
                            >
                              <i className="bi bi-trash" /> Delete
                            </Button>
                          </div>
                        )}
                      </div>
                      <Card.Subtitle className="mb-2 text-muted d-flex justify-content-between">
                        assigned by {roadMap.creatorName}
                      </Card.Subtitle>
                      <Card.Text>{roadMap.description}</Card.Text>

                      {roadMap.status === StatusEnum.Done ? (
                        <ProgressBar variant="info" animated now={100} label={`${100}%`} />
                      ) : (
                        <ProgressBar
                          animated
                          now={roadMap.progress !== undefined ? roadMap.progress! : 0}
                          label={roadMap.progress !== undefined ? `${roadMap.progress!}%` : '0.00%'}
                        />
                      )}

                      <Card.Link className="mb-2 text-muted d-flex justify-content-between roadmap-item-card-link">
                        <span>Assigned: {new Date(roadMap.assignDate!).toLocaleString()}</span>
                        {roadMap.status === StatusEnum.Done && (
                          <span className="finish-date">
                            Finished: {new Date(roadMap.finishDate!).toLocaleString()}
                          </span>
                        )}
                      </Card.Link>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              !showSearchMessage &&
              !showAlert && (
                <Alert className="alert" variant="warning">
                  {manageMode ? (
                    <span>
                      <i className="bi bi-compass" /> No Road Maps found for this newbie
                    </span>
                  ) : (
                    <span>
                      <i className="bi bi-compass" /> No Road Maps found contact your mentor
                    </span>
                  )}
                </Alert>
              )
            )}
          </div>
        </>
      )}
      <RoadMapEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        newbieId={newbieId}
        roadMap={selectedRoadMap}
      />

      {selectedRoadMap && (
        <RoadMapDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          roadMapId={selectedRoadMap.id!}
          roadMapTitle={selectedRoadMap.title}
        />
      )}

      <NotificationToast
        show={showToast}
        title="Road Map Info"
        message={toastMessage}
        color={toastColor}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default RoadMapExplore;