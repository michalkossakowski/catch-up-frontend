//import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import TaskContentComponent from './TaskContentComponent';

const TaskContentManage: React.FC = () => {
    return (
        <>
            <h1 className='title'><i className='bi bi-kanban'/> Manage Task Contents</h1>
            <Container>
                <TaskContentComponent isAdmin={true} />
            </Container>
        </>
    );
};

export default TaskContentManage;
