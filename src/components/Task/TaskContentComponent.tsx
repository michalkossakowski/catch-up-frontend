import React, { useState, useEffect } from 'react';
import './TaskContentComponent.css';
import { Accordion, Alert, Button, Form, InputGroup, Row, Col, Modal } from 'react-bootstrap';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { getTaskContents, getByTitle, deleteTaskContent } from '../../services/taskContentService';
import Material from '../Material/Material';
import TaskContentEdit from './TaskContentEdit';
import { CategoryDto } from '../../dtos/CategoryDto';
import { getCategories } from '../../services/categoryService';
import { removeTaskFromAllPresets } from '../../services/taskPresetService';
import Loading from '../Loading/Loading';
import { useNavigate } from 'react-router-dom';
import { MaterialDto } from '../../dtos/MaterialDto';
import materialService from '../../services/materialService';
import MaterialItem from '../Material/DndMaterial/MaterialItem';
import styles from '../Material/Material.module.css';
import NotificationToast from '../Toast/NotificationToast';
import ConfirmModal from '../Modal/ConfirmModal';

interface TaskContentComponentProps {
    isAdmin: boolean;
}

const TaskContentComponent: React.FC<TaskContentComponentProps> = ({ isAdmin }) => {
    const [taskContents, setTaskContents] = useState<TaskContentDto[]>([]);
    const [filteredTaskContents, setFilteredTaskContents] = useState<TaskContentDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showError, setShowError] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showSearchMessage, setShowSearchMessage] = useState(false);
    const [searchMessage, setSearchMessage] = useState('alert');
    const [searchTitle, setSearchTitle] = useState('');
    let i = 1;
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('title');
    const [sortDirection, setSortDirection] = useState<string>('asc');
    const [expandedMaterials, setExpandedMaterials] = useState<{[key: number]: MaterialDto}>({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('');
    
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedTaskContent, setEditedTaskContent] = useState<TaskContentDto | null>(null);
    
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [taskContentIdToDelete, setTaskContentIdToDelete] = useState<number | null>(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        getAllTaskContents();
        getCategories()
            .then((data) => setCategories(data))
            .catch((error) => console.error('Error loading categories:', error));
    }, []);

    useEffect(() => {
        filterTaskContents();
    }, [taskContents, searchTitle, selectedCategoryId, sortOption, sortDirection]);

    const getAllTaskContents = () => {
        setLoading(true);
        getTaskContents()
            .then((data) => {
                setTaskContents(data);
                setFilteredTaskContents(data);
                setShowSearchMessage(false);
                
                data.forEach(content => {
                    if (content.materialsId) {
                        loadMaterial(content.materialsId);
                    }
                });
            })
            .catch((error) => {
                setShowError(true);
                setAlertMessage(error.message);
            })
            .finally(() => setLoading(false));
    }
    
    const loadMaterial = async (materialId: number) => {
        try {
            const material = await materialService.getMaterialWithFiles(materialId);
            setExpandedMaterials(prev => ({
                ...prev,
                [materialId]: material
            }));
        } catch (error) {
            console.error('Error loading material:', error);
        }
    }

    const filterTaskContents = () => {
        let filtered = taskContents;
        
        // Filter by title
        if (searchTitle) {
            filtered = filtered.filter(content => 
                content.title.toLowerCase().includes(searchTitle.toLowerCase())
            );
        }
        
        // Filter by category
        if (selectedCategoryId && Number(selectedCategoryId)) {
            filtered = filtered.filter(content => 
                content.categoryId === Number(selectedCategoryId)
            );
        }
        
        // Sort
        if (sortOption) {
            filtered = [...filtered].sort((a, b) => {
                const direction = sortDirection === 'asc' ? 1 : -1;
                switch (sortOption) {
                    case 'title':
                        return direction * (a.title || '').localeCompare(b.title || '');
                    case 'category':
                        const catA = categories.find(cat => cat.id === a.categoryId)?.name || '';
                        const catB = categories.find(cat => cat.id === b.categoryId)?.name || '';
                        return direction * catA.localeCompare(catB);
                    default:
                        return 0;
                }
            });
        }
        
        setFilteredTaskContents(filtered);
    }

    const searchTaskContents = () => {
        filterTaskContents();
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
                getAllTaskContents();
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
        const foundTaskContent = filteredTaskContents.find(content => content.id === taskContentId);
        setEditedTaskContent(foundTaskContent || null);
        setShowEditModal(true);
    };

    const handleTaskContentUpdated = (updatedTaskContent: TaskContentDto) => {
        setToastMessage(`Task content successfully ${editedTaskContent ? 'edited' : 'added'}!`);
        setToastColor("green");
        setShowToast(true);
        
        getAllTaskContents();
        setShowEditModal(false);
        setEditedTaskContent(null);
    };

    const getCategoryName = (categoryId: number) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category?.name || categoryId;
    };

    const viewDetails = (taskContentId: number) => {
        navigate(`/taskcontent/details/${taskContentId}`);
    };

    const toggleSortDirection = () => {
        setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
    };
    
    const handleMaterialSelect = () => {};
    const handleDeleteItem = () => {};

    return (
        <section className='container'>
            <h2 className='title'>Task Contents</h2>

            {/* Filters and Search */}
            <div className="filter-container">
                <Row className="mb-3">
                    <Col sm={12} md={6} lg={4}>
                        <Form.Group>
                            <Form.Label>Search by title:</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter title..."
                                    value={searchTitle}
                                    onChange={(e) => setSearchTitle(e.target.value)}
                                />
                                <Button variant="primary" onClick={searchTaskContents}>
                                    Search
                                </Button>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    
                    <Col sm={12} md={6} lg={4}>
                        <Form.Group>
                            <Form.Label>Filter by category:</Form.Label>
                            <Form.Select
                                value={selectedCategoryId}
                                onChange={(e) => setSelectedCategoryId(e.target.value)}
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
                    
                    <Col sm={12} md={6} lg={4}>
                        <Form.Group>
                            <Form.Label>Sort by:</Form.Label>
                            <Row>
                                <Col sm={8}>
                                    <Form.Select
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
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
                </Row>
            </div>

            {loading && (
                <div className='loaderBox loading'>
                    <Loading/>
                </div>
            )}

            {showSearchMessage && !loading && (
                <Alert variant='warning'>
                    {searchMessage}
                </Alert>
            )}

            {showError && !loading && (
                <Alert variant='danger'>
                    {alertMessage}
                </Alert>
            )}

            {!showSearchMessage && !showError && !loading && (
                <div>
                    <Accordion className='AccordionItem text-start mt-3 mb-3'>
                        {filteredTaskContents.length === 0 ? (
                            <div className="text-center p-3">
                                <p>No task contents found</p>
                            </div>
                        ) : (
                            filteredTaskContents.map((taskContent) => (
                                <Accordion.Item eventKey={taskContent.id.toString()} key={taskContent.id}>
                                    <Accordion.Header>
                                        <strong>{i++}. {taskContent.title}</strong>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {taskContent.categoryId && (
                                            <p className="fs-5 mb-3 task-category">
                                                <span className="badge bg-info">
                                                    {getCategoryName(taskContent.categoryId)}
                                                </span>
                                            </p>
                                        )}

                                        <p className="task-description">{taskContent.description}</p>

                                        {taskContent.materialsId && expandedMaterials[taskContent.materialsId] && (
                                            <div className="material-container mt-4 mb-4">
                                                <h5>Additional Materials:</h5>
                                                <div className="material-content">
                                                    <Accordion defaultActiveKey={`item${taskContent.materialsId}`} className="read-only-material">
                                                        <MaterialItem
                                                            materialDto={expandedMaterials[taskContent.materialsId]}
                                                            onDeleteItem={handleDeleteItem}
                                                            onMaterialSelect={handleMaterialSelect}
                                                            readOnly={true}
                                                        />
                                                    </Accordion>
                                                </div>
                                            </div>
                                        )}

                                        <div className='buttonBox d-flex justify-content-between mt-4'>
                                            <Button
                                                variant="success"
                                                onClick={() => viewDetails(taskContent.id)}>
                                                View Details
                                            </Button>
                                            
                                            {isAdmin && (
                                                <div className="admin-buttons">
                                                    <Button
                                                        variant="outline-success"
                                                        onClick={() => initEdit(taskContent.id)}
                                                        className="me-2">
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => initDelete(taskContent.id)}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))
                        )}
                    </Accordion>
                    
                    {isAdmin && (
                        <div className="d-grid gap-2 col-6 mx-auto">
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
