import { useState } from "react";
import { StatusEnum } from "../../Enums/StatusEnum";
import { Accordion } from "react-bootstrap";
import { FullTaskDto } from "../../dtos/FullTaskDto";
import AssignTask from "../TaskAssigment/AssignTask";
import {CategoryDto} from "../../dtos/CategoryDto.ts";
import {MaterialDto} from "../../dtos/MaterialDto.ts";

interface TaskListItemProps {
    task: FullTaskDto;
    eventKey: string;
    onTaskUpdate: (task: FullTaskDto) => void;
    isEditMode: boolean;
    categories?: CategoryDto[];
    materials?: MaterialDto[];
}

const TaskListItem = ({ task, eventKey, onTaskUpdate, isEditMode, categories, materials}: TaskListItemProps) => {
    const [showModal, setShowModal] = useState(false);

    const handleTaskEdit = (updatedTask: FullTaskDto) => {
        onTaskUpdate(updatedTask);
        setShowModal(false);
    };

    const getStatusInfo = (status: StatusEnum): { iconClass: string; text: string; colorClass: string } => {
        switch (status) {
            case StatusEnum.ToDo:
                return {
                    iconClass: "bi bi-journal",
                    text: "To Do",
                    colorClass: "text-secondary",
                };
            case StatusEnum.InProgress:
                return {
                    iconClass: "bi bi-journal-text",
                    text: "In Progress",
                    colorClass: "text-primary",
                };
            case StatusEnum.ToReview:
                return {
                    iconClass: "bi bi-journal-arrow-up",
                    text: "To Review",
                    colorClass: "text-warning",
                };
            case StatusEnum.ReOpen:
                return {
                    iconClass: "bi bi-journal-x",
                    text: "Reopened",
                    colorClass: "text-danger",
                };
            case StatusEnum.Done:
                return {
                    iconClass: "bi bi-journal-check",
                    text: "Done",
                    colorClass: "text-success",
                };
            default:
                return {
                    iconClass: "bi bi-journal",
                    text: "Unknown",
                    colorClass: "text-secondary",
                };
        }
    };

    const { iconClass, text, colorClass } = getStatusInfo(task.status!);

    return (
        <>
            <Accordion.Item eventKey={eventKey} className="mb-2">
                <Accordion.Header>
                    <div className="d-flex align-items-center justify-content-between w-100 pe-2">
                        <div className="h5 mb-0">{task.title}</div>
                        <div className="d-flex align-items-center gap-2">
                            {isEditMode && (
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowModal(true);
                                    }}
                                    className="btn btn-primary"
                                >
                                    Edit
                                </div>
                            )}
                            <span className="text-muted">{text}</span>
                            <i className={`${iconClass} ${colorClass} fs-4`}></i>
                        </div>
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                    <div className="task-details">
                        <p className="text-start mb-3">{task.description}</p>
                        <div className="text-end justify-content-between text-muted">
                            Deadline:{" "}
                            {task.deadline && new Date(task.deadline).getFullYear() !== 1970
                                ? new Date(task.deadline).toLocaleDateString()
                                : "X"}
                        </div>
                    </div>
                </Accordion.Body>
            </Accordion.Item>

            {isEditMode && (
                <AssignTask
                    isEditMode={isEditMode}
                    task={task}
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    onTaskUpdate={handleTaskEdit}
                    categories={categories}
                    materials={materials}
                />
            )}
        </>
    );
};

export default TaskListItem;
