import React, {useEffect, useRef, useState} from 'react';
import { useDrop } from 'react-dnd';
import { FullTaskDto } from '../../dtos/FullTaskDto';
import { StatusEnum } from "../../Enums/StatusEnum";
import { CategoryDto } from "../../dtos/CategoryDto.ts";
import { MaterialDto } from "../../dtos/MaterialDto.ts";
import { TaskContentDto } from "../../dtos/TaskContentDto.ts";
import TaskColumn from './TaskColumn';
import Loading from "../Loading/Loading.tsx";

interface TaskColumnsProps {
    tasksByStatus: {[key in StatusEnum]: FullTaskDto[]};
    onTaskUpdate: (task: FullTaskDto) => void;
    onTaskDelete: (taskId: number) => void;
    onTaskDrop: (taskId: number, newStatus: StatusEnum, itemType?: string) => void;
    categories?: CategoryDto[];
    materials?: MaterialDto[];
    taskContents?: TaskContentDto[];
    role: string;
    loading: boolean;
    loadingTaskIds: Set<number>;
    allowedStatuses?: StatusEnum[];
    selectedNewbie?: string;
}

const statusConfig = [
    { status: StatusEnum.ToDo, title: "To Do", color: "to-do-status" },
    { status: StatusEnum.InProgress, title: "In Progress", color: "in-progress-status" },
    { status: StatusEnum.ToReview, title: "To Review", color: "review-status" },
    { status: StatusEnum.ReOpen, title: "Reopened", color: "reopened-status" },
    { status: StatusEnum.Done, title: "Done", color: "done-status" }
];

const TaskColumns: React.FC<TaskColumnsProps> = ({
                                                     tasksByStatus,
                                                     onTaskUpdate,
                                                     onTaskDelete,
                                                     onTaskDrop,
                                                     categories,
                                                     materials,
                                                     taskContents,
                                                     role,
                                                     loading,
                                                     loadingTaskIds,
                                                     allowedStatuses = [],
                                                     selectedNewbie
                                                 }) => {
    const [isDraggingPoolTask, setIsDraggingPoolTask] = useState(false);

    const dropRef = useRef(null);
    const [, drop] = useDrop({
        accept: 'TASK',
        drop: (item: { id: number, type: string }) => {
            if (item.type === 'poolTask') {
                onTaskDrop(item.id, StatusEnum.ToDo, item.type);
                return { status: StatusEnum.ToDo };
            }
        },
        hover: (item: { id: number, type: string }) => {
            if (item.type === 'poolTask') {
                setIsDraggingPoolTask(true);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver() && monitor.getItem()?.type === 'poolTask',
            isDragging: monitor.canDrop() && monitor.getItem()?.type === 'poolTask',
        }),
    }, [onTaskDrop]);

    drop(dropRef);

    // Clean up the flag when drag ends
    useEffect(() => {
        const handleDragEnd = () => {
            setIsDraggingPoolTask(false);
        };

        document.addEventListener('dragend', handleDragEnd);

        return () => {
            document.removeEventListener('dragend', handleDragEnd);
        };
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="columns-container-wrapper">
            <div
                ref={dropRef}
                className={`task-columns ${isDraggingPoolTask ? 'columns-highlight' : ''}`}
            >
                <div className="row g-3">
                    {statusConfig.map(({ status, title, color }) => {
                        const isColumnEnabled = role !== 'Newbie' || allowedStatuses.includes(status);

                        return (
                            <div key={status} className="col">
                                <TaskColumn
                                    status={status}
                                    title={title}
                                    colorClass={color}
                                    tasks={tasksByStatus[status] || []}
                                    onTaskUpdate={onTaskUpdate}
                                    onTaskDelete={onTaskDelete}
                                    onTaskDrop={onTaskDrop}
                                    categories={categories}
                                    materials={materials}
                                    taskContents={taskContents}
                                    role={role}
                                    isDraggingPoolTask={isDraggingPoolTask}
                                    loadingTaskIds={loadingTaskIds}
                                    isDisabled={!isColumnEnabled}
                                    selectedNewbie={selectedNewbie}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TaskColumns;