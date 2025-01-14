import {useEffect, useState} from "react";
import NewbieMentorService from '../../services/newbieMentorService';
import {useAuth} from "../../Provider/authProvider";
import {FullTaskDto} from "../../dtos/FullTaskDto";
import {UserAssignCountDto} from "../../dtos/UserAssignCountDto";
import TaskList from "./TaskList";
import {Button} from "react-bootstrap";
import AssignTask from "../TaskAssigment/AssignTask.tsx";
import {getCategories} from "../../services/categoryService.ts";
import materialService from "../../services/materialService.ts";
import {CategoryDto} from "../../dtos/CategoryDto.ts";
import {MaterialDto} from "../../dtos/MaterialDto.ts";
import {fetchTasks, updateTaskLocally} from "../../store/taskSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.ts";
import {TaskContentDto} from "../../dtos/TaskContentDto.ts";
import {getTaskContents} from "../../services/taskContentService.ts";
import "./TaskManager.css";

function TaskManager() {
    const { user } = useAuth();
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

    // On change of a newbie
    useEffect(() => {
        if (selectedNewbie) {
            dispatch(fetchTasks(selectedNewbie));
        }
    }, [selectedNewbie]);

    // fetches only once on mount
    useEffect(() => {
        setLocalError(null);
        const fetchData = async () => {
            try {
                const [categoriesData, materialsData, newbieList, taskContentsData] = await Promise.all([
                    getCategories(),
                    materialService.getAllMaterials(),
                    NewbieMentorService.getAssignmentsByMentor(mentorId!),
                    getTaskContents()
                ]);
                setCategories(categoriesData);
                setMaterials(materialsData);
                setNewbies(newbieList);
                setTaskContents(taskContentsData);
            } catch (err) {
                setLocalError("Unable to connect to the server. Please try again later.");
            }
        };

        fetchData();
    }, []);

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

    return (
        <div className="container">
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

            <div className="border p-3 mt-3 scrollable-container">
                {!selectedNewbie ? (
                    <p className="text-muted">Please select a newbie to view tasks.</p>
                ) : (
                    <TaskList
                        tasks={filteredTasks}
                        loading={loading}
                        onTaskUpdate={handleTaskUpdate}
                        isEditMode={true}
                        categories={categories}
                        materials={materials}
                        taskContents={taskContents}
                    />
                )}
            </div>

            {(error || localError) && (
                <div className="alert alert-danger mt-3">{error || localError}</div>
            )}
        </div>
    );
}

export default TaskManager;
