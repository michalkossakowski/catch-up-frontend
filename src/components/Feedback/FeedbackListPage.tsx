import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Provider/authProvider';
import { getFeedbacks, deleteFeedback, getTitleFeedbacks } from '../../services/feedbackService';
import { FeedbackDto } from '../../dtos/FeedbackDto';
import NotificationToast from '../Toast/NotificationToast';
import Loading from '../Loading/Loading';
import { getRole } from '../../services/userService';
import FeedbackItem from './FeedbackItem';
import ConfirmModal from '../Modal/ConfirmModal';
import { Button, Form, InputGroup, Row } from 'react-bootstrap';
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
    const [selectedResolved, setSelectedResolved] = useState<string[]>(["unresolved"]);
    const [originalFeedbacks, setOriginalFeedbacks] = useState<FeedbackDto[]>([]);
    const [selectedResourceTypes, setSelectedResourceTypes] = useState<ResourceTypeEnum[]>([]);
    const [sortColumn, setSortColumn] = useState<keyof FeedbackDto | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [searchTitle, setSearchTitle] = useState('');
    const [isSearching, setIsSearching] = useState(false);
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

        if (selectedResolved.length === 1) {
            if (selectedResolved.includes("resolved")) {
                filtered = filtered.filter(feedback => feedback.isResolved);
            } else {
                filtered = filtered.filter(feedback => !feedback.isResolved);
            }
        }

        if (selectedResourceTypes.length > 0) { 
            filtered = filtered.filter(feedback => selectedResourceTypes.includes(feedback.resourceType));
        }

        filtered = filtered.sort((a, b) => {
            if (sortColumn) {
                const valueA = a[sortColumn];
                const valueB = b[sortColumn];
        
                if (typeof valueA === "string" && typeof valueB === "string") {
                    return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                }
        
                if (typeof valueA === "number" && typeof valueB === "number") {
                    return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
                }
        
                if (sortColumn === "createdDate") {
                    const dateA = new Date(a.createdDate).getTime();
                    const dateB = new Date(b.createdDate).getTime();
                    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
                }
            }
        
            return 0;
        });
    
        setFeedbacks(filtered);
    }, [selectedResolved, selectedResourceTypes, originalFeedbacks, sortColumn, sortOrder]);

    const searchFeedback = async () => {
        if (!user) return;
    
        setIsSearching(true);
    
        const userRoleResponse = await getRole(user.id ?? 'defaultId');
        setIsAdmin(userRoleResponse !== 'Newbie');

        if (searchTitle.length === 0) {
            setOriginalFeedbacks(await getFeedbacks(user.id ?? 'defaultId', userRoleResponse !== 'Newbie'));
            setIsSearching(false);
            return;
        }
    
        const filteredFeedbacks = await getTitleFeedbacks(
            searchTitle,
            user.id ?? 'defaultId',
            userRoleResponse !== 'Newbie'
        );
    
        setOriginalFeedbacks(filteredFeedbacks);
        setIsSearching(false);
    };

    const toggleResourceType = (type: ResourceTypeEnum) => {
        setSelectedResourceTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };
    
    const toggleResolved = (type: "resolved" | "unresolved") => {
        setSelectedResolved(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleResolveChange = (id: number, isResolved: boolean) => {
        setOriginalFeedbacks(prev =>
            prev.map(feedback => (feedback.id === id ? { ...feedback, isResolved } : feedback))
        );
    };

    const handleSort = (column: keyof FeedbackDto) => {
        setSortOrder(prevOrder => (sortColumn === column ? (prevOrder === "asc" ? "desc" : "asc") : "asc"));
        setSortColumn(column);
    };

    const handleDelete = async () => {
        if (!feedbackToDelete || feedbackToDelete.id === undefined) return;
    
        try {
            await deleteFeedback(feedbackToDelete.id);
            
            setFeedbacks(prev => prev.filter(feedback => feedback.id !== feedbackToDelete.id));
            setOriginalFeedbacks(prev => prev.filter(feedback => feedback.id !== feedbackToDelete.id));
    
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
                <div className='searchBox'>
                    <InputGroup className="inputGroup mw-100">
                        <Form.Control
                            placeholder="Enter searching title..."
                            value={searchTitle} 
                            onChange={(e) => setSearchTitle(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && searchFeedback()}
                        />
                        <Button variant="primary" id="searchButton" onClick={searchFeedback}> 
                            <i className="bi bi-search">&nbsp;</i>Search 
                        </Button>
                    </InputGroup>
                </div>
                <Row className="mb-3">
                    <div className="col-3">
                        <h4 className="text-start mt-3">Filters</h4>
                        <hr></hr>
                        <Form.Group as={Row} className="text-start">
                            <Form.Label><h6>Filter by Resolved:</h6></Form.Label>
                        
                            <Form.Check
                                type="checkbox"
                                label="Resolved"
                                value="resolved"
                                checked={selectedResolved.includes("resolved")}
                                onChange={() => toggleResolved("resolved")}
                            />
                            
                            <Form.Check
                                type="checkbox"
                                label="Unresolved"
                                value="unresolved"
                                checked={selectedResolved.includes("unresolved")}
                                onChange={() => toggleResolved("unresolved")}
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
                    </div>
                    <div className="col-9">
                        {isSearching ? (
                            <Loading />
                        ) : !feedbacks.length ? (
                            <div className="alert alert-secondary text-center">No feedbacks found</div>
                        ) : (
                            <table className="table table-striped mt-3">
                                <thead>
                                    <tr>
                                        <th onClick={() => handleSort("title")} style={{ cursor: "pointer" }}>
                                            Title 
                                            <i className="bi bi-arrow-down-up ms-2"></i>
                                        </th>
                                        <th onClick={() => handleSort("userName")} style={{ cursor: "pointer" }}>
                                            {isAdmin ? 'Sender' : 'Receiver'} 
                                            <i className="bi bi-arrow-down-up ms-2"></i>
                                        </th>
                                        <th onClick={() => handleSort("createdDate")} style={{ cursor: "pointer" }}>
                                            Date 
                                            <i className="bi bi-arrow-down-up ms-2"></i>
                                        </th>
                                        <th onClick={() => handleSort("resourceType")} style={{ cursor: "pointer" }}>
                                            Resource Type 
                                            <i className="bi bi-arrow-down-up ms-2"></i>
                                        </th>
                                        <th>Resolved</th>
                                        <th>Detail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbacks.map((feedback) => (
                                        <FeedbackItem 
                                            key={feedback.id} 
                                            feedback={feedback} 
                                            isAdmin={isAdmin} 
                                            onDeleteClick={setFeedbackToDelete}
                                            onResolveChange={handleResolveChange}
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
