import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axiosConfig';
import { useAuth} from "../../Provider/authProvider.tsx";
import { StatusEnum } from '../../Enums/StatusEnum';
import { useAuth } from "../../Provider/authProvider";
import TaskList from './TaskList';
import { FullTaskDto } from '../../dtos/FullTaskDto';

interface Task {
    id: number;
    newbieId: string;
    materialsId: number;
    categoryId: number;
    title: string;
    description: string;
    roadMapPointId: null | number;
    status: string;
    assignmentDate: string;
    finalizationDate: string | null;
    deadline: number;
    spendTime: number;
    priority: number;
    rate: null | number;
}

const getStatusName = (status: StatusEnum): string => {
    return StatusEnum[status];
};

const TaskDashboard: React.FC = () => {
    const [tasks, setTasks] = useState<FullTaskDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);
                const response = await axiosInstance.get<FullTaskDto[]>(`/Task/GetAllFullTasksByNewbieId/${user.id}`);
                setTasks(response.data);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                setError(errorMessage);
                console.error('Error fetching tasks:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user]);

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                {error}
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="container">
                <h1 className="text-center mb-4">My Tasks</h1>
                {tasks.length === 0 ? (
                    <p className="text-center">No tasks found</p>
                ) : (
                    <div className="row g-3">
                        {tasks.map((task) => (
                            <div key={task.id} className="col-12">
                                <div className="card bg-dark text-white">
                                    <div className="card-body">
                                        <h4 className="card-title">{task.title}</h4>
                                        <p className="card-text">{task.description}</p>
                                        <div className="d-flex justify-content-between">
                                            <small>Status: {getStatusName(Number(task.status) as StatusEnum)}</small>
                                            <small>Priority: {task.priority}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDashboard;