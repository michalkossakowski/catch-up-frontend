import React, { useEffect, useState } from 'react';
import { RoadMapDto } from '../../dtos/RoadMapDto';
import { getMyRoadMaps } from '../../services/roadMapService';
import Loading from '../Loading/Loading';
import { Alert, Card, ProgressBar, Form, InputGroup, Button } from 'react-bootstrap';
import { StatusEnum } from '../../Enums/StatusEnum';
import { useNavigate } from 'react-router-dom';
import './RoadMapExplore.css';

const RoadMapExplore: React.FC = () => {
    const [myRoadMaps, setMyRoadMaps] = useState<RoadMapDto[]>([]);
    const [filteredRoadMaps, setFilteredRoadMaps] = useState<RoadMapDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [searchPhrase, setSearchPhrase] = useState('');
    const [showSearchMessage, setShowSearchMessage] = useState(false);
    const [searchMessage, setSearchMessage] = useState('');
    const [sortOption, setSortOption] = useState('oldest');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyRoadmaps();
    }, []);

    useEffect(() => {
        filterAndSortRoadmaps();
    }, [myRoadMaps, searchPhrase, sortOption]);

    const fetchMyRoadmaps = async () => {
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
    };

    const filterAndSortRoadmaps = () => {
        let filtered = [...myRoadMaps];

        if (searchPhrase.trim()) {
            filtered = filtered.filter(roadMap =>
                roadMap.title!.toLowerCase().includes(searchPhrase.toLowerCase())
            );
            
            if (filtered.length === 0) {
                setShowSearchMessage(true);
                setSearchMessage(`No road maps found matching "${searchPhrase}"`);
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
        }
        else if (roadMap.status === StatusEnum.ToDo) {
            return 'bi bi-dash-circle';
        } else {
            return 'bi bi-hourglass-split';
        }
    };

    return (
        <>
            <h1 className='title'> <i className="bi bi-compass"/> My Road Maps</h1>

            <div className='roadmap-search-contaier'>
                {!showAlert && !loading && myRoadMaps.length > 0 && (
                    <div className='roadmap-search'>
                        <InputGroup className="inputGroup serach-bar-item-left">
                            <Form.Control
                                placeholder="Search by title..."
                                value={searchPhrase}
                                onChange={(e) => setSearchPhrase(e.target.value)}
                            />
                            <Button variant="primary" id="searchButton">
                                <i className="bi bi-search"> </i>
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
                    </div>
                )}
            </div>
          
            {loading ? (
                <div className='loaderBox'>
                    <Loading />
                </div>
            ) : (
                <>
                    {showSearchMessage && (
                        <div className="d-flex justify-content-center align-items-center m-4">
                            <Alert className='alertBox' variant='warning'>
                                {searchMessage}
                            </Alert>
                        </div>
                    )}
                    {showAlert && (
                        <div className="d-flex justify-content-center align-items-center m-4">
                            <Alert className='alert' variant='danger'>
                                {alertMessage}
                            </Alert>
                        </div>
                    )}
                    <div className='roadmap-list-container'>
                        {filteredRoadMaps.length > 0 ? (
                            filteredRoadMaps.map((roadMap) => (   
                                <Card key={roadMap.id} className='roadmap-list-item' onClick={() => navigate(`/roadmap/${roadMap.id}/${encodeURIComponent(roadMap.title!)}`)}>
                                <Card.Body className="d-flex">
                                    <div className="roadmap-list-item-icon me-3">
                                        <i className={`${getIconClass(roadMap)} fs-1`}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <Card.Title>{roadMap.title}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted d-flex justify-content-between">
                                            assigned by {roadMap.creatorName}
                                        </Card.Subtitle>
                                        <Card.Text>
                                            {roadMap.description}
                                        </Card.Text>

                                        {roadMap.status === StatusEnum.Done ? (
                                            <ProgressBar variant="info" animated now={100} label={`${100}%`} />
                                        ) : (
                                            <ProgressBar 
                                                animated 
                                                now={
                                                    roadMap.progress !== undefined
                                                    ? (roadMap.progress!)
                                                    : 0
                                                } 
                                                label={
                                                    roadMap.progress !== undefined
                                                    ? `${roadMap.progress!}%` 
                                                    : '0.00%'
                                                } 
                                            />
                                        )}
                                    
                                        <Card.Link className="mb-2 text-muted d-flex justify-content-between roadmap-item-card-link">
                                            <span>
                                                Assigned: {new Date(roadMap.assignDate!).toLocaleString()}
                                            </span>
                                            {(roadMap.status === StatusEnum.Done) && (
                                                <span className='finish-date'>
                                                    Finished: {new Date(roadMap.finishDate!).toLocaleString()}
                                                </span>
                                            )}
                                        </Card.Link>
                                    </div>
                                </Card.Body>
                            </Card>     
                            ))
                        ) : (
                            !showSearchMessage && !showAlert && (
                                <Alert className='alert' variant='info'>
                                   <i className='bi bi-compass'/> No road maps found contact your mentor.
                                </Alert>
                            )
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default RoadMapExplore;