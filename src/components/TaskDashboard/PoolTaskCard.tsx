import React, { useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { TaskContentDto } from "../../dtos/TaskContentDto.ts";

interface PoolTaskCardProps {
    task: TaskContentDto;
    categoryName: string;
    isDisabled?: boolean;
}

const PoolTaskCard: React.FC<PoolTaskCardProps> = ({ task, categoryName, isDisabled }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { id: task.id, type: 'poolTask' },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: !isDisabled
    });

    const dragRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (node && !isDisabled) {
                drag(node);
            }
        },
        [drag, isDisabled]
    );

    const truncateText = (text: string, maxLength: number) => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div
            ref={dragRef}
            className={`pool-task-card card mb-2 shadow-sm ${isDragging ? 'opacity-50' : ''} ${isDisabled ? 'opacity-50' : ''}`}
            style={{
                cursor: isDisabled ? 'not-allowed' : 'grab',
                pointerEvents: isDisabled ? 'none' : 'auto'
            }}
        >
            <div className="card-body p-2">
                <h6 className="card-title mb-1">{task.title}</h6>
                <p className="card-text text-muted small">{truncateText(task.description, 60)}</p>
                <div className="d-flex justify-content-between align-items-center">
                    <small
                        className="badge pool-task-card-catergory text-white text-truncate"
                        style={{ maxWidth: '100%' }}
                        title={categoryName}
                    >
                        {truncateText(categoryName, 40)}
                    </small>
                </div>
            </div>
        </div>
    );
};

export default PoolTaskCard;