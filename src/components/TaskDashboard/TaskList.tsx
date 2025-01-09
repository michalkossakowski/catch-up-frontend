import { FullTaskDto } from '../../dtos/FullTaskDto';
import TaskListItem from './TaskListItem';
import { Accordion } from 'react-bootstrap';
import {CategoryDto} from "../../dtos/CategoryDto.ts";
import {MaterialDto} from "../../dtos/MaterialDto.ts";

interface TaskListProps {
    tasks: FullTaskDto[];
    loading: boolean;
    onTaskUpdate: (task: FullTaskDto) => void;
    isEditMode: boolean;
    categories?: CategoryDto[];
    materials?: MaterialDto[];
}

const TaskList = ({ tasks, loading, onTaskUpdate, isEditMode, categories, materials }: TaskListProps) => {
    if (loading) {
        return <p>Loading tasks...</p>;
    }

    if (tasks.length === 0) {
        return <p>No tasks assigned.</p>;
    }

    return (
        <Accordion alwaysOpen className="mt-3">
            {tasks.map((task, index) => (
                <TaskListItem
                    key={task.id ?? index}
                    task={task}
                    eventKey={String(index)}
                    onTaskUpdate={onTaskUpdate}
                    isEditMode={isEditMode}
                    categories={categories}
                    materials={materials}
                />
            ))}
        </Accordion>
    );
};

export default TaskList;