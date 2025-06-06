import React, { useEffect, useState } from 'react';
import { getAllFullTasksByRoadMapPointId } from '../../services/taskService'; // Adjust path as needed
import { FullTaskDto } from '../../dtos/FullTaskDto';
import { Alert } from 'react-bootstrap';
import Loading from '../Loading/Loading';
import './RoadMapPointDetails.css';
import { StatusEnum } from '../../Enums/StatusEnum';
import { useNavigate } from 'react-router-dom';

interface RoadMapPointTasksProps {
    roadMapPointId: number;
    roadMapPointName: string | undefined;
    manageMode: boolean;
}

const RoadMapPointDetails: React.FC<RoadMapPointTasksProps> = ({ roadMapPointId, roadMapPointName, manageMode }) => {
    const [tasks, setTasks] = useState<FullTaskDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks(roadMapPointId);
    }, [roadMapPointId]);

    const fetchTasks = async (id: number) => {
        try {
            setLoading(true);
            const data = await getAllFullTasksByRoadMapPointId(id);
            setTasks(data);
        } catch (error: any) {
            setShowAlert(true);
            setAlertMessage('Error loading tasks: ' + (error?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const getIconClass = (status?: StatusEnum) => {
        if (status === StatusEnum.Done) {
            return 'bi bi-check-circle-fill text-success';
        } else if (status === StatusEnum.ToDo) {
            return 'bi bi-dash-circle text-muted';
        }
        return 'bi bi-hourglass-split';
    };

    const truncateDescription = (description?: string) => {
        if (!description) return 'N/A';
        return description.length > 100 ? description.substring(0, 100) + '...' : description;
    };

    return (
        <div className="tasks-container">
            {showAlert && (
                <div className="d-flex justify-content-center align-items-center m-4">
                    <Alert variant="danger">{alertMessage}</Alert>
                </div>
            )}

            {loading ? (
                <div className="loaderBox">
                    <Loading />
                </div>
            ) : (
                <>
                    <h3 className="title">
                        <i className="bi bi-list-task" /> {roadMapPointName}
                    </h3>

                    <div className="roadmappoint-tasks-list">
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <div key={task.id} onClick={() => navigate(`/tasks/${task.id}`)} className="roadmappoint-task-item">
                                    <div className="roadmappoint-task-content">
                                        <div className="d-flex justify-content-between">
                                            <h5>{task.title}</h5>
                                            <p className="text-muted">
                                                <strong>Assigned:</strong>{' '}
                                                {task.assignmentDate ? new Date(task.assignmentDate).toLocaleString() : 'N/A'} by{' '}
                                                {task.assigningName || 'N/A'}
                                            </p>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between">
                                            <p>{truncateDescription(task.description)}</p>
                                            {task.finalizationDate ? (
                                                <strong className="text-success">
                                                    Finished: {new Date(task.finalizationDate).toLocaleString()}
                                                </strong>):(
                                                <strong className='text-danger'>
                                                    Not Finished
                                                </strong>
                                                )}
                                        </div>
                                        
                                        <div className="d-flex justify-content-between">
                                            <p>
                                                Priority: {task.priority || 'N/A'}
                                            </p>
                                            <p>
                                                { task.deadline != null ? `Deadline: ${new Date(task.deadline).toLocaleString()}` : 'No deadline set'}
                                            </p>
                                        </div>

                                    </div>
                                    <div className="roadmappoint-task-icon">
                                        <i className={getIconClass(task.status)} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="d-flex justify-content-center align-items-center m-4">
                                <Alert variant="warning">
                                    <i className="bi bi-list-task" />
                                    {' '}
                                    {manageMode ? (
                                        <span>No tasks found for this Road Map point</span>
                                    ):(
                                        <span>No tasks found for this Road Map point contact your mentor</span>
                                    )}
                                  
                                </Alert>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default RoadMapPointDetails;