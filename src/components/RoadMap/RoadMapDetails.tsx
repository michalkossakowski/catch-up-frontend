import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoadMapPointDto } from '../../dtos/RoadMapPointDto';
import { getByRoadMapId } from '../../services/roadMapPointService';
import { Alert, Button } from 'react-bootstrap';
import { StatusEnum } from '../../Enums/StatusEnum';
import Loading from '../Loading/Loading';
import './RoadMapDetails.css';
import RoadMapPointDetails from './RoadMapPointDetails';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { getLocalSetting } from '../../Provider/LocalSettingProvider';

const RoadMapDetails: React.FC = () => {
    const { roadMapId, title } = useParams<{ roadMapId: string; title: string }>();
    const [roadMapPoints, setRoadMapPoints] = useState<RoadMapPointDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
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
            roadMapPoints.every(rmp => rmp.status === StatusEnum.Done)&&
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
                <Button
                    variant="outline-secondary"
                    className="me-2"
                    onClick={() => navigate('/roadmapexplore')}
                >
                    <i className="bi bi-arrow-left me-2" />
                    Back to Road Maps
                </Button>
    
                <Button
                    variant="outline-secondary"
                    className="ms-2"
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
                                    <i className="bi bi-map" />
                                    &nbsp;
                                    No Road Map Points found for this Road Map contact your mentor
                                </Alert>
                            </div>
                        )}
                    </>
                )}
                {selectedPointId ? (
                    <div className="container-roadmap-point-details">
                        <RoadMapPointDetails 
                            roadMapPointId={selectedPointId} 
                            roadMapPointName={roadMapPoints.find(rmp => rmp.id === selectedPointId)?.name} 
                        />
                    </div>
                ) : roadMapPoints.length > 0 && (
                    <div className="d-flex justify-content-center align-items-center m-4 road-map-details-bottom-container">
                        {roadMapPoints.every(rmp => rmp.status === StatusEnum.Done) && (
                            <>
                                <h3>Congratulations you have finished this road map !</h3>
                                <div className='congratulations-container'>
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
                        )}
                        <Alert variant="info">
                            <i className="bi bi-list-task" />
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