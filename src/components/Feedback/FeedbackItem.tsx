import React from 'react';
import { FeedbackDto } from '../../dtos/FeedbackDto';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';
import { Link } from 'react-router-dom';

type FeedbackItemProps = {
    feedback: FeedbackDto;
    isNewbie: boolean;
    onInfoClick: (feedback: FeedbackDto) => void;
};

const FeedbackItem: React.FC<FeedbackItemProps> = ({ 
    feedback, 
    isNewbie,
    onInfoClick
}) => {
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
                    {feedback.isResolved ? <i className="bi bi-check-circle-fill"></i> : <i className="bi bi-x-circle-fill text-danger"></i>}
                </td>
                <td>
                    <button 
                        className="btn btn-primary bi bi-info-circle-fill" 
                        onClick={() => onInfoClick(feedback)}
                    >
                    </button>
                </td>
            </tr>
        </>
    );
};

export default FeedbackItem;