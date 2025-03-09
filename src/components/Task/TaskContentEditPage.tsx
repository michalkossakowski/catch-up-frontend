import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskContents } from '../../services/taskContentService';
import { getCategories } from '../../services/categoryService';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { CategoryDto } from '../../dtos/CategoryDto';
import { Alert, Button, Container } from 'react-bootstrap';
import TaskContentEdit from './TaskContentEdit';
import Loading from '../Loading/Loading';

const TaskContentEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [taskContent, setTaskContent] = useState<TaskContentDto | null>(null);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
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
                setLoading(false);
            })
            .catch(err => {
                setError('Error loading data. Please try again later.');
                setLoading(false);
            });
        }
    }, [id]);

    const handleTaskContentUpdated = () => {
        navigate('/taskcontent');
    };

    const handleCancel = () => {
        navigate('/taskcontent');
    };

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Edit Task Content</h2>
                <Button variant="outline-secondary" onClick={handleCancel}>
                    Back to List
                </Button>
            </div>

            {loading ? (
                <Loading />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : taskContent ? (
                <TaskContentEdit 
                    taskContent={taskContent} 
                    isEditMode={true} 
                    onTaskContentEdited={handleTaskContentUpdated} 
                    categories={categories} 
                />
            ) : (
                <Alert variant="warning">Task content not found</Alert>
            )}
        </Container>
    );
};

export default TaskContentEditPage; 