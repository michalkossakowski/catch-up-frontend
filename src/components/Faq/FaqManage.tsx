import React, { useState } from 'react';
import axiosInstance from '../../../axiosConfig';
import FaqAdd from './FaqAdd';
import { Col, Container, Row } from 'react-bootstrap';
import FaqComponent from './FaqComponent';


const FaqManage: React.FC = () => {
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Row>
                            <FaqAdd/>
                        </Row>
                        
                    </Col>

                    <Col>
                        <FaqComponent/>
                    </Col>
                </Row>
            </Container>

        </>
    );
};

export default FaqManage;
