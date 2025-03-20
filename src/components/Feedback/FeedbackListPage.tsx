import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Provider/authProvider';
import { getFeedbacks, deleteFeedback } from '../../services/feedbackService';
import { FeedbackDto } from '../../dtos/FeedbackDto';
import NotificationToast from '../Toast/NotificationToast';
import Loading from '../Loading/Loading';
import { getRole } from '../../services/userService';
import FeedbackItem from './FeedbackItem';
import ConfirmModal from '../Modal/ConfirmModal';
import { Form, Row, Col } from 'react-bootstrap';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';


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
    const [showResolved, setShowResolved] = useState(false);
    const [originalFeedbacks, setOriginalFeedbacks] = useState<FeedbackDto[]>([]);
    const [selectedResourceTypes, setSelectedResourceTypes] = useState<ResourceTypeEnum[]>([]);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        const loadFeedbacks = async () => {
            if (!user) return;
            try {
                const userRoleResponse = await getRole(user.id ?? 'defaultId');
                setIsAdmin(userRoleResponse !== 'Newbie');
                const feedbackList = await getFeedbacks(user.id ?? 'defaultId', userRoleResponse !== 'Newbie');
                setFeedbacks(feedbackList);
                setOriginalFeedbacks(feedbackList);
            } catch (error) {
                setApiError(true);
            } finally {
                setIsLoading(false);
            }
        };
    
        loadFeedbacks();
    }, [user]);

    useEffect(() => {
        let filtered = originalFeedbacks;
    
        if (!showResolved) {
            filtered = filtered.filter(feedback => !feedback.isResolved);
        }
    
        if (selectedResourceTypes.length > 0) { 
            filtered = filtered.filter(feedback => selectedResourceTypes.includes(feedback.resourceType));
        }

        filtered = filtered.sort((a, b) => {
            const dateA = new Date(a.createdDate).getTime();
            const dateB = new Date(b.createdDate).getTime();
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
    
        setFeedbacks(filtered);
    }, [showResolved, selectedResourceTypes, originalFeedbacks, sortOrder]);

    const toggleResourceType = (type: ResourceTypeEnum) => {
        setSelectedResourceTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };
    
    const handleResolveChange = (id: number, isResolved: boolean) => {
        setOriginalFeedbacks(prev =>
            prev.map(feedback => (feedback.id === id ? { ...feedback, isResolved } : feedback))
        );
    };

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
        return (
            <div className="m-3">
                <Loading />
            </div>
        );
    }

    if (apiError) {
        return <div className="alert alert-danger text-center mt-5 mb-5 ms-6 me-6 container">Error: API is not available</div>;
    }

    return (
        <>
            <div className="container">
                <h3 className="text-center mt-3">Feedbacks</h3>
                <Row className="mb-3">
                    <div className="col">
                        <h4 className="text-start mt-3">Filters</h4>
                        <hr></hr>
                        <Form.Group as={Row} className="text-start">
                            <Form.Label><h6>Filter by Resolved:</h6></Form.Label>
                            <Form.Switch
                                label="Show Resolved Feedbacks"
                                checked={showResolved}
                                onChange={() => setShowResolved(prev => !prev)}
                            />
                        </Form.Group>
                        <hr></hr>
                        <Form.Group as={Row} className="text-start">
                            <Form.Label><h6>Filter by Resource Type:</h6></Form.Label>
                            {Object.values(ResourceTypeEnum)
                                .filter(value => typeof value === "number")
                                .map(value => (
                                    <Form.Check
                                        key={value}
                                        type="checkbox"
                                        label={ResourceTypeEnum[value as unknown as keyof typeof ResourceTypeEnum]}
                                        value={value}
                                        checked={selectedResourceTypes.includes(value as ResourceTypeEnum)}
                                        onChange={() => toggleResourceType(value as ResourceTypeEnum)}
                                        className="me-3 text-start"
                                    />
                                ))}
                        </Form.Group>
                        <hr></hr>
                        <Form.Group as={Row} className="text-start">
                            <Form.Label><h6>Sort by Date:</h6></Form.Label>
                            <Form.Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}>
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </Form.Select>
                        </Form.Group>
                        <hr></hr>
                    </div>
                    <div className="col">
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
                                        <th colSpan={2}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbacks.map((feedback) => (
                                        <FeedbackItem 
                                            key={feedback.id} 
                                            feedback={feedback} 
                                            isAdmin={isAdmin} 
                                            onDeleteClick={setFeedbackToDelete}
                                            onResolveChange={handleResolveChange}  // 🔥 Nowy prop
                                        />
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Row>

                <ConfirmModal
                    show={!!feedbackToDelete}
                    title="Delete Feedback"
                    message={`Are you sure you want to delete the feedback titled: ${feedbackToDelete?.title}`}
                    onConfirm={handleDelete}
                    onCancel={() => setFeedbackToDelete(null)}
                />
            </div>

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
