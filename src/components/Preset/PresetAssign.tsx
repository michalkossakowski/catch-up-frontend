import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Button, Form, InputGroup, Container, Row, Col } from 'react-bootstrap';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { UserDto } from '../../dtos/UserDto';
import { getTaskPresetsByPreset } from '../../services/taskPresetService';
import { getTaskContents } from '../../services/taskContentService';
import { searchUsers } from '../../services/userService';
import { TaskDto } from '../../dtos/TaskDto';
import { assignTask } from '../../services/taskService';
import './PresetAssign.css';
import { StatusEnum } from '../../Enums/StatusEnum';
import { useAuth } from '../../Provider/authProvider';

const PresetAssign: React.FC = () => {
    const { presetId } = useParams<{ presetId: string }>();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<TaskContentDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchPhrase, setSearchPhrase] = useState('');
    const [users, setUsers] = useState<UserDto[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

    const { user } = useAuth();

    useEffect(() => {
        loadPresetTasks();
    }, [presetId]);

    const loadPresetTasks = async () => {
        if (!presetId) {
            setError('No preset ID provided');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const allTaskContents = await getTaskContents();
            const presetTasks = await getTaskPresetsByPreset(Number(presetId));
            
            const matchingTasks = presetTasks
                .map(pt => allTaskContents.find(tc => tc.id === pt.taskContentId))
                .filter((tc): tc is TaskContentDto => tc !== undefined);

            setTasks(matchingTasks);
            setError(null);
        } catch (error) {
            setError('Failed to load preset tasks');
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
            } catch (error) {
                console.error('Error searching users:', error);
            }
        }
    };

    const handleAssignPreset = async () => {
        if (!selectedUser) {
            setError('Please select a user');
            return;
        }

        try {
            setLoading(true);
            
            for (const task of tasks) {
                const now = new Date();
                const deadline = new Date();
                deadline.setDate(deadline.getDate() + 14);

                const taskDto: TaskDto = {
                    NewbieId: selectedUser.id,
                    AssigningId: user?.id,
                    TaskContentId: task.id,
                    RoadMapPointId: undefined,
                    Status: StatusEnum.ToDo,
                    AssignmentDate: now.toISOString(),
                    FinalizationDate: undefined,
                    Deadline: deadline.toISOString(),
                    SpendTime: 0,
                    Priority: 2,
                    Rate: undefined
                };

                await assignTask(taskDto);
            }

            navigate('/presetmanage?success=assigned');
        } catch (error) {
            setError('Failed to assign preset');
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
                                {tasks.map((task, index) => (
                                    <li key={task.id} className="list-group-item">
                                        {index + 1}. {task.title}
                                    </li>
                                ))}
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
                                {users.map(user => (
                                    <li 
                                        key={user.id} 
                                        className={`list-group-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                                        onClick={() => setSelectedUser(user)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {user.name} {user.surname} ({user.email})
                                    </li>
                                ))}
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
        </Container>
    );
};

export default PresetAssign; 