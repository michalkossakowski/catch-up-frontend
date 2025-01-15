import {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store.ts';
import {fetchTasks, updateTaskLocally} from '../../store/taskSlice';
import { useAuth } from "../../Provider/authProvider";
import TaskList from "./TaskList.tsx";
import {FullTaskDto} from "../../dtos/FullTaskDto.ts";

const TaskDashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { tasksByUser, loading, error } = useSelector((state: RootState) => state.tasks);
    const { user, getRole } = useAuth();
    const [userRole, setUserRole] = useState<string | null>(null);

    const userTasks = user?.id ? tasksByUser[user.id] || [] : [];

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchTasks(user.id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        const fetchRole = async () => {
            if (user?.id) {
                const role = await getRole(user.id);
                setUserRole(role);
            }
        };

        fetchRole();
    }, [user]);

    const handleTaskUpdate = (updatedTask: FullTaskDto) => {
        dispatch(updateTaskLocally(updatedTask));
    };

    if (loading || !userRole) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <div>Loading...</div>
            </div>
        );
    }

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
                <TaskList tasks={userTasks} loading={loading} onTaskUpdate={handleTaskUpdate} isEditMode={false} role={userRole!}/>
            </div>
        </div>
    );
};

export default TaskDashboard;