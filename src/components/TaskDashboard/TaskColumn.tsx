import React, { useCallback, useState } from 'react';
import { useDrop } from 'react-dnd';
import { FullTaskDto } from '../../dtos/FullTaskDto';
import { StatusEnum } from "../../Enums/StatusEnum";
import { CategoryDto } from "../../dtos/CategoryDto.ts";
import { MaterialDto } from "../../dtos/MaterialDto.ts";
import { TaskContentDto } from "../../dtos/TaskContentDto.ts";
import TaskCard from './TaskCard';
import AssignTask from "../TaskAssigment/AssignTask.tsx";

interface TaskColumnProps {
    status: StatusEnum;
    title: string;
    colorClass: string;
    tasks: FullTaskDto[];
    onTaskUpdate: (task: FullTaskDto) => void;
    onTaskDelete: (taskId: number) => void;
    onTaskDrop: (taskId: number, newStatus: StatusEnum) => void;
    categories?: CategoryDto[];
    materials?: MaterialDto[];
    taskContents?: TaskContentDto[];
    role: string;
    isDraggingPoolTask?: boolean;
    loadingTaskIds: Set<number>;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
                                                   status,
                                                   title,
                                                   colorClass,
                                                   tasks,
                                                   onTaskUpdate,
                                                   onTaskDelete,
                                                   onTaskDrop,
                                                   categories,
                                                   materials,
                                                   taskContents,
                                                   role,
                                                   isDraggingPoolTask = false,
                                                   loadingTaskIds
                                               }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<FullTaskDto | null>(null);

    const [{ isOver }, drop] = useDrop({
        accept: 'TASK',
        drop: (item: { id: number, type: string }) => {
            // Only handle existing tasks at this level
            if (item.type === 'existingTask') {
                onTaskDrop(item.id, status);
            }
            return { status };
        },
        collect: (monitor) => ({
            isOver: monitor.isOver() &&
                (monitor.getItem()?.type === 'existingTask' || !isDraggingPoolTask),
        }),
    });

    const dropRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (node) {
                drop(node);
            }
        },
        [drop]
    );

    const handleEditClick = (task: FullTaskDto) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleTaskEdit = (updatedTask: FullTaskDto) => {
        onTaskUpdate(updatedTask);
        setShowModal(false);
        setSelectedTask(null);
    };

    return (
        <div
            ref={dropRef}
            className={`task-column card ${isOver ? 'column-highlight' : ''}`}
            style={{ height: '600px' }}
        >
            <div className={`column-header ${colorClass} text-white p-2 rounded-top`}>
                <h5 className="m-0">{title}</h5>
                <span className="badge text-dark">{tasks.length}</span>
            </div>
            <div
                className="column-body p-2 rounded-bottom"
                style={{
                    height: 'calc(100% - 50px)',
                    overflowY: 'auto',
                }}
            >
                {tasks.length === 0 ? (
                    <div className="empty-column text-center text-muted py-3">
                        Drag tasks here
                    </div>
                ) : (
                    <div className="task-cards">
                        {tasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEditClick={handleEditClick}
                                onDeleteClick={() => onTaskDelete(task.id!)}
                                role={role}
                                isLoading={loadingTaskIds.has(task.id!)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <AssignTask
                    isEditMode={true}
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
        </div>
    );
};

export default TaskColumn;