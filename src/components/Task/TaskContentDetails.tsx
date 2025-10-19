import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllTaskContents } from '../../services/taskContentService';
import { getCategories } from '../../services/categoryService';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { CategoryDto } from '../../dtos/CategoryDto';
import { Container, Row, Col, Card, Button, Alert, Accordion } from 'react-bootstrap';
import Loading from '../Loading/Loading';
import './TaskContentDetails.css';
import materialService from '../../services/materialService';
import { MaterialDto } from '../../dtos/MaterialDto';
import NotificationToast from '../Toast/NotificationToast';
import MaterialItem from '../MaterialManager/MaterialItem';

const TaskContentDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [taskContent, setTaskContent] = useState<TaskContentDto | null>(null);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [material, setMaterial] = useState<MaterialDto | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setLoading(true);
            Promise.all([
                getAllTaskContents(),
                getCategories()
            ])
            .then(([taskContents, categoriesData]) => {
                const foundTaskContent = taskContents.find(tc => tc.id === Number(id));
                if (foundTaskContent) {
                    setTaskContent(foundTaskContent);
                    setCategories(categoriesData);
                    
                    if (foundTaskContent.materialsId) {
                        loadMaterial(foundTaskContent.materialsId);
                    }
                } else {
                    setError('Task content not found');
                    setToastMessage('Task content not found');
                    setToastColor('red');
                    setShowToast(true);
                }
            })
            .catch(err => {
                setError('Error loading data. Please try again later.');
                setToastMessage('Error loading data');
                setToastColor('red');
                setShowToast(true);
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }, [id]);
    
    const loadMaterial = async (materialId: number) => {
        try {
            const loadedMaterial = await materialService.getMaterialWithFiles(materialId);
            setMaterial(loadedMaterial);
        } catch (error) {
            console.error('Error loading material:', error);
            setToastMessage('Error loading material data');
            setToastColor('red');
            setShowToast(true);
        }
    };

    const getCategoryName = (categoryId: number) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category?.name || '';
    };

    const handleBack = () => {
        navigate('/taskcontent');
    };
    
    const handleMaterialSelect = () => {};
    const handleDeleteItem = () => {};

    if (loading) {
        return (
            <Container className="mt-4">
                <div className="text-center">
                    <Loading />
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
                <Button variant="success" onClick={handleBack}>
                    Back to List
                </Button>
                <NotificationToast
                    show={showToast}
                    title="Task Content Operation"
                    message={toastMessage}
                    color={toastColor}
                    onClose={() => setShowToast(false)}
                />
            </Container>
        );
    }

    if (!taskContent) {
        return (
            <Container className="mt-4">
                <Alert variant="warning">Task content not found</Alert>
                <Button variant="success" onClick={handleBack}>
                    Back to List
                </Button>
                <NotificationToast
                    show={showToast}
                    title="Task Content Operation"
                    message={toastMessage}
                    color={toastColor}
                    onClose={() => setShowToast(false)}
                />
            </Container>
        );
    }

    return (
        <Container className="task-content-details mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="details-title">Task Content Details</h1>
                <Button variant="primary" onClick={handleBack}>
                    Back to List
                </Button>
            </div>

            <Card className="shadow-sm">
                <Card.Header >
                    <h2>{taskContent.title}</h2>
                </Card.Header>
                <Card.Body>
                    {taskContent.categoryId && (
                        <div className="category-badge mb-4">
                            <h4 className="category-label">Category:</h4>
                            <span className="badge bg-info fs-5">
                                {getCategoryName(taskContent.categoryId)}
                            </span>
                        </div>
                    )}

                    <Row className="mb-4">
                        <Col>
                            <h4>Description:</h4>
                            <div className="description-box p-3 rounded">
                                <p className="description-text">{taskContent.description}</p>
                            </div>
                        </Col>
                    </Row>

                    {taskContent.materialsId && material && (
                        <Row className="mb-3">
                            <Col>
                                <div >
                                    <Accordion defaultActiveKey={`item${material.id}`} className="read-only-material">
                                        <MaterialItem
                                            materialId={material.id}
                                            enableDownloadFile={true}
                                        />
                                    </Accordion>
                                </div>
                            </Col>
                        </Row>
                    )}
                </Card.Body>
            </Card>
            
            <NotificationToast
                show={showToast}
                title="Task Content Operation"
                message={toastMessage}
                color={toastColor}
                onClose={() => setShowToast(false)}
            />
        </Container>
    );
};

export default TaskContentDetails; 