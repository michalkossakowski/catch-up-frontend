import React, {useCallback} from 'react';
import { useDrag } from 'react-dnd';
import { FullTaskDto } from '../../dtos/FullTaskDto';
import { FeedbackButton } from '../Feedback/FeedbackButton';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';

interface TaskCardProps {
    task: FullTaskDto;
    onEditClick: (task: FullTaskDto) => void;
    onDeleteClick: () => void;
    role: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEditClick, onDeleteClick }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { id: task.id, type: 'existingTask' },
        collect: (monitor : any) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const formatDate = (dateString?: string) => {
        if (!dateString || new Date(dateString).getFullYear() === 1970) {
            return "No deadline";
        }
        return new Date(dateString).toLocaleDateString();
    };

    const dragRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (node) {
                drag(node);
            }
        },
        [drag]
    );

    return (
        <div
            ref={dragRef}
            className={`task-card card mb-2 shadow-sm ${isDragging ? 'opacity-50' : ''}`}
            style={{ cursor: 'grab' }}
        >
            <div className="card-body p-2">
                <div className="d-flex justify-content-between align-items-start">
                    <h6
                        className="card-title mb-2"
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 'calc(100% - 40px)'
                        }}
                        title={task.title}
                    >
                        {task.title}
                    </h6>
                    <div className="dropdown">
                        <button className="btn btn-sm btn-link" type="button" data-bs-toggle="dropdown">
                            <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <button className="dropdown-item" onClick={() => onEditClick(task)}>
                                    <i className="bi bi-pencil me-2"></i>Edit
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={onDeleteClick}>
                                    <i className="bi bi-trash me-2"></i>Delete
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item">
                                    <FeedbackButton
                                        resourceId={task.id ?? 0}
                                        resourceType={ResourceTypeEnum.Task}
                                        receiverId={task.assigningId}
                                    />
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Due: {formatDate(task.deadline)}</small>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;