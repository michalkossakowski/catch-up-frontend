import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoadMapPointDto } from '../../dtos/RoadMapPointDto';
import { getByRoadMapId } from '../../services/roadMapPointService';
import { Alert, Button } from 'react-bootstrap';
import { StatusEnum } from '../../Enums/StatusEnum';
import Loading from '../Loading/Loading';
import './RoadMapDetails.css';
import RoadMapPointDetails from './RoadMapPointDetails';
import RoadMapPointEditModal from './RoadMapPointModals/RoadMapPointEditModal';
import RoadMapPointDeleteModal from './RoadMapPointModals/RoadMapPointDeleteModal';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { getLocalSetting } from '../../Provider/LocalSettingProvider';
import NotificationToast from '../Toast/NotificationToast';

interface RoadMapExploreProps {
    manageMode: boolean;
}

const RoadMapDetails: React.FC<RoadMapExploreProps> = ({ manageMode }) => {
    const { roadMapId, title } = useParams<{ roadMapId: string; title: string }>();
    const [roadMapPoints, setRoadMapPoints] = useState<RoadMapPointDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEditPoint, setSelectedEditPoint] = useState<RoadMapPointDto | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDeletePoint, setSelectedDeletePoint] = useState<RoadMapPointDto | null>(null);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastColor, setToastColor] = useState<string>('green');
    const navigate = useNavigate();
    const { width, height } = useWindowSize();
    const fanfareSound = new Audio('/Notifications/fanfare.mp3');
    const isBrainrotAllowed = getLocalSetting('isBrainrotAllowed');
    const isConfettiDisabled = getLocalSetting('isConfettiDisabled');

    useEffect(() => {
        if (roadMapId) {
            fetchRoadMapPoints(parseInt(roadMapId));
        }
    }, [roadMapId]);

    useEffect(() => {
        if (
            !loading && 
            roadMapPoints.length > 0 && 
            roadMapPoints.every(rmp => rmp.status === StatusEnum.Done) &&
            !isConfettiDisabled
        ) {
            console.log("play fanfare")
            fanfareSound.play().catch(error => {
                console.error('Cannot play fanfare sound:', error);
            });
        }
    }, [loading, roadMapPoints]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
          const msg = event.data;
          if (msg && msg['x-tiktok-player'] && msg.type === 'onPlayerReady') {
            const iframe = document.getElementById('tiktok-player') as HTMLIFrameElement;
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage({
                type: 'unMute',
                value: undefined,
                'x-tiktok-player': true,
              }, '*');
            }
          }
        };
      
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

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
        if (status === StatusEnum.Done) {
            return 'bi bi-check-circle-fill text-success';
        } else if (status === StatusEnum.InProgress) {
            return 'bi bi-hourglass-split';
        }
        return 'bi bi-dash-circle text-muted';
    };

    const handlePointClick = (id?: number) => {
        setSelectedPointId(id || null);
    };

    const handleEditClick = (point: RoadMapPointDto) => {
        setSelectedEditPoint(point);
        setShowEditModal(true);
    };

    const handleAddClick = () => {
        setSelectedEditPoint(null); // Null indicates adding a new point
        setShowEditModal(true);
    };

    const handleDeleteClick = (point: RoadMapPointDto) => {
        console.log("Delete point clicked", point);
        setSelectedDeletePoint(point);
        setShowDeleteModal(true);
    };

    const handleEditModalClose = (success: boolean, isEdit: boolean) => {
        setShowEditModal(false);
        setSelectedEditPoint(null);
        if (success && roadMapId) {
            setToastMessage(isEdit ? 'RoadMap Point successfully edited' : 'RoadMap Point successfully added');
            setToastColor('green');
            setShowToast(true);
            fetchRoadMapPoints(parseInt(roadMapId));
        }
    };

    const handleDeleteModalClose = (deleted: boolean) => {
        setShowDeleteModal(false);
        setSelectedDeletePoint(null);
        if (deleted && roadMapId) {
            setToastMessage('RoadMap Point successfully deleted');
            setToastColor('green');
            setShowToast(true);
            fetchRoadMapPoints(parseInt(roadMapId));
        }
    };

    return (
        <>
            {!loading 
            && roadMapPoints.length > 0 
            && roadMapPoints.every(rmp => rmp.status === StatusEnum.Done) 
            && !isConfettiDisabled
            && (
                <Confetti
                    style={{ zIndex: 10 }}
                    width={width}
                    height={height}
                    numberOfPieces={1000}
                    gravity={0.2}
                    colors={['#5CD3B4', '#DB91D1', '#F2E267']}
                    tweenDuration={2000}
                    recycle={false}
                />
            )}

            <div className="roadmap-container">
                <div className="d-flex justify-content-center align-items-center">
                    <h1 className="title">
                        <i className="bi bi-map" /> {title ? decodeURIComponent(title) : 'Roadmap Points'}    
                    </h1>
                </div>
                <div className="d-flex justify-content-center align-items-center mb-3">
                    <Button
                        variant="outline-secondary"
                        className="me-2"
                        onClick={() => navigate(manageMode ? '/roadmapmanage' : '/roadmapexplore')}
                    >
                        <i className="bi bi-arrow-left me-2" />
                        {manageMode ? (
                            <span>Back to Road Maps Manager</span>
                        ) : (
                            <span>Back to Road Maps</span>
                        )}
                    </Button>
                    <Button
                        variant="outline-secondary"
                        className="ms-2"
                        onClick={() => navigate(manageMode ? '/taskmanage': '/tasks')}
                    >
                        {manageMode ? (
                            <span>Go to Task Manager</span>
                        ) : (
                            <span>Go to Task Board</span>
                        )}
                        <i className="bi bi-arrow-right ms-2" />
                    </Button>
                </div>

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
                                            <div className='timeline-step-container' key={point.id}>
                                                {manageMode && (
                                                    <div className="button-group">
                                                        <Button
                                                            className="edit-button me-2"
                                                            variant="info"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditClick(point);
                                                            }}
                                                        >
                                                            <i className="bi bi-pencil me-1" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            className="delete-button"
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteClick(point);
                                                            }}
                                                        >
                                                            <i className="bi bi-trash me-1" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                )}
                                                <div 
                                                    className={`timeline-step ${selectedPointId === point.id ? 'selected' : ''}`} 
                                                    onClick={() => handlePointClick(point.id)}
                                                >
                                                    <div className="timeline-icon">
                                                        <i className={getIconClass(point.status)} />
                                                    </div>
                                                    <div className="timeline-content">
                                                        <h5>{point.name || 'Unnamed'}</h5>
                                                        <p className="text-muted">
                                                            {point.status !== StatusEnum.Done && point.deadline
                                                                ? `Deadline: ${new Date(point.deadline!).toLocaleString()}`
                                                                : ""}
                                                            {point.status === StatusEnum.Done && point.finishDate
                                                                ? `Finished: ${new Date(point.finishDate!).toLocaleString()}`
                                                                : ""}
                                                        </p>
                                                    </div>
                                                    {index < roadMapPoints.length - 1 && (
                                                        <div className="timeline-line" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-center align-items-center m-5">
                                <Alert variant="warning">
                                    <i className="bi bi-map" />
                                    {' '}
                                    {manageMode ? (
                                        <span>No Road Map points found for this Road Map</span>
                                    ) : (
                                        <span>No Road Map points found for this Road Map contact your mentor</span>
                                    )}
                                </Alert>
                            </div>
                        )}
                    </>
                )}
               
                                
               {manageMode && (
                    <Button
                        variant="primary"
                        className="add-new-roadmap-button ms-3"
                        onClick={handleAddClick}
                    >
                        <i className="bi bi-plus-lg me-1" />
                        Add new Road Map Point
                    </Button>
                )}

                {selectedPointId ? (
                    <div className="container-roadmap-point-details">
                        <RoadMapPointDetails 
                            roadMapPointId={selectedPointId} 
                            roadMapPointName={roadMapPoints.find(rmp => rmp.id === selectedPointId)?.name}
                            manageMode={manageMode} 
                        />
                    </div>
                ) : roadMapPoints.length > 0 && (
                    <div className="d-flex justify-content-center align-items-center m-4 road-map-details-bottom-container">
                        {roadMapPoints.every(rmp => rmp.status === StatusEnum.Done) ? (
                            <>
                                <h3>Congratulations you have finished this Road Map !</h3>
                                <div className='mb-2'>
                                    <i className="bi bi-trophy-fill"/>
                                    {isBrainrotAllowed && (
                                        <>
                                            <iframe
                                                id="tiktok-player"
                                                height="200"
                                                width="355"
                                                src="https://www.tiktok.com/player/v1/7488375562155674902?music_info=1&description=1&autoplay=1"
                                                allow="autoplay; fullscreen"
                                                title="TikTok video"
                                            />
                                            <i className="bi bi-trophy-fill"/>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <h3>Road Map in progress</h3>
                                <div className='mb-2'>
                                    <i className="bi bi-clock-history"></i>
                                </div>
                            </>
                        )}
                        <Alert variant="info">
                            <i className="bi bi-list-task" />
                            {' '}
                            Click on a roadmap point to see its tasks inside
                        </Alert>
                    </div>
                )}
                {showEditModal && (
                    <RoadMapPointEditModal
                        isOpen={showEditModal}
                        onClose={handleEditModalClose}
                        newbieId={roadMapPoints[0]?.newbieId}
                        roadMapPoint={selectedEditPoint}
                        roadMapId={parseInt(roadMapId || '0')}
                    />
                )}
                {showDeleteModal && selectedDeletePoint && (
                    <RoadMapPointDeleteModal
                        isOpen={showDeleteModal}
                        onClose={handleDeleteModalClose}
                        roadMapPointId={selectedDeletePoint.id!}
                        roadMapPointName={selectedDeletePoint.name}
                    />
                )}
                <NotificationToast
                    show={showToast}
                    title="Road Map Point Info"
                    message={toastMessage}
                    color={toastColor}
                    onClose={() => setShowToast(false)}
                />
            </div>
        </>
    );
};

export default RoadMapDetails;