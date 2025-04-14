import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskContents } from '../../services/taskContentService';
import { getCategories } from '../../services/categoryService';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { CategoryDto } from '../../dtos/CategoryDto';
import { Alert, Button, Container } from 'react-bootstrap';
import TaskContentEdit from './TaskContentEdit';
import Loading from '../Loading/Loading';
import NotificationToast from '../Toast/NotificationToast';

const TaskContentEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [taskContent, setTaskContent] = useState<TaskContentDto | null>(null);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('');
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
                    setToastMessage('Task content not found');
                    setToastColor('red');
                    setShowToast(true);
                }
                setLoading(false);
            })
            .catch(err => {
                setError('Error loading data. Please try again later.');
                setToastMessage('Error loading data');
                setToastColor('red');
                setShowToast(true);
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
        <Container fluid className="px-4">
            {loading ? (
                <div>
                    <h2>Edit Task Content</h2>
                    <Loading />
                </div>
            ) : error ? (
                <div>
                    <h2>Edit Task Content</h2>
                    <Alert variant="danger">{error}</Alert>
                    <NotificationToast
                        show={showToast}
                        title="Task Content Operation"
                        message={toastMessage}
                        color={toastColor}
                        onClose={() => setShowToast(false)}
                    />
                </div>
            ) : taskContent ? (
                <>
                    <TaskContentEdit 
                        taskContent={taskContent} 
                        isEditMode={true} 
                        onTaskContentEdited={handleTaskContentUpdated} 
                        categories={categories}
                        formHeader={
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2>Edit Task Content</h2>
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
                </>
            ) : (
                <div>
                    <h2>Edit Task Content</h2>
                    <Alert variant="warning">Task content not found</Alert>
                    <NotificationToast
                        show={showToast}
                        title="Task Content Operation"
                        message={toastMessage}
                        color={toastColor}
                        onClose={() => setShowToast(false)}
                    />
                </div>
            )}

        </Container>
    );
};

export default TaskContentEditPage; 