import React, { useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { Dropdown } from 'react-bootstrap';
import { FullTaskDto } from '../../dtos/FullTaskDto';
import { FeedbackButton } from '../Feedback/FeedbackButton';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';

interface TaskCardProps {
    task: FullTaskDto;
    onEditClick: (task: FullTaskDto) => void;
    onDeleteClick: () => void;
    role: string;
    categoryName?: string; // Add categoryName prop
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEditClick, onDeleteClick, categoryName }) => {
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

    // Truncate category name if it's too long
    const truncateText = (text: string, maxLength: number) => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

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
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="link" size="sm" id={`dropdown-${task.id}`} className="btn-sm p-0">
                            <i className="bi bi-three-dots-vertical"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => onEditClick(task)}>
                                <i className="bi bi-pencil me-2"></i>Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={onDeleteClick}>
                                <i className="bi bi-trash me-2"></i>Delete
                            </Dropdown.Item>
                            <Dropdown.Item as="div">
                                <FeedbackButton
                                    resourceId={task.id ?? 0}
                                    resourceType={ResourceTypeEnum.Task}
                                    receiverId={task.assigningId}
                                />
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Due: {formatDate(task.deadline)}</small>
                    {categoryName && (
                        <small
                            className="badge bg-info text-white text-truncate"
                            style={{ maxWidth: '120px' }}
                            title={categoryName}  // Full name on hover
                        >
                            {truncateText(categoryName, 15)}
                        </small>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;