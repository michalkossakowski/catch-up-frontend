import React from 'react';
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
    onTaskDrop: (taskId: number, newStatus: StatusEnum) => void;
    categories?: CategoryDto[];
    materials?: MaterialDto[];
    taskContents?: TaskContentDto[];
    role: string;
    loading: boolean;
}

const statusConfig = [
    { status: StatusEnum.ToDo, title: "To Do", color: "bg-secondary" },
    { status: StatusEnum.InProgress, title: "In Progress", color: "bg-primary" },
    { status: StatusEnum.ToReview, title: "To Review", color: "bg-warning" },
    { status: StatusEnum.ReOpen, title: "Reopened", color: "bg-danger" },
    { status: StatusEnum.Done, title: "Done", color: "bg-success" }
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
                                                     loading
                                                 }) => {
    if (loading) {
        return <Loading />;
    }

    return (
        <div className="task-columns">
            <div className="row g-3">
                {statusConfig.map(({ status, title, color }) => (
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
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskColumns;