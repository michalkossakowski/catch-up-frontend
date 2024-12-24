

import React, { useState } from 'react';
import { RoadMapDto } from '../../dtos/RoadMapDto';
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { getByNewbieId } from '../../services/roadMapService';
import Loading from '../Loading/Loading';
import './RoadMapList.css'; 
import { StatusEnum } from '../../Enums/StatusEnum';


const RoadMapList: React.FC = () => {
    const [roadMaps, setRoadMaps] = useState<RoadMapDto[]>([]);

    const [loading, setLoading] = useState(true)

    const [searchMessage, setSearchMessage] = useState('alert')
    const [showSearchMessage, setShowSearchMessage] = useState(false)
    const [searchNewbieId, setSearchNewbieId] = useState('');

    const searchRoadMaps = () => {
        getByNewbieId(searchNewbieId)
            .then((data) => {
                setRoadMaps(data);
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
                        placeholder="Enter newbie id..."
                        value={searchNewbieId} 
                        onChange={(e) => setSearchNewbieId(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && searchRoadMaps()}
                    />
                    <Button variant="primary" id="searchButton" onClick={searchRoadMaps}> 
                        Get Road Maps
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
                            {roadMaps.map((rm) => (
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">#{rm.id} - {rm.name}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">Start Date: {rm.startDate?.toString()}</h6>
                                        <div className="card-text">
                                            Finish Date:  {rm.finishDate?.toString()}
                                            <br/>
                                             Status: {rm.status !== undefined ? StatusEnum[rm.status] : 'Unknown'}
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

export default RoadMapList;
