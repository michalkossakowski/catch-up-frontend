import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../services/categoryService';
import { CategoryDto } from '../../dtos/CategoryDto';
import { Alert, Button, Container, Row, Col } from 'react-bootstrap';
import TaskContentEdit from './TaskContentEdit';
import Loading from '../Loading/Loading';
import NotificationToast from '../Toast/NotificationToast';

const TaskContentCreate: React.FC = () => {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const categoriesResult = await getCategories();
            setCategories(categoriesResult);
            setLoading(false);
        } catch (error) {
            console.error("Error loading data:", error);
            setError('Error loading data. Please try again later.');
            setLoading(false);
            setToastMessage('Error loading data');
            setToastColor('red');
            setShowToast(true);
        }
    };

    const handleTaskContentCreated = () => {
        navigate('/taskcontent');
    };

    const handleCancel = () => {
        navigate('/taskcontent');
    };

    if (loading) {
        return (
            <Container>
                <h2>Create New Task Content</h2>
                <div className="loaderBox">
                    <Loading />
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <h2>Create New Task Content</h2>
                <Alert variant="danger">{error}</Alert>
                <Button variant="secondary" onClick={handleCancel}>
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
        <Container fluid className="px-4">
            <TaskContentEdit 
                isEditMode={false} 
                onTaskContentEdited={handleTaskContentCreated} 
                categories={categories}
                formHeader={
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Create New Task Content</h2>
                        <Button variant="outline-secondary" onClick={handleCancel}>
                            Back to List
                        </Button>
                    </div>
                }
            />
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

export default TaskContentCreate; 