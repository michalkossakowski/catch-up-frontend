import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import FaqComponent from './FaqComponent';


const FaqManage: React.FC = () => {
    return (
        <>
        <h1>Manage Faq</h1>
            <Container>
                <FaqComponent isAdmin={true}/>
            </Container>
        </>
    );
};

export default FaqManage;
