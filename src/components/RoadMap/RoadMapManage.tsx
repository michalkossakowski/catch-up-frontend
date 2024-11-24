import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import RoadMapAdd from './RoadMapAdd';
import RoadMapPointAdd from './RoadMapPointAdd';

const RoadMapManage: React.FC = () => {
    return (
        <>
            <h1 className='title'>RoadMap Manage</h1>
            <Container>
                <Row>
                    <Col>
                        <RoadMapAdd/>
                    </Col>

                    <Col>
                        <RoadMapPointAdd/>
                    </Col>
                </Row>
            </Container>


        </>
    );
};

export default RoadMapManage;
