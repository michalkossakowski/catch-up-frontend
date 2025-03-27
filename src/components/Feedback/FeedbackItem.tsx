import React from 'react';
import { FeedbackDto } from '../../dtos/FeedbackDto';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';
import { doneFeedback } from '../../services/feedbackService';
import { useState } from "react";

type FeedbackItemProps = {
    feedback: FeedbackDto;
    isAdmin: boolean;
    onDeleteClick: (feedback: FeedbackDto) => void;
    onResolveChange: (id: number, isResolved: boolean) => void;
};

const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedback, onDeleteClick, onResolveChange }) => {
    const [isResolved, setIsResolved] = useState(feedback.isResolved);

    const handleResolve = async () => {
        if (feedback.id !== undefined) {
            await doneFeedback(feedback.id);
            const newIsResolved = !isResolved;
            setIsResolved(newIsResolved);
            await new Promise(resolve => setTimeout(resolve, 300));
            onResolveChange(feedback.id, newIsResolved);
        } else {
            console.error("Feedback ID is undefined");
        }
    };

    return (
        <tr key={feedback.id}>
            <td>{feedback.title}</td>
            <td>{feedback.description.length > 300 ? feedback.description.substring(0, 300) + '...' : feedback.description}</td>
            <td>{feedback.userName}</td>
            <td>{new Date(feedback.createdDate).toLocaleDateString()}</td>
            <td>{ResourceTypeEnum[feedback.resourceType]}</td>
            <td>{feedback.resourceName || 'No title'}</td>
            <td>
                <button className={`btn ${isResolved ? "btn-success" : "btn-secondary"}`} onClick={handleResolve}>
                    {isResolved ? "Resolved" : "Not resolved"}
                </button>
            </td>
            <td>
                {(
                    <button
                        className="btn btn-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                        onClick={() => onDeleteClick(feedback)}
                    >
                        Delete
                    </button>
                )}
            </td>
        </tr>
    );
};

export default FeedbackItem;
