import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import PresetComponent from './PresetComponent';
import NotificationToast from '../Toast/NotificationToast';

const PresetManage: React.FC = () => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('');
    
    return (
        <>
            <h1 className='title'><i className='bi bi-stack-overflow'/> Manage Task Presets</h1>
            <Container>
                <PresetComponent isAdmin={true} />
            </Container>
            
            <NotificationToast
                show={showToast}
                title="Preset Management"
                message={toastMessage}
                color={toastColor}
                onClose={() => setShowToast(false)}
            />
        </>
    );
};

export default PresetManage; 