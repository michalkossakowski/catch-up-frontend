import React, { useState } from 'react';
import { FeedbackDto } from '../../dtos/FeedbackDto';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';
import FeedbackDetailsDialog from './FeedbackDetailsDialog';
import { Link, useNavigate } from 'react-router-dom';

type FeedbackItemProps = {
    feedback: FeedbackDto;
    isNewbie: boolean;
    onDeleteClick: (feedback: FeedbackDto) => void;
    onResolveChange: (id: number, isResolved: boolean) => void;
};

const FeedbackItem: React.FC<FeedbackItemProps> = ({ 
    feedback, 
    isNewbie,
    onDeleteClick, 
    onResolveChange 
}) => {
    const [isResolved, setIsResolved] = useState(feedback.isResolved);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const handleDelete = () => {
        onDeleteClick(feedback);
    };

    const handleResolveChange = (id: number, newIsResolved: boolean) => {
        setIsResolved(newIsResolved);
        
        onResolveChange(id, newIsResolved);
    };

    return (
        <>
            <tr key={feedback.id}>
                <td>{feedback.title}</td>
                <td>{feedback.userSend}</td>
                <td>{feedback.userReceive}</td>
                <td>{new Date(feedback.createdDate).toLocaleDateString()}</td>
                <td>
                {ResourceTypeEnum[feedback.resourceType] === "Faq" && (
                    <Link
                    to="/faq"
                    state={{ searchPhrase: feedback.resourceName }}
                  >
                    {ResourceTypeEnum[feedback.resourceType]}
                  </Link>
                )}

                {ResourceTypeEnum[feedback.resourceType] === "Task" && (
                    //zmodyfikować po reworku tasków
                    <Link
                    to={isNewbie ? "/tasks" : "/taskmanage"}
                    state={{ selectedNewbie: feedback.senderId }}>
                    {ResourceTypeEnum[feedback.resourceType]}
                    </Link>
                )}

                {ResourceTypeEnum[feedback.resourceType] === "Schooling" && (
                    //zmodyfikować po reworku schoolingsów
                    <Link
                    to="/schooling/schoolingdetails">
                    {ResourceTypeEnum[feedback.resourceType]}
                    </Link>
                )}

                {["Faq", "Task", "Schooling"].includes(ResourceTypeEnum[feedback.resourceType]) === false && (
                    <span>{ResourceTypeEnum[feedback.resourceType]}</span>
                )}
                </td>
                <td>
                    {isResolved ? <i className="bi bi-check-circle-fill"></i> : <i className="bi bi-x-circle-fill text-danger"></i>}
                </td>
                <td>
                    <button 
                        className="btn btn-primary bi bi-info-circle-fill" 
                        onClick={() => setIsDetailsDialogOpen(true)}
                    >
                    </button>
                </td>
            </tr>

            <FeedbackDetailsDialog 
                feedback={feedback}
                isOpen={isDetailsDialogOpen}
                isNewbie={isNewbie}
                onClose={() => setIsDetailsDialogOpen(false)}
                onResolveChange={handleResolveChange}
                onDelete={handleDelete}
            />
        </>
    );
};

export default FeedbackItem;