import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoadMapPointDto } from '../../dtos/RoadMapPointDto';
import { getByRoadMapId } from '../../services/roadMapPointService';
import { Alert, Button } from 'react-bootstrap';
import { StatusEnum } from '../../Enums/StatusEnum';
import Loading from '../Loading/Loading';
import './RoadMapDetails.css';
import RoadMapPointDetails from './RoadMapPointDetails';
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

const RoadMapDetails: React.FC = () => {
    const { roadMapId, title } = useParams<{ roadMapId: string; title: string }>();
    const [roadMapPoints, setRoadMapPoints] = useState<RoadMapPointDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [selectedPointId, setSelectedPointId] = useState<number | null>(null); // New state for selected point
    const navigate = useNavigate();
    const { width, height } = useWindowSize()

    useEffect(() => {
        if (roadMapId) {
            fetchRoadMapPoints(parseInt(roadMapId));
        }
    }, [roadMapId]);

    const fetchRoadMapPoints = async (id: number) => {
        try {
            setLoading(true);
            const data = await getByRoadMapId(id);
            const sortedData = data.sort((a, b) => 
                new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime()
            );
            setRoadMapPoints(sortedData);
        } catch (error: any) {
            setShowAlert(true);
            setAlertMessage('Error loading roadmap points: ' + (error?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const getIconClass = (status?: StatusEnum) => {
        if(status === StatusEnum.Done ){
            return 'bi bi-check-circle-fill text-success';
        }
        else if(status === StatusEnum.InProgress ){
            return 'bi bi-hourglass-split ';
        }
        return 'bi bi-dash-circle text-muted';
    };

    const handlePointClick = (id?: number) => {
        setSelectedPointId(id || null); 
    };

    return (
        <>
            {!loading && roadMapPoints.find(rmp => rmp.status !== StatusEnum.Done) == null && (
                <>
                    <Confetti style={{zIndex: 10}}
                        width={width}
                        height={height}
                        numberOfPieces={1000}
                        gravity={0.2}
                        colors={['#5CD3B4','#DB91D1','#F2E267']}
                        tweenDuration={2000}
                        recycle={false}
                    />
                </>
            )}


            <div className="roadmap-container">
                <div className="d-flex justify-content-center align-items-center">
                    <h1 className="title">
                        <i className="bi bi-map" /> {title ? decodeURIComponent(title) : 'Roadmap Points'}    
                    </h1>
                </div>
                <Button
                    variant="outline-secondary"
                    className='me-2'
                    onClick={() => navigate('/roadmapexplore')}
                >
                    <i className="bi bi-arrow-left me-2" />
                        Back to Road Maps
                </Button>
    
                <Button
                    variant="outline-secondary"
                    className='ms-2'
                    onClick={() => navigate('/tasks')}
                >
                        Go to Task Board
                    <i className="bi bi-arrow-right ms-2" />

                </Button>
                
                {showAlert && (
                    <div className="d-flex justify-content-center align-items-center m-4">
                        <Alert className="alert" variant="danger">
                            {alertMessage}
                        </Alert>
                    </div>
                )}
    
                {loading ? (
                    <div className="loaderBox">
                        <Loading />
                    </div>
                ) : !showAlert && (
                    <>
                        {roadMapPoints.length > 0 ? (
                            <div className="roadmappoints-container">
                                <div className="timeline-container">
                                    <div className="timeline">
                                        {roadMapPoints.map((point, index) => (
                                            <div 
                                                key={point.id} 
                                                className={`timeline-step ${selectedPointId === point.id ? 'selected' : ''}`} 
                                                onClick={() => handlePointClick(point.id)}
                                            >
                                                <div className="timeline-icon">
                                                    <i className={getIconClass(point.status)} />
                                                </div>
                                                <div className="timeline-content">
                                                    <h5>{point.name || 'Unnamed'}</h5>
                                                    <p className="text-muted">
                                                        {point.status === StatusEnum.Done && point.finishDate
                                                            ? `Finished: ${new Date(point.finishDate!).toLocaleString()}`
                                                            : ""}
                                                    </p>
                                                </div>
                                                {index < roadMapPoints.length - 1 && (
                                                    <div className="timeline-line" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-center align-items-center m-5">
                                <Alert variant="warning">
                                <i className="bi bi-map" />&nbsp; No Road Map Points found for this Road Map contact your mentor
                                </Alert>
                            </div>
                        )}
                    </>
                )}
                {selectedPointId ? (
                    <div className='container-roadmap-point-details'>
                        <RoadMapPointDetails roadMapPointId={selectedPointId} roadMapPointName={roadMapPoints.find(rmp => rmp.id == selectedPointId)?.name} />
                    </div>
                ): roadMapPoints.length > 0 && (
                    <div className="d-flex justify-content-center align-items-center m-4">
                        <Alert variant="info">
                            <i className='bi bi-list-task'/>
                            &nbsp;
                            Click on a roadmap point to see its tasks inside
                        </Alert>
                    </div>
                )}
            </div>
        </>
    );
};

export default RoadMapDetails;