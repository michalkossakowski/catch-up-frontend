import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Button, Form, InputGroup, Container, Row, Col } from 'react-bootstrap';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { UserDto } from '../../dtos/UserDto';
import { getTaskPresetsByPreset } from '../../services/taskPresetService';
import { getAllTaskContents } from '../../services/taskContentService';
import { searchUsers } from '../../services/userService';
import { TaskDto } from '../../dtos/TaskDto';
import { assignTask } from '../../services/taskService';
import './PresetAssign.css';
import { StatusEnum } from '../../Enums/StatusEnum';
import { useAuth } from '../../Provider/authProvider';
import NotificationToast from '../Toast/NotificationToast';

const PresetAssign: React.FC = () => {
    const { presetId } = useParams<{ presetId: string }>();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<TaskContentDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchPhrase, setSearchPhrase] = useState('');
    const [users, setUsers] = useState<UserDto[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('');

    const { user } = useAuth();

    useEffect(() => {
        loadPresetTasks();
    }, [presetId]);

    const loadPresetTasks = async () => {
        if (!presetId) {
            setError('No preset ID provided');
            setToastMessage('Failed to load preset tasks');
            setToastColor('red');
            setShowToast(true);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const allTaskContents = await getAllTaskContents();
            const presetTasks = await getTaskPresetsByPreset(Number(presetId));
            
            const matchingTasks = presetTasks
                .map(pt => allTaskContents.find(tc => tc.id === pt.taskContentId))
                .filter((tc): tc is TaskContentDto => tc !== undefined);

            setTasks(matchingTasks);
            setError(null);
            
        } catch (error: any) {
            setError('Failed to load preset tasks');
            setToastMessage('Failed to load preset tasks');
            setToastColor('red');
            setShowToast(true);
            console.error('Error loading preset tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (searchPhrase.trim()) {
            try {
                const foundUsers = await searchUsers(searchPhrase);
                setUsers(foundUsers);
                
            } catch (error: any) {
                console.error('Error searching users:', error);
                setToastMessage('Error searching users');
                setToastColor('red');
                setShowToast(true);
            }
        }
    };

    const handleAssignPreset = async () => {
        if (!selectedUser || !selectedUser.id) {
            setError('Please select a valid user');
            setToastMessage('Please select a valid user');
            setToastColor('red');
            setShowToast(true);
            return;
        }

        if (!user?.id) {
            setError('User must be logged in');
            setToastMessage('User must be logged in');
            setToastColor('red');
            setShowToast(true);
            return;
        }

        try {
            setLoading(true);
            
            for (const task of tasks) {
                const now = new Date();
                const deadline = new Date();
                deadline.setDate(deadline.getDate() + 14);

                const taskDto: TaskDto = {
                    newbieId: selectedUser.id,
                    assigningId: user.id,
                    taskContentId: task.id,
                    roadMapPointId: null,
                    status: StatusEnum.ToDo,
                    assignmentDate: now.toISOString(),
                    finalizationDate: null,
                    deadline: deadline.toISOString(),
                    spendTime: 0,
                    priority: 2,
                    rate: null
                };

                await assignTask(taskDto);
            }

            setToastMessage('Tasks successfully assigned');
            setToastColor('green');
            setShowToast(true);
            
            setTimeout(() => {
                navigate('/presetmanage?success=assigned');
            }, 1500);
        } catch (error: any) {
            setError('Failed to assign preset');
            setToastMessage('Failed to assign preset');
            setToastColor('red');
            setShowToast(true);
            console.error('Error assigning preset:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="container mt-4">
            <span className="loader"></span>
        </div>;
    }

    return (
        <Container>
            <h2 className="title">Assign Preset</h2>
            <Row>
                <Col md={6}>
                    <section className='editBox'>
                        <h3>Tasks in Preset</h3>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <div className="card">
                            <ul className="list-group list-group-flush">
                                {tasks.length > 0 ? (
                                    tasks.map((task, index) => (
                                        <li key={task.id} className="list-group-item">
                                            {index + 1}. {task.title}
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item">No tasks in this preset</li>
                                )}
                            </ul>
                        </div>
                    </section>
                </Col>

                <Col md={6}>
                    <section className='editBox'>
                        <h3>Select User</h3>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Search users..."
                                value={searchPhrase}
                                onChange={(e) => setSearchPhrase(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button variant="primary" onClick={handleSearch}>
                                Search
                            </Button>
                        </InputGroup>

                        <div className="card">
                            <ul className="list-group list-group-flush">
                                {users.length > 0 ? (
                                    users.map(user => (
                                        <li 
                                            key={user.id} 
                                            className={`list-group-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                                            onClick={() => setSelectedUser(user)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {user.name} {user.surname} ({user.email})
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item">No users found</li>
                                )}
                            </ul>
                        </div>
                    </section>
                </Col>
            </Row>

            <div className="d-flex justify-content-center mt-4 mb-4">
                <Button 
                    variant="secondary" 
                    className="me-2"
                    onClick={() => navigate('/preset')}
                >
                    Cancel
                </Button>
                <Button 
                    variant="success" 
                    onClick={handleAssignPreset}
                    disabled={!selectedUser || tasks.length === 0}
                >
                    Assign Preset
                </Button>
            </div>
            
            <NotificationToast
                show={showToast}
                title="Preset Assignment"
                message={toastMessage}
                color={toastColor}
                onClose={() => setShowToast(false)}
            />
        </Container>
    );
};

export default PresetAssign; 