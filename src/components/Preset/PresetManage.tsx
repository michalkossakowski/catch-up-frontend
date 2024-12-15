import React from 'react';
import { Container } from 'react-bootstrap';
import PresetComponent from './PresetComponent';

const PresetManage: React.FC = () => {
    return (
        <>
            <h1 className='title'>Manage Presets</h1>
            <Container>
                <PresetComponent isAdmin={true} />
            </Container>
        </>
    );
};

export default PresetManage; 