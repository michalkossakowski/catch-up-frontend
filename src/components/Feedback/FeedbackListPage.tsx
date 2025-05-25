import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Provider/authProvider';
import { getFeedbacks, deleteFeedback, getTitleFeedbacks } from '../../services/feedbackService';
import { FeedbackDto } from '../../dtos/FeedbackDto';
import NotificationToast from '../Toast/NotificationToast';
import Loading from '../Loading/Loading';
import { getAll, getRole } from '../../services/userService';
import FeedbackItem from './FeedbackItem';
import ConfirmModal from '../Modal/ConfirmModal';
import { Button, Form, InputGroup, Row } from 'react-bootstrap';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';
import './FeedbackListPage.css';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { UserDto } from '../../dtos/UserDto';
import FeedbackDetailsDialog from './FeedbackDetailsDialog';


const FeedbackListPage: React.FC = () => {
    const animatedComponents = makeAnimated();
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([]);
    const [feedbackToDelete, setFeedbackToDelete] = useState<FeedbackDto | null>(null);
    const [feedbackToDialog, setFeedbackToDialog] = useState<FeedbackDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isNewbie, setIsNewbie] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('');
    const [apiError, setApiError] = useState(false);
    const [selectedResolved, setSelectedResolved] = useState<string[]>(["unresolved"]);
    const [originalFeedbacks, setOriginalFeedbacks] = useState<FeedbackDto[]>([]);
    const [selectedResourceTypes, setSelectedResourceTypes] = useState<ResourceTypeEnum[]>([]);
    const [filterSentByMe, setFilterSentByMe] = useState(false);
    const [filterSentToMe, setFilterSentToMe] = useState(false);
    const [sortColumn, setSortColumn] = useState<keyof FeedbackDto | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [searchTitle, setSearchTitle] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");
    const [users, setUsers] = useState<UserDto[]>([]);
    const [selectedSender, setSelectedSender] = useState<string>("");
    const [selectedReceiver, setSelectedReceiver] = useState<string>("");
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    useEffect(() => {
        const loadFeedbacks = async () => {
            if (!user) return;
            try {
                const userRoleResponse = await getRole(user.id ?? 'defaultId');
                setIsNewbie(userRoleResponse === 'Newbie');
                setUsers(await getAll());
                const feedbackList = await getFeedbacks();
                setFeedbacks(feedbackList.reverse());
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
    
        if (filterSentByMe) {
            filtered = filtered.filter(feedback => feedback.senderId === user?.id);
        }

        if (filterSentToMe) {
            filtered = filtered.filter(feedback => feedback.receiverId === user?.id);
        }

        if (dateFrom) {
            filtered = filtered.filter(feedback => feedback.createdDate.toString().substring(0, 10) >= dateFrom);
        }
        
        if (dateTo) {
            filtered = filtered.filter(feedback => feedback.createdDate.toString().substring(0, 10) <= dateTo);
        }

        if(selectedSender){
            filtered = filtered.filter(feedback => feedback.senderId === selectedSender);
        }

        if(selectedReceiver){
            filtered = filtered.filter(feedback => feedback.receiverId === selectedReceiver);
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

                if (typeof valueA === "boolean" && typeof valueB === "boolean") {
                    if (valueA === valueB) return 0;
                    return sortOrder === "asc" ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
                }
            }
    
            return 0;
        });
    
        setFeedbacks(filtered);
    }, [selectedResolved, selectedResourceTypes, originalFeedbacks, sortColumn, sortOrder, filterSentByMe, filterSentToMe, dateTo, dateFrom, selectedSender, selectedReceiver, isNewbie, user]);
    

    const searchFeedback = async () => {
        if (!user) return;
    
        setIsSearching(true);
    
        const userRoleResponse = await getRole(user.id ?? 'defaultId');
        setIsNewbie(userRoleResponse === 'Newbie');

        if (searchTitle.length === 0) {
            setOriginalFeedbacks(await getFeedbacks());
            setIsSearching(false);
            return;
        }
    
        const filteredFeedbacks = await getTitleFeedbacks(searchTitle);
        console.log(filteredFeedbacks);
        setOriginalFeedbacks(filteredFeedbacks);
        setIsSearching(false);
    };

    const handleResourceTypeChange = (selectedOptions: any) => {
        const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setSelectedResourceTypes(values);
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

    const handleInfoClick = (fb: FeedbackDto) => {
     setFeedbackToDialog(fb);
     setIsDetailsDialogOpen(true);
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

    const resourceTypeOptions = Object.values(ResourceTypeEnum)
    .filter(value => typeof value === "number")
    .map(value => ({
        value: value,
        label: ResourceTypeEnum[value as unknown as keyof typeof ResourceTypeEnum]
    }));

    const userTypes = ['newbie', 'mentor', 'admin', 'hr', 'other'];

    const groupedUsers = userTypes.reduce((acc, type) => {
        acc[type] = users.filter(user => 
            user.type != undefined && 
            (type === 'other' ? !['hr', 'admin', 'mentor', 'newbie'].includes(user.type.toLowerCase()) : user.type.toLowerCase() === type)
        );
        return acc;
    }, {} as Record<string, typeof users>);

    const groupedOptions = userTypes.map((type) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        options: groupedUsers[type].map((user) => ({
            value: user.id,
            label: `${user.name} ${user.surname}`,
        }))
    }));

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
                    <div className="col-2">
                        <h4 className="text-start mt-3">Filters</h4>
                        {!isNewbie && (
                            <>
                                <hr />
                                <Form.Group as={Row} className="text-start m-0">
                                    <Form.Label className="p-0"><h6>Filter by Sender:</h6></Form.Label>
                                    <Form.Check
                                        type="switch"
                                        id="sentByMeSwitch"
                                        label="Only Sent by Me"
                                        checked={filterSentByMe}
                                        onChange={() => setFilterSentByMe(prev => !prev)}
                                        className="custom-switch"
                                    />
                                </Form.Group>
                                <Form.Group as={Row} className="text-start m-0">
                                    <Form.Check
                                        type="switch"
                                        id="sentToMeSwitch"
                                        label="Only Sent to Me"
                                        checked={filterSentToMe}
                                        onChange={() => setFilterSentToMe(prev => !prev)}
                                        className="custom-switch"
                                    />
                                </Form.Group>
                            </>
                        )}
                        <hr></hr>
                        <Form.Group as={Row} className="text-start m-0">
                            <Form.Label className="p-0"><h6>Filter by Resolved:</h6></Form.Label>
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
                        <Form.Group as={Row} className="text-start m-0">
                            <Form.Label className="p-0">
                                <h6>Filter by Resource Type:</h6>
                                <Select
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti
                                    options={resourceTypeOptions}
                                    value={resourceTypeOptions.filter(option => selectedResourceTypes.includes(option.value))}
                                    onChange={handleResourceTypeChange}
                                    styles={{
                                        option: (provided) => ({
                                        ...provided,
                                        color: 'black',
                                        }),
                                        multiValueLabel: (provided) => ({
                                        ...provided,
                                        color: 'black',
                                        }),
                                        singleValue: (provided) => ({
                                        ...provided,
                                        color: 'black',
                                        }),
                                    }}
                                />
                            </Form.Label>
                        </Form.Group>
                        <hr></hr>
                        <Form.Group as={Row} className="text-start m-0">
                            <Form.Label className="p-0 mb-0">
                                <h6>Feedback sent from:</h6></Form.Label>
                            <Form.Control 
                            type="date" 
                            className="mb-2"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)} 
                            />
                            <Form.Label className="p-0 mt-2 mb-0"><h6>Feedback sent to:</h6></Form.Label>
                            <Form.Control 
                            type="date" 
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)} 
                            />
                        </Form.Group>
                        <hr></hr>
                        <Form.Group as={Row} className="text-start m-0">
                        {!isNewbie && (
                            <Form.Label className="p-0 mb-0"><h6>Filter by Sender:</h6>
                            <Select
                                closeMenuOnSelect={true}
                                components={animatedComponents}
                                options={groupedOptions}
                                isClearable={true}
                                isMulti={false}
                                value={groupedOptions.flatMap(group => group.options).find(option => option.value === selectedSender)}
                                onChange={(selectedOption) => setSelectedSender(selectedOption?.value || '')}
                                styles={{
                                    option: (provided) => ({
                                        ...provided,
                                        color: 'black',
                                    }),
                                    multiValueLabel: (provided) => ({
                                        ...provided,
                                        color: 'black',
                                    }),
                                    singleValue: (provided) => ({
                                        ...provided,
                                        color: 'black',
                                    }),
                                }}
                            />
                            </Form.Label>
                        )}
                        <Form.Label className="p-0 mt-2 mb-0"><h6>Filter by Receiver:</h6>
                        <Select
                            closeMenuOnSelect={true}
                            components={animatedComponents}
                            options={groupedOptions}
                            isClearable={true}
                            isMulti={false}
                            value={groupedOptions.flatMap(group => group.options).find(option => option.value === selectedReceiver)}
                            onChange={(selectedOption) => setSelectedReceiver(selectedOption?.value || '')}
                            styles={{
                                option: (provided) => ({
                                    ...provided,
                                    color: 'black',
                                }),
                                multiValueLabel: (provided) => ({
                                    ...provided,
                                    color: 'black',
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    color: 'black',
                                }),
                            }}
                        />
                        </Form.Label>
                        </Form.Group>
                    </div>
                    <div className="col-10">
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
                                        <th onClick={() => handleSort("userSend")} style={{ cursor: "pointer" }}>
                                            Sender
                                            <i className="bi bi-arrow-down-up ms-2"></i>
                                        </th>
                                        <th onClick={() => handleSort("userReceive")} style={{ cursor: "pointer" }}>
                                            Receiver
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
                                        <th onClick={() => handleSort("isResolved")} style={{ cursor: "pointer" }}>
                                            Resolved
                                            <i className="bi bi-arrow-down-up ms-2"></i>
                                        </th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbacks.map((feedback) => (
                                        <FeedbackItem 
                                            key={feedback.id} 
                                            feedback={feedback}
                                            isNewbie={isNewbie}
                                            onInfoClick={handleInfoClick}
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
                {feedbackToDialog && (
                    <FeedbackDetailsDialog 
                        feedback={feedbackToDialog}
                        isOpen={isDetailsDialogOpen}
                        isNewbie={isNewbie}
                        onClose={() => setIsDetailsDialogOpen(false)}
                        onResolveChange={handleResolveChange}
                        onDelete={setFeedbackToDelete}
                    />
                )}
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
