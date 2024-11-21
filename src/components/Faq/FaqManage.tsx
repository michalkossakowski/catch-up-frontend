import React from 'react';
import { Container } from 'react-bootstrap';
import FaqComponent from './FaqComponent';
import './FaqComponent.css'; 

const FaqManage: React.FC = () => {
    return (
        <>
        <h1 className='title'>Manage Faq</h1>
            <Container>
                <FaqComponent isAdmin={true}/>
            </Container>
        </>
    );
};

export default FaqManage;
