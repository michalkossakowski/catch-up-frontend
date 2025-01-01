import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axiosConfig';
import { useAuth } from "../../Provider/authProvider";
import TaskList from './TaskList';
import { FullTaskDto } from '../../dtos/FullTaskDto';

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
                <TaskList tasks={tasks} loading={loading} />
            </div>
        </div>
    );
};

export default TaskDashboard;