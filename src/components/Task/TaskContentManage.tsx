//import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import TaskContentComponent from './TaskContentComponent';

const TaskContentManage: React.FC = () => {
    return (
        <>
            <h1 className='title'>Manage TaskContents</h1>
            <Container>
                <TaskContentComponent isAdmin={true} />
            </Container>
        </>
    );
};

export default TaskContentManage;
