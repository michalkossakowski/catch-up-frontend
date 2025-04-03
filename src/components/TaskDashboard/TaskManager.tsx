import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "react-bootstrap";
import { useAuth } from "../../Provider/authProvider";
import { AppDispatch, RootState } from "../../store/store.ts";
import { CategoryDto } from "../../dtos/CategoryDto.ts";
import { MaterialDto } from "../../dtos/MaterialDto.ts";
import { FullTaskDto } from "../../dtos/FullTaskDto";
import { UserAssignCountDto } from "../../dtos/UserAssignCountDto";
import { TaskContentDto } from "../../dtos/TaskContentDto.ts";
import { fetchTasks, updateTaskLocally, deleteTaskLocally } from "../../store/taskSlice.ts";
import NewbieMentorService from '../../services/newbieMentorService';
import { getCategories } from "../../services/categoryService.ts";
import materialService from "../../services/materialService.ts";
import { getTaskContents } from "../../services/taskContentService.ts";
import { setTaskStatus } from "../../services/taskService";
import { StatusEnum } from "../../Enums/StatusEnum";
import TaskColumns from "./TaskColumns";
import TaskPool from "./TaskPool";
import AssignTask from "../TaskAssigment/AssignTask.tsx";
import "./TaskManager.css";

function TaskManager() {
    const { user, getRole } = useAuth();
    const mentorId = user?.id;

    const [localError, setLocalError] = useState<string | null>(null);

    const dispatch: AppDispatch = useDispatch();
    const { tasksByUser, loading, error } = useSelector((state: RootState) => state.tasks);

    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const [filteredTasks, setFilteredTasks] = useState<FullTaskDto[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedNewbie, setSelectedNewbie] = useState<string>("");
    const [showAssignModal, setShowAssignModal] = useState(false);

    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [materials, setMaterials] = useState<MaterialDto[]>([]);
    const [taskContents, setTaskContents] = useState<TaskContentDto[]>([]);
    const [newbies, setNewbies] = useState<UserAssignCountDto[]>([]);
    const [userRole, setUserRole] = useState<string | null>(null);

    // Map to store tasks by status
    const [tasksByStatus, setTasksByStatus] = useState<{[key in StatusEnum]: FullTaskDto[]}>({
        [StatusEnum.ToDo]: [] as FullTaskDto[],
        [StatusEnum.InProgress]: [] as FullTaskDto[],
        [StatusEnum.ToReview]: [] as FullTaskDto[],
        [StatusEnum.ReOpen]: [] as FullTaskDto[],
        [StatusEnum.Done]: [] as FullTaskDto[]
    });

    // On change of a newbie
    useEffect(() => {
        if (selectedNewbie) {
            dispatch(fetchTasks(selectedNewbie));
        }
    }, [selectedNewbie, dispatch]);

    // fetches only once on mount
    useEffect(() => {
        setLocalError(null);
        const fetchData = async () => {
            try {
                const role = await getRole(user?.id!);
                setUserRole(role);

                const [categoriesData, materialsData, taskContentsData] = await Promise.all([
                    getCategories(),
                    materialService.getAllMaterials(),
                    getTaskContents()
                ]);

                let newbieList;
                if (role === "Admin") {
                    newbieList = await NewbieMentorService.getAllNewbies();
                } else if (role === "Mentor") {
                    newbieList = await NewbieMentorService.getAssignmentsByMentor(mentorId!);
                } else {
                    throw new Error("Unauthorized access");
                }

                setCategories(categoriesData);
                setMaterials(materialsData);
                setNewbies(newbieList);
                setTaskContents(taskContentsData);
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

    // filter when something changes and organize by status
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

        // Organize tasks by status
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
    };

    // on task delete
    const handleTaskDelete = (taskId: number) => {
        if (selectedNewbie) {
            dispatch(deleteTaskLocally({ taskId, newbieId: selectedNewbie }));
        }
    };

    // Handle the drop of a task to a column
    const handleTaskDrop = async (taskId: number, newStatus: StatusEnum) => {
        try {
            // Check if this is a pool task by looking up taskContents
            const isPoolTask = taskContents.some(tc => tc.id === taskId);
            if (isPoolTask) {
                handlePoolTaskDrop(taskId, newStatus);
                return;
            }

            // Existing task logic
            await setTaskStatus(taskId, newStatus);
            const taskToUpdate = filteredTasks.find(task => task.id === taskId);
            if (taskToUpdate) {
                const updatedTask: FullTaskDto = {
                    ...taskToUpdate,
                    status: newStatus
                };
                dispatch(updateTaskLocally(updatedTask));
            }
        } catch (error) {
            console.error('Failed to update task status:', error);
            setLocalError('Failed to update task status. Please try again.');
        }
    };

    // Handle drag from pool to column
    const handlePoolTaskDrop = (taskContentId: number, newStatus: StatusEnum) => {
        console.log(`Handling pool task drop: ${taskContentId} to ${newStatus}`);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container-fluid task-manager-container">
                <h2>Task Manager</h2>
                <div className="row g-2 mb-3 align-items-center">
                    <div className="col-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={!selectedNewbie}
                        />
                    </div>

                    <div className="col-3">
                        <select
                            className="form-select"
                            value={selectedNewbie}
                            onChange={(e) => setSelectedNewbie(e.target.value)}
                        >
                            <option value="">None</option>
                            {newbies.map((newbie) => (
                                <option key={newbie.id} value={newbie.id}>
                                    {`${newbie.name} ${newbie.surname}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-2">
                        <select
                            className="form-select"
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

                    <div className="col-1">
                        <Button
                            className="w-100"
                            disabled={!selectedNewbie}
                            variant={selectedNewbie ? "primary" : "secondary"}
                            onClick={() => setShowAssignModal(true)}
                        >
                            Assign
                        </Button>
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
                        materials={materials}
                        taskContents={taskContents}
                    />
                )}

                {!selectedNewbie ? (
                    <div className="text-muted p-3 mt-3">
                        Please select a newbie to view tasks.
                    </div>
                ) : (
                    <div className="task-management-wrapper">
                        {/* Task Status Columns */}
                        <div className="task-columns-container">
                            <TaskColumns
                                tasksByStatus={tasksByStatus}
                                onTaskUpdate={handleTaskUpdate}
                                onTaskDelete={handleTaskDelete}
                                onTaskDrop={handleTaskDrop}
                                categories={categories}
                                materials={materials}
                                taskContents={taskContents}
                                role={userRole || ""}
                                loading={loading}
                            />
                        </div>

                        {/* Task Pool Section */}
                        <div className="task-pool-container">
                            <TaskPool
                                taskContents={taskContents}
                                categories={categories}
                                selectedCategoryId={selectedCategoryId}
                                onTaskDrop={handlePoolTaskDrop}
                            />
                        </div>
                    </div>
                )}

                {(error || localError) && (
                    <div className="alert alert-danger mt-3">{error || localError}</div>
                )}
            </div>
        </DndProvider>
    );
}

export default TaskManager;