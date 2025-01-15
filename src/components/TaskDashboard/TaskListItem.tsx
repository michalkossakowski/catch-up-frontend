import { StatusEnum } from "../../Enums/StatusEnum";
import { Card, Form } from "react-bootstrap";
import { FullTaskDto } from "../../dtos/FullTaskDto";
import { setTaskStatus } from "../../services/taskService";
import { FeedbackButton } from '../Feedback/FeedbackButton';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';

interface TaskListItemProps {
    task: FullTaskDto;
    onEditClick: (task: FullTaskDto) => void;
    onDeleteClick: (task: FullTaskDto) => void;
    onStatusChange: (task: FullTaskDto) => void;
    isEditMode: boolean;
    role: string;
}

const TaskListItem = ({ task, onEditClick, onDeleteClick, isEditMode, onStatusChange, role }: TaskListItemProps) => {
    const getStatusInfo = (status: StatusEnum): { iconClass: string; colorClass: string } => {
        switch (status) {
            case StatusEnum.ToDo:
                return {
                    iconClass: "bi bi-journal",
                    colorClass: "text-secondary",
                };
            case StatusEnum.InProgress:
                return {
                    iconClass: "bi bi-journal-text",
                    colorClass: "text-primary",
                };
            case StatusEnum.ToReview:
                return {
                    iconClass: "bi bi-journal-arrow-up",
                    colorClass: "text-warning",
                };
            case StatusEnum.ReOpen:
                return {
                    iconClass: "bi bi-journal-x",
                    colorClass: "text-danger",
                };
            case StatusEnum.Done:
                return {
                    iconClass: "bi bi-journal-check",
                    colorClass: "text-success",
                };
            default:
                return {
                    iconClass: "bi bi-journal",
                    colorClass: "text-secondary",
                };
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            const statusEnum = parseInt(newStatus) as StatusEnum;
            await setTaskStatus(task.id!, statusEnum);

            const updatedTask: FullTaskDto = {
                ...task,
                status: statusEnum
            };

            onStatusChange(updatedTask);
        } catch (error) {
            console.error('Failed to update task status:', error);
        }
    };

    const { iconClass, colorClass } = getStatusInfo(task.status!);

    return (
        <Card className="mb-3">
            <Card.Header className="d-flex align-items-center justify-content-between">
                <div className="h5 mb-0">{task.title}</div>
                <div className="d-flex align-items-center gap-2">
                    {isEditMode && (
                        <>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditClick(task);
                                }}
                                className="btn btn-primary"
                            >
                                Edit
                            </div>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteClick(task);
                                }}
                                className="btn btn-danger"
                            >
                                Delete
                            </div>
                        </>
                    )}
                    <FeedbackButton resourceId={task.id ?? 0} resourceType={ResourceTypeEnum.Task} />
                    <Form.Select
                        value={task.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-auto"
                    >

                        <option value={StatusEnum.ToDo}>To Do</option>
                        <option value={StatusEnum.InProgress}>In Progress</option>
                        <option value={StatusEnum.ToReview}>To Review</option>
                        {role !== "Newbie" && (
                            <>
                                <option value={StatusEnum.ReOpen}>Reopened</option>
                                <option value={StatusEnum.Done}>Done</option>
                            </>
                        )}
                    </Form.Select>
                    <i className={`${iconClass} ${colorClass} fs-4`}></i>
                </div>
            </Card.Header>
            <Card.Body>
                <div className="task-details">
                    <p className="text-start mb-3">{task.description}</p>
                    <div className="text-end text-muted">
                        Deadline:{" "}
                        {task.deadline && new Date(task.deadline).getFullYear() !== 1970
                            ? new Date(task.deadline).toLocaleDateString()
                            : "X"}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default TaskListItem;