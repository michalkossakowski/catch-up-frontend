import React, { useState} from 'react';
import {assignTask} from "../../services/taskService"
import { TaskDto } from "../../dtos/TaskDto"

function AssignTask(){
    const [newbieId, setNewbieId] = useState<string>()
    const [taskContentId, setTaskContentId] = useState<number>()
    const [roadMapPointId, setRoadMapPointId] = useState<string>()
    const [status, setStatus] = useState<string>()
    const [deadline, setDeadline] = useState<number>()
    const [priority, setPriority] = useState<number>()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const taskDto: TaskDto = {
            NewbieId: newbieId,
            TaskContentId: taskContentId ?? 0,
            RoadMapPointId: roadMapPointId,
            Status: status ?? '',
            Deadline: deadline ?? 0,
            Priority: priority?? 0
        }
        assignTask(taskDto,taskContentId ?? 0,newbieId ?? '')
            .then(() => {
                setNewbieId('')
                setRoadMapPointId('')
                setStatus('')
                setDeadline(0)
                setPriority(0)
            })
            .catch((error: any) => {
                console.error('Error saving FAQ:', error);
            });
    }
    return(
        <section>
        <form onSubmit={handleSubmit} className="container-lg text-left">
                <div className="form-group">
                    <label htmlFor="newbieId">NewbieId:</label>
                    <input
                        type="text"
                        id="newbieId"
                        className="form-control"
                        value={newbieId}
                        onChange={(e) => setNewbieId(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="taskContentId">TaskContentId:</label>
                    <input
                        type="number"
                        id="taskContentId"
                        className="form-control"
                        value={taskContentId}
                        onChange={(e) => setTaskContentId(parseInt(e.target.value))}
                        required
                    />
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="roadMapPointId">RoadMapPointId(optional):</label>
                    <input
                        type="text"
                        id="roadMapPointId"
                        className="form-control"
                        value={roadMapPointId}
                        onChange={(e) => setRoadMapPointId(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <input
                        type="text"
                        id="status"
                        className="form-control"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="deadline">Deadline:</label>
                    <input
                        type = "number"
                        id="deadline"
                        className="form-control"
                        value={deadline}
                        onChange={(e) => setDeadline(parseInt(e.target.value))}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Priority:</label>
                    <input
                        type = "number"
                        id="priority"
                        className="form-control"
                        value={priority}
                        onChange={(e) => setPriority(parseInt(e.target.value))}
                        required
                    />
                </div>
                <br />
                <button type="submit" className="btn btn-primary">
                    Assign
                </button>
            </form>
        </section>
    )
}

export default AssignTask