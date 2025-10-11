import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppDispatch, RootState } from '../../store/store.ts';
import { fetchTasks, updateTaskLocally, deleteTaskLocally } from '../../store/taskSlice';
import { useAuth } from "../../Provider/authProvider";
import { CategoryDto } from "../../dtos/CategoryDto.ts";
import { FullTaskDto } from "../../dtos/FullTaskDto";
import { StatusEnum } from "../../Enums/StatusEnum";
import TaskColumns from "./TaskColumns";
import { getCategories } from "../../services/categoryService.ts";
import { setTaskStatus, deleteTask, editTask } from "../../services/taskService";
import "./TaskManager.css";

const allowedStatusChanges: Record<string, StatusEnum[]> = {
    'Newbie': [StatusEnum.ToDo ,StatusEnum.InProgress, StatusEnum.ToReview],
    'Mentor': [StatusEnum.ToDo, StatusEnum.InProgress, StatusEnum.ToReview, StatusEnum.ReOpen, StatusEnum.Done],
    'HR': [StatusEnum.ToDo, StatusEnum.InProgress, StatusEnum.ToReview, StatusEnum.ReOpen, StatusEnum.Done],
    'Admin': [StatusEnum.ToDo, StatusEnum.InProgress, StatusEnum.ToReview, StatusEnum.ReOpen, StatusEnum.Done]
};

const TaskDashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { tasksByUser, loading, error } = useSelector((state: RootState) => state.tasks);
    const { user, getRole } = useAuth();

    const [userRole, setUserRole] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loadingTaskIds, setLoadingTaskIds] = useState<Set<number>>(new Set());
    const [localError, setLocalError] = useState<string | null>(null);
    const [allowedStatuses, setAllowedStatuses] = useState<StatusEnum[]>([]);

    const [tasksByStatus, setTasksByStatus] = useState<{[key in StatusEnum]: FullTaskDto[]}>({
        [StatusEnum.ToDo]: [] as FullTaskDto[],
        [StatusEnum.InProgress]: [] as FullTaskDto[],
        [StatusEnum.ToReview]: [] as FullTaskDto[],
        [StatusEnum.ReOpen]: [] as FullTaskDto[],
        [StatusEnum.Done]: [] as FullTaskDto[]
    });

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchTasks(user.id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.id) {
                try {
                    const role = await getRole();
                    setUserRole(role);
                    setAllowedStatuses(allowedStatusChanges[role] || []);

                    const [categoriesData] = await Promise.all([
                        getCategories(),
                    ]);

                    setCategories(categoriesData);
                } catch (err) {
                    if (err instanceof Error) {
                        setLocalError(err.message);
                    } else {
                        setLocalError("Unable to connect to the server. Please try again later.");
                    }
                }
            }
        };

        fetchData();
    }, [user, getRole]);

    useEffect(() => {
        if (user?.id) {
            const userTasks = tasksByUser[user.id] || [];

            const newTasksByStatus = {
                [StatusEnum.ToDo]: [] as FullTaskDto[],
                [StatusEnum.InProgress]: [] as FullTaskDto[],
                [StatusEnum.ToReview]: [] as FullTaskDto[],
                [StatusEnum.ReOpen]: [] as FullTaskDto[],
                [StatusEnum.Done]: [] as FullTaskDto[]
            };

            userTasks.forEach(task => {
                if (task.status !== undefined && Object.values(StatusEnum).includes(task.status)) {
                    newTasksByStatus[task.status as StatusEnum].push(task);
                }
            });

            setTasksByStatus(newTasksByStatus);
        }
    }, [tasksByUser, user]);

    const handleTaskUpdate = (updatedTask: FullTaskDto) => {
        dispatch(updateTaskLocally(updatedTask));
        editTask(updatedTask, updatedTask.id!, user?.id!);
    };

    const handleTaskDelete = (taskId: number) => {
        if (user?.id) {
            dispatch(deleteTaskLocally({ taskId, newbieId: user.id }));
            deleteTask(taskId);
        }
    };

    const handleTaskDrop = async (taskId: number, newStatus: StatusEnum) => {
        if (!user?.id) return;

        // General restrictions for Newbies
        if (userRole === 'Newbie') {
            // Prevent dropping into ReOpen and Done columns
            if (newStatus === StatusEnum.ReOpen || newStatus === StatusEnum.Done) {
                setLocalError(`As a Newbie, you cannot move tasks to "${newStatus === StatusEnum.ReOpen ? 'Reopened' : 'Done'}" status.`);
                return;
            }

            // Make sure it's one of the allowed statuses
            if (!allowedStatuses.includes(newStatus)) {
                setLocalError(`As a Newbie, you can only move tasks to "To Do", "In Progress", or "To Review" status.`);
                return;
            }
        }

        const userTasks = tasksByUser[user.id] || [];
        const taskToUpdate = userTasks.find(task => task.id === taskId);

        try {
            if (taskToUpdate) {
                const optimisticTask: FullTaskDto = {
                    ...taskToUpdate,
                    status: newStatus,
                };

                setLoadingTaskIds(prev => new Set(prev).add(taskId));
                dispatch(updateTaskLocally(optimisticTask));
            } else {
                console.warn(`Task with ID ${taskId} not found in tasks`);
                return;
            }

            await setTaskStatus(taskId, newStatus);

            setLoadingTaskIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(taskId);
                return newSet;
            });
        } catch (error) {
            console.error('Failed to update task status:', error);
            setLocalError('Failed to update task status. Reverting change.');

            if (taskToUpdate) {
                dispatch(updateTaskLocally(taskToUpdate));
                setLoadingTaskIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(taskId);
                    return newSet;
                });
            }
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <h1 className='title'><i className='bi bi-list-check'/> My Tasks</h1>
            <div className="container-fluid task-dashboard-container">
                {(error || localError) && (
                    <div className="alert alert-danger mt-3">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error || localError}
                    </div>
                )}

                <div className="task-columns-wrapper">
                    {userRole && (
                        <TaskColumns
                            tasksByStatus={tasksByStatus}
                            onTaskUpdate={handleTaskUpdate}
                            onTaskDelete={handleTaskDelete}
                            onTaskDrop={handleTaskDrop}
                            categories={categories}
                            role={userRole}
                            loading={loading}
                            loadingTaskIds={loadingTaskIds}
                            allowedStatuses={allowedStatuses}
                        />
                    )}
                </div>
            </div>
        </DndProvider>
    );
};

export default TaskDashboard;