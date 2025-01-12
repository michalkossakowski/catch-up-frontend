import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store.ts';
import { fetchTasks } from '../../store/taskSlice';
import { useAuth } from "../../Provider/authProvider";
import TaskList from "./TaskList.tsx";

const TaskDashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { tasksByUser, loading, error } = useSelector((state: RootState) => state.tasks);
    const { user } = useAuth();

    const userTasks = user?.id ? tasksByUser[user.id] || [] : [];

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchTasks(user.id));
        }
    }, [dispatch, user]);

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
                <TaskList tasks={userTasks} loading={loading} onTaskUpdate={() => {}} isEditMode={false}/>
            </div>
        </div>
    );
};

export default TaskDashboard;