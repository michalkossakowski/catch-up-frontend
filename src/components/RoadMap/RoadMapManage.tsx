import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import RoadMapAdd from './RoadMapAdd';
import RoadMapPointAdd from './RoadMapPointAdd';
import RoadMapPointList from './RoadMapPointList';
import RoadMapList from './RoadMapList';

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
                <Row>
                    <Col>
                        <RoadMapList/>
                    </Col>

                    <Col>
                        <RoadMapPointList/>
                    </Col>
                </Row>
            </Container>


        </>
    );
};

export default RoadMapManage;
