import React, { useState } from 'react';
import { FeedbackDto } from '../../dtos/FeedbackDto';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';
import FeedbackDetailsDialog from './FeedbackDetailsDialog';

type FeedbackItemProps = {
    feedback: FeedbackDto;
    onDeleteClick: (feedback: FeedbackDto) => void;
    onResolveChange: (id: number, isResolved: boolean) => void;
};

const FeedbackItem: React.FC<FeedbackItemProps> = ({ 
    feedback, 
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
                <td>{ResourceTypeEnum[feedback.resourceType]}</td>
                <td>
                    {isResolved ? <i className="bi bi-check-circle-fill"></i> : <i className="bi bi-x-circle-fill text-danger"></i>}
                </td>
                <td>
                    <div>
                        <button 
                            className="btn btn-primary me-1" 
                            onClick={() => setIsDetailsDialogOpen(true)}
                        >
                            Details
                        </button>
                    </div>
                </td>
            </tr>

            <FeedbackDetailsDialog 
                feedback={feedback}
                isOpen={isDetailsDialogOpen}
                onClose={() => setIsDetailsDialogOpen(false)}
                onResolveChange={handleResolveChange}
                onDelete={handleDelete}
            />
        </>
    );
};

export default FeedbackItem;