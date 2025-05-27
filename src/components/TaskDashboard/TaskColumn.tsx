import React, { useCallback, useEffect, useState, useRef } from 'react';
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
    onTaskDrop: (taskId: number, newStatus: StatusEnum, itemType?: string) => void;
    categories?: CategoryDto[];
    materials?: MaterialDto[];
    taskContents?: TaskContentDto[];
    role: string;
    isDraggingPoolTask?: boolean;
    loadingTaskIds: Set<number>;
    isDisabled?: boolean;
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
                                                   loadingTaskIds,
                                                   isDisabled = false
                                               }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<FullTaskDto | null>(null);
    const [visibleTasks, setVisibleTasks] = useState<FullTaskDto[]>([]);
    const previousTasksRef = useRef<FullTaskDto[]>([]);

    useEffect(() => {
        const prevTasks = previousTasksRef.current;

        if (prevTasks.length === 0 && tasks.length > 0) {
            setVisibleTasks(tasks);
        }
        else if (tasks.length === 0 && prevTasks.length > 0) {
            setVisibleTasks([]);
        }
        // drag and drop
        else if (Math.abs(tasks.length - prevTasks.length) === 1) {
            // added or removed task check
            if (tasks.length > prevTasks.length) {
                // added
                const newTask = tasks.find(t => !prevTasks.some(pt => pt.id === t.id));
                if (newTask) {
                    setVisibleTasks(prev => [...prev, newTask]);
                }
            } else {
                // removed
                const removedTask = prevTasks.find(pt => !tasks.some(t => t.id === pt.id));
                if (removedTask) {
                    setVisibleTasks(prev => prev.filter(t => t.id !== removedTask.id));
                }
            }
        }

        else if (JSON.stringify(prevTasks) !== JSON.stringify(tasks)) {
            setVisibleTasks(tasks);
        }

        previousTasksRef.current = tasks;
    }, [tasks]);

    const [{ isOver }, drop] = useDrop({
        accept: 'TASK',
        drop: (item: { id: number, type: string }) => {
            if (item.type === 'existingTask' && !isDisabled) {
                onTaskDrop(item.id, status, item.type);
            }
            return { status };
        },
        collect: (monitor) => ({
            isOver: monitor.isOver() &&
                (monitor.getItem()?.type === 'existingTask' || !isDraggingPoolTask) &&
                !isDisabled,
        }),
        canDrop: () => !isDisabled,
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
            className={`task-column card ${isOver ? 'column-highlight' : ''} ${isDisabled ? 'disabled-column' : ''}`}
            style={{ height: '600px' }}
        >
            <div className={`column-header ${colorClass} text-white p-2 rounded-top`}>
                <h5 className="m-0">{title}</h5>
                <span className="badge text-dark">{tasks.length}</span>
                {isDisabled && role === 'Newbie' && (
                    <div className="restricted-badge">
                        <i className="bi bi-lock-fill"></i>
                    </div>
                )}
            </div>
            <div
                className={`column-body p-2 rounded-bottom ${isDisabled ? 'bg-secondary' : ''}`}
                style={{
                    height: 'calc(100% - 50px)',
                    overflowY: 'auto',
                }}
            >
                {tasks.length === 0 ? (
                    <div className="empty-column text-center text-muted py-3">
                        {isDisabled && role === 'Newbie'
                            ? "Restricted for Newbies"
                            : "Drag tasks here"}
                    </div>
                ) : (
                    <div className="task-cards">
                        {visibleTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEditClick={handleEditClick}
                                onDeleteClick={() => onTaskDelete(task.id!)}
                                role={role}
                                isLoading={loadingTaskIds.has(task.id!)}
                                isDisabled={isDisabled}
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