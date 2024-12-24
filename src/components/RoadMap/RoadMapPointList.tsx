
import React, { useState } from 'react';
import { RoadMapPointDto } from '../../dtos/RoadMapPointDto';
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { getByRoadMapId } from '../../services/roadMapPointService';
import Loading from '../Loading/Loading';
import './RoadMapPointList.css'; 
import { StatusEnum } from '../../Enums/StatusEnum';

const RoadMapPointList: React.FC = () => {
    const [roadMapPoints, setRoadMapPoints] = useState<RoadMapPointDto[]>([]);

    const [loading, setLoading] = useState(true)

    const [searchMessage, setSearchMessage] = useState('alert')
    const [showSearchMessage, setShowSearchMessage] = useState(false)
    const [searchRoadMapId, setSearchRoadMapId] = useState(Number);

    const searchRoadMapPoints = () => {
        getByRoadMapId(searchRoadMapId)
            .then((data) => {
                setRoadMapPoints(data);
                setShowSearchMessage(false);
            })
            .catch((error) => {
                setShowSearchMessage(true);
                setSearchMessage(error.message);
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <div className='searchBox'>
                <InputGroup className="inputGroup mb-3">
                    <Form.Control
                        type ="number"
                        placeholder="Enter road map id..."
                        value={searchRoadMapId} 
                        onChange={(e) => setSearchRoadMapId(parseInt(e.target.value))} 
                        onKeyDown={(e) => e.key === 'Enter' && searchRoadMapPoints()}
                    />
                    <Button variant="primary" id="searchButton" onClick={searchRoadMapPoints}> 
                        Get Road Map Points
                    </Button>
                </InputGroup>
            </div>


            <section className='container'>
                <div className='loaderBox'>
                    
                    {loading && (
                        <Loading/>
                    )}
                    {showSearchMessage &&(
                        <Alert className='alert' variant='warning'>
                            {searchMessage}
                        </Alert>
                    )}
                </div>

                {!showSearchMessage && !loading &&(
                    <div>
                        <ul>
                            {roadMapPoints.map((rmp) => (
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">#{rmp.id} - {rmp.name}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">Start Date: {rmp.startDate?.toString()}</h6>
                                        <div className="card-text">
                                            Finish Date:  {rmp.finishDate?.toString()}
                                            <br/>
                                            Deadline: {rmp.deadline?.toString()}
                                            <br/>
                                            Status: {rmp.status !== undefined ? StatusEnum[rmp.status] : 'Unknown'}
                                        </div>  
                                        
                                    </div>
                                </div>
        
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </>
    );
};

export default RoadMapPointList;
