import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAuth } from "../../Provider/authProvider";
import { AppDispatch, RootState } from "../../store/store.ts";
import { CategoryDto } from "../../dtos/CategoryDto.ts";
import { FullTaskDto } from "../../dtos/FullTaskDto";
import { UserAssignCountDto } from "../../dtos/UserAssignCountDto";
import { fetchTasks, updateTaskLocally, deleteTaskLocally } from "../../store/taskSlice.ts";
import NewbieMentorService from '../../services/newbieMentorService';
import { getCategories } from "../../services/categoryService.ts";
import {setTaskStatus, deleteTask, editTask, assignTask} from "../../services/taskService";
import { StatusEnum } from "../../Enums/StatusEnum";
import TaskColumns from "./TaskColumns";
import TaskPool from "./TaskPool";
import AssignTask from "../TaskAssigment/AssignTask.tsx";
import "./TaskManager.css";
import {TaskDto} from "../../dtos/TaskDto.ts";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import {customSelectStyles} from "../../componentStyles/selectStyles.tsx";
import { TypeEnum } from "../../Enums/TypeEnum.ts";

function TaskManager() {
    const { user, getRole } = useAuth();
    const mentorId = user?.id;

    const [localError, setLocalError] = useState<string | null>(null);
    const [loadingTaskIds, setLoadingTaskIds] = useState<Set<number>>(new Set());

    const dispatch: AppDispatch = useDispatch();
    const { tasksByUser, loading, error } = useSelector((state: RootState) => state.tasks);

    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const [filteredTasks, setFilteredTasks] = useState<FullTaskDto[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedNewbie, setSelectedNewbie] = useState<string>("");
    const [showAssignModal, setShowAssignModal] = useState(false);

    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [newbies, setNewbies] = useState<UserAssignCountDto[]>([]);
    const [userRole, setUserRole] = useState<string | null>(null);

    const location = useLocation();

    // Map to store tasks by status
    const [tasksByStatus, setTasksByStatus] = useState<{[key in StatusEnum]: FullTaskDto[]}>({
        [StatusEnum.ToDo]: [] as FullTaskDto[],
        [StatusEnum.InProgress]: [] as FullTaskDto[],
        [StatusEnum.ToReview]: [] as FullTaskDto[],
        [StatusEnum.ReOpen]: [] as FullTaskDto[],
        [StatusEnum.Done]: [] as FullTaskDto[]
    });

    useEffect(() => {
        const selectedLocalNewbie = location.state?.selectedNewbie;
        if(selectedLocalNewbie){
            setSelectedNewbie(selectedLocalNewbie);
        }
    },[]);

    // On change of a newbie
    useEffect(() => {
        if (selectedNewbie) {
            dispatch(fetchTasks(selectedNewbie));
        }
    }, [selectedNewbie, dispatch]);

    // fetches only on mount
    useEffect(() => {
        setLocalError(null);
        const fetchData = async () => {
            try {
                const role = await getRole(user?.id as string);
                setUserRole(role);

                const [categoriesData] = await Promise.all([
                    getCategories()
                ]);

                let newbieList;
                if (role === "Admin") {
                    newbieList = await NewbieMentorService.getUsers(TypeEnum.Newbie);
                } else if (role === "Mentor") {
                    newbieList = await NewbieMentorService.getAssignments(mentorId!, TypeEnum.Mentor);
                } else {
                    throw new Error("Unauthorized access");
                }

                setCategories(categoriesData);
                setNewbies(newbieList);
            } catch (err) {
                if (err instanceof Error) {
                    setLocalError(err.message);
                } else {
                    setLocalError("Unable to connect to the server. Please try again later.");
                }
            }
        };

        fetchData();
    }, [user?.id, mentorId, getRole]);

    // filter when something changes
    useEffect(() => {
        let updatedTasks = tasksByUser[selectedNewbie] || [];

        if (searchTerm.trim()) {
            updatedTasks = updatedTasks.filter((task : FullTaskDto) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategoryId !== 0) {
            updatedTasks = updatedTasks.filter((task: FullTaskDto) => task.categoryId === selectedCategoryId);
        }

        setFilteredTasks(updatedTasks);

        const newTasksByStatus = {
            [StatusEnum.ToDo]: [] as FullTaskDto[],
            [StatusEnum.InProgress]: [] as FullTaskDto[],
            [StatusEnum.ToReview]: [] as FullTaskDto[],
            [StatusEnum.ReOpen]: [] as FullTaskDto[],
            [StatusEnum.Done]: [] as FullTaskDto[]
        };

        updatedTasks.forEach(task => {
            if (task.status !== undefined && Object.values(StatusEnum).includes(task.status)) {
                newTasksByStatus[task.status as StatusEnum].push(task);
            }
        });

        setTasksByStatus(newTasksByStatus);
    }, [searchTerm, selectedNewbie, selectedCategoryId, tasksByUser]);

    // on task assign
    const handleTaskAssigned = (newTask: FullTaskDto) => {
        dispatch(updateTaskLocally(newTask));
        setShowAssignModal(false);
    };

    // on task edit
    const handleTaskUpdate = (updatedTask: FullTaskDto) => {
        dispatch(updateTaskLocally(updatedTask));
        editTask(updatedTask, updatedTask.id!, mentorId!)
    };

    // on task delete
    const handleTaskDelete = (taskId: number) => {
        if (selectedNewbie) {
            dispatch(deleteTaskLocally({ taskId, newbieId: selectedNewbie }));
            deleteTask(taskId);
        }
    };

    const handleTaskDrop = async (taskId: number, newStatus: StatusEnum, itemType?: string) => {
        const taskToUpdate = filteredTasks.find(task => task.id === taskId);
        try {
            if (!selectedNewbie) return;

            if (itemType === 'poolTask') {
                handlePoolTaskDrop(taskId, newStatus);
                return;
            }

            if (taskToUpdate) {
                const optimisticTask: FullTaskDto = {
                    ...taskToUpdate,
                    status: newStatus,
                };

                setLoadingTaskIds(prev => new Set(prev).add(taskId));
                dispatch(updateTaskLocally(optimisticTask));
            } else {
                console.warn(`Task with ID ${taskId} not found in filteredTasks`);
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

    const handlePoolTaskDrop = async (taskContentId: number, newStatus: StatusEnum) => {
        if (!selectedNewbie) return;

        const taskData : TaskDto = {
            newbieId: selectedNewbie,
            assigningId: mentorId!,
            taskContentId: taskContentId,
            deadline: null,
            status: newStatus
        };

        const addedTask : FullTaskDto = await assignTask(taskData);
        handleTaskAssigned(addedTask);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container-fluid task-manager-container">
                <h2>Task Manager</h2>


                {(error || localError) && (
                    <div className="alert alert-danger mt-3">{error || localError}</div>
                )}

                <div className="task-management-wrapper">
                    <div className="task-columns-container">
                        <div className="row mb-3 align-items-center">
                            <div className="row g-0">
                                <div className="search-bar-container">
                                    <div className="search-input">
                                        <input
                                            type="text"
                                            className="form-control rounded-0 border-end-0"
                                            placeholder="Search tasks..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            disabled={!selectedNewbie}
                                        />
                                    </div>

                                    <div className="newbie-select">
                                        <Select
                                            isClearable={true}
                                            isSearchable={true}
                                            name="newbie"
                                            options={newbies.map(newbie => ({
                                                value: newbie.id,
                                                label: `${newbie.name} ${newbie.surname}`
                                            }))}
                                            placeholder="Select a newbie"
                                            onChange={(selectedOption) => setSelectedNewbie(selectedOption?.value ?? '')}
                                            value={newbies.map(newbie => ({
                                                value: newbie.id,
                                                label: `${newbie.name} ${newbie.surname}`
                                            })).find(option => option.value === selectedNewbie) || null}
                                            styles={customSelectStyles}
                                        />
                                    </div>

                                    <div className="category-filter">
                                        <select
                                            className="form-select rounded-0 border-start-0"
                                            value={selectedCategoryId}
                                            onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                                            disabled={!selectedNewbie}
                                        >
                                            <option value={0}>All</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <TaskColumns
                            tasksByStatus={tasksByStatus}
                            onTaskUpdate={handleTaskUpdate}
                            onTaskDelete={handleTaskDelete}
                            onTaskDrop={handleTaskDrop}
                            categories={categories}
                            role={userRole || ""}
                            loading={loading}
                            loadingTaskIds={loadingTaskIds}
                            selectedNewbie={selectedNewbie}
                        />
                    </div>

                    <div className={`task-pool-container ${!selectedNewbie ? "disabled-pool" : ""}`}>
                        <TaskPool
                            categories={categories}
                            isDisabled={!selectedNewbie}
                        />
                    </div>
                </div>

                {showAssignModal && (
                    <AssignTask
                        isEditMode={false}
                        task={null}
                        show={showAssignModal}
                        handleClose={() => setShowAssignModal(false)}
                        onTaskUpdate={handleTaskAssigned}
                        selectedNewbieId={selectedNewbie}
                        categories={categories}
                    />
                )}
            </div>
        </DndProvider>
    );
}

export default TaskManager;