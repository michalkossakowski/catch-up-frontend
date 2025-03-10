import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskContents } from '../../services/taskContentService';
import { getCategories } from '../../services/categoryService';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { CategoryDto } from '../../dtos/CategoryDto';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import Material from '../Material/Material';
import Loading from '../Loading/Loading';
import './TaskContentDetails.css';

const TaskContentDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [taskContent, setTaskContent] = useState<TaskContentDto | null>(null);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setLoading(true);
            Promise.all([
                getTaskContents(),
                getCategories()
            ])
            .then(([taskContents, categoriesData]) => {
                const foundTaskContent = taskContents.find(tc => tc.id === Number(id));
                if (foundTaskContent) {
                    setTaskContent(foundTaskContent);
                    setCategories(categoriesData);
                } else {
                    setError('Task content not found');
                }
            })
            .catch(err => {
                setError('Error loading data. Please try again later.');
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }, [id]);

    const getCategoryName = (categoryId: number) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category?.name || '';
    };

    const handleBack = () => {
        navigate('/taskcontent');
    };

    const materialCreated = (materialId: number) => {
        return materialId;
    };

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
            </Container>
        );
    }

    return (
        <Container className="task-content-details mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="details-title">Task Content Details</h1>
                <Button variant="outline-success" onClick={handleBack}>
                    Back to List
                </Button>
            </div>

            <Card className="shadow-sm">
                <Card.Header className="text-white">
                    <h2>{taskContent.title}</h2>
                </Card.Header>
                <Card.Body>
                    {taskContent.categoryId && (
                        <div className="category-badge mb-4">
                            <h4 className="category-label">Category:</h4>
                            <span className="badge bg-success fs-5">
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

                    {taskContent.materialsId && (
                        <Row className="mb-3">
                            <Col>
                                <h4 className="mb-3">Additional Materials:</h4>
                                <Material 
                                    materialId={taskContent.materialsId} 
                                    showDownloadFile={true} 
                                    materialCreated={materialCreated} 
                                />
                            </Col>
                        </Row>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TaskContentDetails; 