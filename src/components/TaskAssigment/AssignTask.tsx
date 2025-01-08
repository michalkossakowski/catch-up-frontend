import React, { useState, useEffect } from 'react';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { UserAssignCountDto } from '../../dtos/UserAssignCountDto';
import { getTaskContents } from '../../services/taskContentService';
import NewbieMentorService from '../../services/newbieMentorService';
import { assignTask } from '../../services/taskService.ts';
import { useAuth } from "../../Provider/authProvider.tsx";

function AssignTask() {
    const [newbies, setNewbies] = useState<UserAssignCountDto[]>([]);
    const [taskContents, setTaskContents] = useState<TaskContentDto[]>([]);
    const [selectedNewbie, setSelectedNewbie] = useState('');
    const [selectedTaskContent, setSelectedTaskContent] = useState<number>(0);
    const [deadline, setDeadline] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { user } = useAuth();
    const currentUserId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newbiesData, taskContentsData] = await Promise.all([
                    NewbieMentorService.getAllNewbies(),
                    getTaskContents()
                ]);
                setNewbies(newbiesData);
                setTaskContents(taskContentsData);
            } catch (err) {
                setError('Failed to load data');
                console.error('Error loading data:', err);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUserId) {
            setError('User not authenticated');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const taskData = {
                newbieId: selectedNewbie,
                assigningId: currentUserId,
                taskContentId: selectedTaskContent,
                deadline: deadline ? new Date(deadline).toISOString() : null
            };

            await assignTask(taskData);
            setSelectedNewbie('');
            setSelectedTaskContent(0);
            setDeadline('');
            alert('Task assigned successfully!');
        } catch (err) {
            setError('Failed to assign task');
            console.error('Error assigning task:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetDeadline = () => {
        setDeadline('');
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Assign Task</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Select Newbie</label>
                    <select
                        className="form-select"
                        value={selectedNewbie}
                        onChange={(e) => setSelectedNewbie(e.target.value)}
                        required
                    >
                        <option value="">Choose a newbie...</option>
                        {newbies.map((newbie) => (
                            <option key={newbie.id} value={newbie.id}>
                                {`${newbie.name} ${newbie.surname}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Select Task</label>
                    <select
                        className="form-select"
                        value={selectedTaskContent}
                        onChange={(e) => setSelectedTaskContent(Number(e.target.value))}
                        required
                    >
                        <option value="">Choose a task...</option>
                        {taskContents.map((task) => (
                            <option key={task.id} value={task.id}>
                                {task.title}
                            </option>
                        ))}
                    </select>
                </div>

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

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Assigning...' : 'Assign Task'}
                </button>
            </form>
        </div>
    );
}

export default AssignTask;