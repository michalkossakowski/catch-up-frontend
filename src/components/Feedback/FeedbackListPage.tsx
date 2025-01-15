import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Provider/authProvider';
import { getFeedbacks, deleteFeedback } from '../../services/feedbackService';
import { FeedbackDto } from '../../dtos/FeedbackDto';
import NotificationToast from '../Toast/NotificationToast';
import Loading from '../Loading/Loading';
import axiosInstance from '../../../axiosConfig';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';
import { getRole, getUserById } from '../../services/userService';
import FeedbackItem from './FeedbackItem';
import { FaqDto } from '../../dtos/FaqDto';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { FullSchoolingDto } from '../../dtos/FullSchoolingDto';
import ConfirmModal from '../Modal/ConfirmModal'; 

const fetchResourceTitle = async (resourceId: number, resourceType: ResourceTypeEnum): Promise<string> => {
    if (resourceType === ResourceTypeEnum.Faq) {
        try {
            const response  = await axiosInstance.get<FaqDto>(`/Faq/GetById/${resourceId}`);
            const faq = response.data;
            return faq.question.length > 0 ? faq.question : 'Unknown FAQ';
        } catch (error) {
            console.error('Failed to fetch FAQ title', error);
            return 'Unknown FAQ';
        }
    }else if(resourceType === ResourceTypeEnum.Task){
        try {
            const response  = await axiosInstance.get<TaskContentDto>(`/Task/GetFullTaskById/${resourceId}`);
            const task = response.data;
            return task.title.length > 0 ? task.title : 'Unknown Task';
        } catch (error) {
            console.error('Failed to fetch Task title', error);
            return 'Unknown Task';
        }
    }else if (resourceType === ResourceTypeEnum.Schooling) {
        try {
            const response = await axiosInstance.get<FullSchoolingDto>(`/Schooling/GetFull/${resourceId}`);
            const schooling = response.data.schooling;
            return schooling?.title && schooling.title.length > 0 ? schooling.title: 'Unknown Schooling';

        } catch (error) {
            console.error('Failed to fetch Schooling title', error);
            return 'Unknown Schooling';
        }
    }
    return 'Unknown Resource';
};

const FeedbackListPage: React.FC = () => {
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([]);
    const [feedbackToDelete, setFeedbackToDelete] = useState<FeedbackDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('');
    const [apiError, setApiError] = useState(false);

    useEffect(() => {
        const loadFeedbacks = async () => {
            if (!user) return;
            try {
                const userRoleResponse = await getRole(user.id ?? 'defaultId');
                setIsAdmin(userRoleResponse !== 'Newbie');
                const feedbackList = await getFeedbacks(user.id ?? 'defaultId', userRoleResponse !== 'Newbie');
                const feedbacksWithDetails = await Promise.all(feedbackList.map(async (feedback) => {
                    const sender = await getUserById(feedback.senderId);
                    const receiver = await getUserById(feedback.receiverId);
                    const resourceTitle = await fetchResourceTitle(feedback.resourceId, feedback.resourceType);
    
                    return { 
                        ...feedback, 
                        senderName: sender.name, 
                        senderSurname: sender.surname,
                        receiverName: receiver.name, 
                        receiverSurname: receiver.surname,
                        resourceTitle 
                    };
                }));
    
                setFeedbacks(feedbacksWithDetails);
            } catch (error) {
                setApiError(true);
            } finally {
                setIsLoading(false);
            }
        };
    
        loadFeedbacks();
    }, [user]);

    const handleDelete = async () => {
        if (!feedbackToDelete || feedbackToDelete.id === undefined) return;
    
        try {
            await deleteFeedback(feedbackToDelete.id);
            setFeedbacks(feedbacks.filter((feedback) => feedback.id !== feedbackToDelete.id));
            setToastMessage('Feedback successfully deleted');
            setToastColor('green');
            setShowToast(true);
        } catch (error) {
            setToastMessage('Failed to delete feedback');
            setToastColor('red');
            setShowToast(true);
        } finally {
            setFeedbackToDelete(null);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (apiError) {
        return <div className="alert alert-danger text-center">Error: API is not available</div>;
    }

    return (
        <>
            <div className="container">
                <h3 className="text-center mt-3">Feedbacks</h3>
                {!feedbacks.length ? (
                    <div className="alert alert-secondary text-center">No feedbacks found</div>
                ) : (
                    <table className="table table-striped mt-3">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>{isAdmin ? 'Sender' : 'Receiver'}</th>
                                <th>Date</th>
                                <th>Resource Type</th>
                                <th>Resource Title</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.map((feedback) => (
                                <FeedbackItem 
                                    key={feedback.id} 
                                    feedback={feedback} 
                                    isAdmin={isAdmin} 
                                    onDeleteClick={setFeedbackToDelete} 
                                />
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Confirmation Modal */}
                <ConfirmModal
                    show={!!feedbackToDelete}
                    title="Delete Feedback"
                    message={`Are you sure you want to delete the feedback titled: ${feedbackToDelete?.title}`}
                    onConfirm={handleDelete}
                    onCancel={() => setFeedbackToDelete(null)}
                />
            </div>

            {/* Toast outside of modal lifecycle */}
            <NotificationToast
                show={showToast}
                title="Feedback Operation"
                message={toastMessage}
                color={toastColor}
                onClose={() => setShowToast(false)}
            />
        </>
    );
};

export default FeedbackListPage;
