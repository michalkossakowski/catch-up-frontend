import React from 'react';
import { TaskCommentDto } from '../../dtos/TaskCommentDto';
import { useState } from 'react';
import { useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import MaterialItem from '../MaterialManager/MaterialItem';
import './TaskComment.css'
import { use } from 'i18next';
import { useAuth } from '../../Provider/authProvider';

interface TaskCommentProps {
    taskComment: TaskCommentDto;
    deleteClick: (id: number) => void;
    editClick: (data: TaskCommentDto) => void;
}

const TaskComment: React.FC<TaskCommentProps> = ({ taskComment, deleteClick, editClick }) => {
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
                    {taskComment.creatorName}
                    <div className='additional-text '>
                        {formatDate(taskComment.creationDate)}
                    </div>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        {taskComment.content} <br/>
                        {taskComment.modificationDate && (
                            <span className='additional-text '>
                                (edited)
                            </span>
                        )}
                    </Card.Text>
                    
                    {taskComment.materialId && (
                        <MaterialItem
                                        materialId={taskComment.materialId}
                                        enableDownloadFile={true}
                                        enableAddingFile={false}
                                        enableRemoveFile={false}
                                        enableEdittingMaterialName={false}/>
                    )}
                    {useAuth().user?.id === taskComment.creatorId && (
                        <div className='d-flex justify-content-end'>
                            <Button 
                                variant="danger"
                                onClick={() => { if (taskComment.id !== undefined) deleteClick(taskComment.id); }}>
                                <i className='bi-trash' style={{color: 'white'}}></i> Delete
                            </Button>
                            <Button className='ms-2'
                                variant="primary"
                                 onClick={() => { if (taskComment.id !== undefined) editClick(taskComment); }}>
                                <i className='bi-pencil' style={{color: 'white'}}></i> Edit
                            </Button> 
                        </div> 
                    )}
                    
                </Card.Body>
            </Card>
        </>
    );
}
export default TaskComment;