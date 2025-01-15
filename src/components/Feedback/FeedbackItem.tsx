import React from 'react';
import { FeedbackDto } from '../../dtos/FeedbackDto';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';

type FeedbackItemProps = {
    feedback: FeedbackDto;
    isAdmin: boolean;
    onDeleteClick: (feedback: FeedbackDto) => void;
};

const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedback, isAdmin, onDeleteClick }) => {
    const truncateDescription = (description: string): string => {
        return description.length > 300 ? description.substring(0, 300) + '...' : description;
    };

    return (
        <tr key={feedback.id}>
            <td>{feedback.title}</td>
            <td>{truncateDescription(feedback.description)}</td>
            <td>
                {isAdmin
                    ? `${feedback.senderName} ${feedback.senderSurname}`
                    : `${feedback.receiverName} ${feedback.receiverSurname}`}
            </td>
            <td>{new Date(feedback.createdDate).toLocaleDateString()}</td>
            <td>{ResourceTypeEnum[feedback.resourceType]}</td>
            <td>{feedback.resourceTitle || 'No title'}</td>
            <td>
                {isAdmin && (
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
