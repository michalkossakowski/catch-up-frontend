import React from 'react';
import { FeedbackDto } from '../../dtos/FeedbackDto';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';
import { doneFeedback } from '../../services/feedbackService';
import { useState } from "react";

type FeedbackItemProps = {
    feedback: FeedbackDto;
    isAdmin: boolean;
    onDeleteClick: (feedback: FeedbackDto) => void;
};

const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedback, onDeleteClick }) => {
    const truncateDescription = (description: string): string => {
        return description.length > 300 ? description.substring(0, 300) + '...' : description;
    };
    const [isResolved, setIsResolved] = useState(feedback.isResolved);

    return (
        <tr key={feedback.id}>
            <td>{feedback.title}</td>
            <td>{truncateDescription(feedback.description)}</td>
            <td>{feedback.userName}</td>
            <td>{new Date(feedback.createdDate).toLocaleDateString()}</td>
            <td>{ResourceTypeEnum[feedback.resourceType]}</td>
            <td>{feedback.resourceName || 'No title'}</td>
            <td>
                {isResolved ? (
                    <button
                        className="btn btn-success"
                        onClick={async () => {
                            if (feedback.id !== undefined) {
                                await doneFeedback(feedback.id);
                                setIsResolved(false);
                            } else {
                                console.error("Feedback ID is undefined");
                            }
                        }}
                    >
                        Resolved
                    </button>
                ) : (
                    <button
                        className="btn btn-secondary"
                        onClick={async () => {
                            if (feedback.id !== undefined) {
                                await doneFeedback(feedback.id);
                                setIsResolved(true);
                            } else {
                                console.error("Feedback ID is undefined");
                            }
                        }}
                    >
                        Not resolved
                    </button>
                )}
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
