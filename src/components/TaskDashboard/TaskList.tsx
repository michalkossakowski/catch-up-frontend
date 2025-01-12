import { FullTaskDto } from '../../dtos/FullTaskDto';
import TaskListItem from './TaskListItem';
import { Accordion } from 'react-bootstrap';
import {CategoryDto} from "../../dtos/CategoryDto.ts";
import {MaterialDto} from "../../dtos/MaterialDto.ts";
import Loading from "../Loading/Loading.tsx";
import {useState} from "react";
import AssignTask from "../TaskAssigment/AssignTask.tsx";
import {TaskContentDto} from "../../dtos/TaskContentDto.ts";

interface TaskListProps {
    tasks: FullTaskDto[];
    loading: boolean;
    onTaskUpdate: (task: FullTaskDto) => void;
    isEditMode: boolean;
    categories?: CategoryDto[];
    materials?: MaterialDto[];
    taskContents?: TaskContentDto[];
}

const TaskList = ({ tasks, loading, onTaskUpdate, isEditMode, categories, materials, taskContents }: TaskListProps) => {
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

    if (loading) {
        return <Loading/>;
    }

    if (tasks.length === 0) {
        return <p>No tasks assigned.</p>;
    }

    return (
        <>
            <Accordion alwaysOpen className="mt-3">
                {tasks.map((task, index) => (
                    <TaskListItem
                        key={task.id ?? index}
                        task={task}
                        eventKey={String(index)}
                        onEditClick={handleEditClick}
                        isEditMode={isEditMode}
                    />
                ))}
            </Accordion>

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