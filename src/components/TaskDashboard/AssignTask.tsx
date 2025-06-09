import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { TaskContentDto } from "../../dtos/TaskContentDto.ts";
import { assignTask, editTask } from "../../services/taskService.ts";
import { useAuth } from "../../Provider/authProvider.tsx";
import { FullTaskDto } from "../../dtos/FullTaskDto.ts";
import { CategoryDto } from "../../dtos/CategoryDto.ts";
import { MaterialDto } from "../../dtos/MaterialDto.ts";

interface AssignTaskProps {
    isEditMode: boolean;
    task: FullTaskDto | null;
    show: boolean;
    handleClose: () => void;
    onTaskUpdate?: (task: FullTaskDto) => void;
    selectedNewbieId?: string;
    categories?: CategoryDto[];
    materials?: MaterialDto[];
    taskContents?: TaskContentDto[];
}

function AssignTask({ isEditMode, task, show, handleClose, onTaskUpdate, selectedNewbieId, categories, materials, taskContents }: AssignTaskProps) {
    const [selectedNewbie, setSelectedNewbie] = useState<string>("");
    const [selectedTaskContent, setSelectedTaskContent] = useState<number>(0);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [deadline, setDeadline] = useState<string>("");
    const [materialsId, setMaterialsId] = useState<number | null>(null); // Changed to allow null
    const [categoryId, setCategoryId] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { user } = useAuth();
    const currentUserId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isEditMode && task) {
                    setSelectedNewbie(task.newbieId!);
                    setDeadline(task.deadline ?? "");
                    setTitle(task.title ?? "");
                    setDescription(task.description ?? "");
                    setMaterialsId(task.materialsId ?? null);
                    setCategoryId(task.categoryId ?? 1);
                }
            } catch (err) {
                setError("Failed to load data");
                console.error("Error loading data:", err);
            }
        };

        fetchData();
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUserId) {
            setError("User not authenticated");
            return;
        }

        setLoading(true);
        setError("");

        try {
            if (isEditMode && task) {
                const taskData = {
                    newbieId: selectedNewbie!,
                    assigningId: currentUserId,
                    title: title,
                    description: description,
                    materialsId: materialsId ?? undefined,
                    categoryId: categoryId,
                    deadline: deadline ? deadline : undefined,
                    status: task.status
                };
                const updatedFullTask = await editTask(taskData, task.id!, user.id!);
                if (onTaskUpdate) {
                    onTaskUpdate(updatedFullTask);
                }
            } else {
                const taskData = {
                    newbieId: selectedNewbieId!,
                    assigningId: currentUserId,
                    taskContentId: selectedTaskContent,
                    deadline: deadline ? new Date(deadline).toISOString() : null
                };
                const addedTask = await assignTask(taskData);

                const selectedTask = taskContents!.find(task => task.id === selectedTaskContent);
                if (!selectedTask) {
                    throw new Error("Selected task not found");
                }
                const addedFullTask = {
                    id: addedTask.id,
                    newbieId: addedTask.newbieId,
                    assigningId: addedTask.assigningId,
                    title: selectedTask.title!,
                    description: selectedTask.description!,
                    materialsId: selectedTask.materialsId ?? undefined,
                    categoryId: selectedTask.categoryId!,
                    deadline: deadline ? deadline : undefined,
                    status: addedTask.status
                };

                if (onTaskUpdate) {
                    onTaskUpdate(addedFullTask);
                }
            }

            handleClose();
        } catch (err) {
            setError(isEditMode ? "Failed to edit task" : "Failed to assign task");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetDeadline = () => {
        setDeadline("");
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? "Edit Task" : "Assign Task"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    {!isEditMode && (
                        <>
                            <div className="mb-3">
                                <label className="form-label">Select Task</label>
                                <select
                                    className="form-select"
                                    value={selectedTaskContent}
                                    onChange={(e) => setSelectedTaskContent(Number(e.target.value))}
                                    required
                                >
                                    <option value="">Choose a task...</option>
                                    {taskContents!.map((task) => (
                                        <option key={task.id} value={task.id}>
                                            {task.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {isEditMode && (
                        <>
                            <div className="mb-3">
                                <label className="form-label">Task Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Task Description</label>
                                <textarea
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Material (optional)</label>
                                <select
                                    className="form-select"
                                    value={materialsId ?? ""}
                                    onChange={(e) => setMaterialsId(e.target.value === "" ? null : Number(e.target.value))}
                                >
                                    <option value="">No Material</option>
                                    {materials?.map((material) => (
                                        <option key={material.id} value={material.id}>
                                            {material.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(Number(e.target.value))}
                                    required
                                >
                                    {categories?.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Deadline (optional)</label>
                        <div className="input-group">
                            <input
                                type="datetime-local"
                                className="form-control"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleResetDeadline}
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? "Saving..." : isEditMode ? "Save Changes" : "Assign Task"}
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default AssignTask;