import { FullTaskDto } from '../../dtos/FullTaskDto';
import TaskListItem from './TaskListItem';
import { Accordion } from 'react-bootstrap';

interface TaskListProps {
    tasks: FullTaskDto[];
    loading: boolean;
}

const TaskList = ({ tasks, loading }: TaskListProps) => {
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
                />
            ))}
        </Accordion>
    );
};

export default TaskList;