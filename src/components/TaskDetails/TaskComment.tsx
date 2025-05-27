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
                                        enableEdittingMaterialName={false}
                                        enableEdittingFile={false}
                                        showMaterialName={true}
                                        nameTitle='See Materials' />
                    )}
                    {useAuth().user?.id === taskComment.creatorId && (
                        <>
                            <Button variant="primary" size="sm" onClick={() => { if (taskComment.id !== undefined) editClick(taskComment); }} >Edit</Button>
                            <Button variant="danger" className='ms-2' size="sm" onClick={() => { if (taskComment.id !== undefined) deleteClick(taskComment.id); }}>Delete</Button> 
                        </> 
                    )}
                    
                </Card.Body>
            </Card>
        </>
    );
}
export default TaskComment;