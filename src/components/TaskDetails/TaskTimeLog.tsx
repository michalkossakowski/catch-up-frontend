import React from 'react';
import { TaskTimeLogDto } from '../../dtos/TaskTimeLogDto';
import { useState } from 'react';
import { useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import './TaskComment.css'
import { use } from 'i18next';
import { useAuth } from '../../Provider/authProvider';
import TaskComment from './TaskComment';


interface TaskTimeLogProps {
    taskTimeLog: TaskTimeLogDto;
    newbieId: string;
    deleteClick: (id: number) => void;
    editClick: (data: TaskTimeLogDto) => void;
}

const TaskTimeLog: React.FC<TaskTimeLogProps> = ({ taskTimeLog, newbieId, deleteClick, editClick }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {

    });
    const formatDate = (date?: Date | null) => {
        if (date == null) {
            return "N/A";
        }
        return new Date(date).toLocaleTimeString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',});
    };
    return (
        <>
            <Card className='mb-3'>
                <Card.Header>
                    {taskTimeLog.hours} hours {taskTimeLog.minutes} minutes 
                    <div className='additional-text '>
                        {formatDate(taskTimeLog.creationDate)}
                    </div>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        {taskTimeLog.description}<br/>
                        {taskTimeLog.modificationDate && (
                        <span className='additional-text '>
                            (edited)
                        </span>
                    )}
                    </Card.Text>
                    
                    {useAuth().user?.id === newbieId && (
                        <>
                            <Button variant="primary" size="sm" onClick={()=>editClick(taskTimeLog)}>Edit</Button>
                            <Button
                                variant="danger"
                                className='ms-2'
                                size="sm"
                                onClick={() => {
                                    if (taskTimeLog.id !== undefined) {
                                        deleteClick(taskTimeLog.id);
                                    }
                                }}
                            >Delete</Button> 
                        </> 
                    )}
                </Card.Body>
            </Card>
        </> 
    );

};

export default TaskTimeLog;