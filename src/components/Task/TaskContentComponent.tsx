import React, { useState, useEffect } from 'react';
import './TaskContentComponent.scss';
import { Alert, Button, Form, InputGroup, Row, Col, Modal, Accordion, Pagination } from 'react-bootstrap';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { getTaskContentsWithPagination } from '../../services/taskContentService';
import { deleteTaskContent } from '../../services/taskContentService';
import TaskContentEdit from './TaskContentEdit';
import { CategoryDto } from '../../dtos/CategoryDto';
import { getCategories } from '../../services/categoryService';
import { removeTaskFromAllPresets } from '../../services/taskPresetService';
import Loading from '../Loading/Loading';
import { useNavigate } from 'react-router-dom';
import NotificationToast from '../Toast/NotificationToast';
import ConfirmModal from '../Modal/ConfirmModal';
import MaterialItem from '../MaterialManager/MaterialItem';
import { TaskContentQueryParameters } from '../../dtos/TaskContentQueryParametersDto';
import { PagedResponse } from '../../interfaces/PagedResponse';

interface TaskContentComponentProps {
    isAdmin: boolean;
}

const TaskContentComponent: React.FC<TaskContentComponentProps> = ({ isAdmin }) => {
    const [taskContentsData, setTaskContentsData] = useState<PagedResponse<TaskContentDto> | null>(null);
    const [loading, setLoading] = useState(true);
    const [showError, setShowError] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTitle, setSearchTitle] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
    const [sortOption, setSortOption] = useState<string>('title');
    const [sortDirection, setSortDirection] = useState<string>('asc');
    

    
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('');
    
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedTaskContent, setEditedTaskContent] = useState<TaskContentDto | null>(null);
    
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [taskContentIdToDelete, setTaskContentIdToDelete] = useState<number | null>(null);
    
    const navigate = useNavigate();

    const queryParams: TaskContentQueryParameters = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        titleFilter: searchTitle || undefined,
        categoryFilter: selectedCategoryId,
        sortBy: sortOption,
        sortOrder: sortDirection,
    };

    useEffect(() => {
        getCategories()
            .then((data) => setCategories(data))
            .catch((error) => console.error('Error loading categories:', error));
    }, []);

    useEffect(() => {
        fetchTaskContents();
    }, [pageNumber, pageSize, searchTitle, selectedCategoryId, sortOption, sortDirection]);

    const fetchTaskContents = async () => {
        setLoading(true);
        try {
            const data = await getTaskContentsWithPagination(queryParams);
            setTaskContentsData(data);
            setTotalPages(data.totalPages);
        } catch (error: any) {
            setShowError(true);
            setAlertMessage(error.message);
        } finally {
            setLoading(false);
        }
    };
    


    const handleSearch = () => {
        setPageNumber(1);
        fetchTaskContents();
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedCategoryId(value ? Number(value) : undefined);
        setPageNumber(1);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
        setPageNumber(1);
    };

    const toggleSortDirection = () => {
        setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
        setPageNumber(1);
    };

    const handlePageChange = (newPage: number) => {
        setPageNumber(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setPageNumber(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const initDelete = (taskContentId: number) => {
        setTaskContentIdToDelete(taskContentId);
        setConfirmMessage("Are you sure you want to delete this TaskContent?");
        setShowConfirmModal(true);
    };

    const handleDelete = async () => {
        if (taskContentIdToDelete) {
            try {
                await removeTaskFromAllPresets(taskContentIdToDelete);
                await deleteTaskContent(taskContentIdToDelete);
                fetchTaskContents();
                setToastMessage("Task content deleted successfully");
                setToastColor("green");
                setShowToast(true);
            } catch (error: any) {
                console.error('Error in deletion process:', error);
                setShowError(true);
                setAlertMessage('Error deleting TaskContent: ' + error.message);
                setToastMessage('Error deleting task content');
                setToastColor('red');
                setShowToast(true);
            }
            setTaskContentIdToDelete(null);
            setShowConfirmModal(false);
        }
    };

    const initEdit = (taskContentId: number) => {
        const foundTaskContent = taskContentsData?.items.find(content => content.id === taskContentId);
        setEditedTaskContent(foundTaskContent || null);
        setShowEditModal(true);
    };

    const handleTaskContentUpdated = (updatedTaskContent: TaskContentDto) => {
        setToastMessage(`Task content successfully ${editedTaskContent ? 'edited' : 'added'}!`);
        setToastColor("green");
        setShowToast(true);
        
        fetchTaskContents();
        setTimeout(() => {
            setShowEditModal(false);
            setEditedTaskContent(null);
        }, 50);
    };

    const getCategoryName = (categoryId: number) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category?.name || `Category ${categoryId}`;
    };

    const viewDetails = (taskContentId: number) => {
        navigate(`/taskcontent/details/${taskContentId}`);
    };



    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, pageNumber - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(
                <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
                    1
                </Pagination.Item>
            );
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === pageNumber}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
            }
            items.push(
                <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        }

        return items;
    };

    return (
        <section>
            {/* Filters and Search */}
            <div className="filter-container mb-4">
                <Row className="mb-3">
                    <Col sm={12} md={6} lg={3}>
                        <Form.Group>
                            <Form.Label>Search by title:</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter title..."
                                    value={searchTitle}
                                    onChange={(e) => setSearchTitle(e.target.value)}
                                />
                                <Button variant="primary" onClick={handleSearch}>
                                    Search
                                </Button>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    
                    <Col sm={12} md={6} lg={3}>
                        <Form.Group>
                            <Form.Label>Filter by category:</Form.Label>
                            <Form.Select
                                value={selectedCategoryId || ''}
                                onChange={handleCategoryChange}
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    
                    <Col sm={12} md={6} lg={3}>
                        <Form.Group>
                            <Form.Label>Sort by:</Form.Label>
                            <Row>
                                <Col sm={8}>
                                    <Form.Select
                                        value={sortOption}
                                        onChange={handleSortChange}
                                    >
                                        <option value="title">Title</option>
                                        <option value="category">Category</option>
                                    </Form.Select>
                                </Col>
                                <Col sm={4}>
                                    <Button 
                                        variant="outline-secondary"
                                        onClick={toggleSortDirection}
                                    >
                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>

                    <Col sm={12} md={6} lg={3}>
                        <Form.Group>
                            <Form.Label>Items per page:</Form.Label>
                            <Form.Select
                                value={pageSize}
                                onChange={handleItemsPerPageChange}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </div>

            {loading && (
                <div className='loaderBox loading'>
                    <Loading/>
                </div>
            )}

            {showError && !loading && (
                <Alert variant='danger'>
                    {alertMessage}
                </Alert>
            )}

            {!showError && !loading && taskContentsData && (
                <div className="task-content">
                    {taskContentsData.items.length === 0 ? (
                        <div className="text-center p-3">
                            <Alert variant="info">No task contents found</Alert>
                        </div>
                    ) : (
                        <>
                            <Accordion className="task-contents-accordion">
                                {taskContentsData.items.map((taskContent, index) => (
                                    <Accordion.Item 
                                        eventKey={taskContent.id.toString()} 
                                        key={taskContent.id}
                                        className="task-content-item"
                                    >
                                        <Accordion.Header className="task-content-header">
                                            <div className="d-flex justify-content-between align-items-center w-100">
                                                <div className="d-flex align-items-center flex-grow-1">
                                                    <h5 className="mb-0 me-3">
                                                        {((pageNumber - 1) * pageSize) + index + 1}. {taskContent.title}
                                                    </h5>
                                                    {taskContent.categoryId && (
                                                        <span className="badge bg-info">
                                                            {getCategoryName(taskContent.categoryId)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Accordion.Header>
                                        
                                        <Accordion.Body className="accordion-body">
                                            <label>Description:</label>
                                            <div className="task-description mb-3">
                                                <p>{taskContent.description}</p>
                                            </div>

                                            {taskContent.materialsId && (
                                                <div className="material-container task-content-materials">
                                                    <MaterialItem
                                                        materialId={taskContent.materialsId}
                                                        enableDownloadFile={true}
                                                        enableEdittingMaterialName={false}
                                                        enableAddingFile={false}
                                                        enableRemoveFile={false}
                                                    />
                                                </div>
                                            )}

                                            <div className="buttonBox justify-content-between d-flex">
                                                <Button
                                                    variant="success"
                                                    onClick={() => viewDetails(taskContent.id)}
                                                    className="me-2">
                                                    View Details
                                                </Button>
                                                
                                                {isAdmin && (
                                                    <div>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => initDelete(taskContent.id)}
                                                            className="me-2">
                                                            <i className='bi-trash' style={{color: 'white'}}></i> Delete
                                                        </Button>
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => initEdit(taskContent.id)}>
                                                            <i className='bi-pencil' style={{color: 'white'}}></i> Edit
                                                        </Button>

                                                    </div>
                                                )}
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>

                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination>
                                        <Pagination.Prev
                                            disabled={pageNumber === 1}
                                            onClick={() => handlePageChange(pageNumber - 1)}
                                        />
                                        {renderPaginationItems()}
                                        <Pagination.Next
                                            disabled={pageNumber === totalPages}
                                            onClick={() => handlePageChange(pageNumber + 1)}
                                        />
                                    </Pagination>
                                </div>
                            )}

                            <div className="text-center mt-3 text-muted">
                                Showing {((pageNumber - 1) * pageSize) + 1} to {Math.min(pageNumber * pageSize, taskContentsData.totalCount)} of {taskContentsData.totalCount} task contents
                            </div>
                        </>
                    )}
                    
                    {isAdmin && (
                        <div className="d-grid gap-2 col-6 mx-auto mt-4">
                            <Button variant="success" onClick={() => {setShowEditModal(true); setEditedTaskContent(null)}}>
                                Create new task content
                            </Button>
                        </div>
                    )}
                </div>
            )}
            
            <NotificationToast
                show={showToast}
                title="Task Content Operation"
                message={toastMessage}
                color={toastColor}
                onClose={() => setShowToast(false)}
            />
            
            <ConfirmModal 
                show={showConfirmModal} 
                title="Task Content Operation"
                message={confirmMessage}
                onConfirm={handleDelete} 
                onCancel={() => setShowConfirmModal(false)} 
            />
            
            <Modal 
                show={showEditModal} 
                onHide={() => {setShowEditModal(false); setEditedTaskContent(null)}} 
                size="lg" 
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{editedTaskContent ? 'Edit Task Content' : 'Add new Task Content'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TaskContentEdit 
                        isEditMode={!!editedTaskContent} 
                        taskContent={editedTaskContent || undefined} 
                        onTaskContentEdited={handleTaskContentUpdated}
                        categories={categories}
                        onCancel={() => {setShowEditModal(false); setEditedTaskContent(null)}}
                    />
                </Modal.Body>
            </Modal>
        </section>
    );
};

export default TaskContentComponent;
