import { FullTaskDto } from '../../dtos/FullTaskDto';
import TaskListItem from './TaskListItem';
import { Accordion, Container } from 'react-bootstrap';
import {CategoryDto} from "../../dtos/CategoryDto.ts";
import {MaterialDto} from "../../dtos/MaterialDto.ts";
import Loading from "../Loading/Loading.tsx";
import {useState} from "react";
import AssignTask from "../TaskAssigment/AssignTask.tsx";
import {TaskContentDto} from "../../dtos/TaskContentDto.ts";
import { deleteTask } from '../../services/taskService';

interface TaskListProps {
    tasks: FullTaskDto[];
    loading: boolean;
    onTaskUpdate: (task: FullTaskDto) => void;
    isEditMode: boolean;
    categories?: CategoryDto[];
    materials?: MaterialDto[];
    taskContents?: TaskContentDto[];
    onTaskDelete?: (taskId: number) => void;
}

const TaskList = ({ tasks, loading, onTaskDelete, onTaskUpdate, isEditMode, categories, materials, taskContents }: TaskListProps) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<FullTaskDto | null>(null);

    const handleEditClick = (task: FullTaskDto) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleTaskEdit = (updatedTask: FullTaskDto) => {
        onTaskUpdate(updatedTask);
        setShowModal(false);
        setSelectedTask(null);
    };

    const handleDeleteClick = async (task: FullTaskDto) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(task.id!);
                onTaskDelete?.(task.id!);
            } catch (error) {
                console.error('Failed to delete task:', error);
            }
        }
    };

    if (loading) {
        return <Loading/>;
    }

    if (tasks.length === 0) {
        return <p>No tasks assigned.</p>;
    }

    return (
        <>
            <Container>
                {tasks.map((task, index) => (
                    <TaskListItem
                        key={task.id ?? index}
                        task={task}
                        eventKey={String(index)}
                        onEditClick={handleEditClick}
                        onDeleteClick={handleDeleteClick}
                        isEditMode={isEditMode}
                    />
                ))}
            </Container>

            {isEditMode && (
                <AssignTask
                    isEditMode={isEditMode}
                    task={selectedTask}
                    show={showModal}
                    handleClose={() => {
                        setShowModal(false);
                        setSelectedTask(null);
                    }}
                    onTaskUpdate={handleTaskEdit}
                    categories={categories}
                    materials={materials}
                    taskContents={taskContents}
                />
            )}
        </>
    );
};

export default TaskList;