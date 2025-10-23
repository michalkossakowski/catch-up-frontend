
import { TaskDto } from "../dtos/TaskDto";
import { FullTaskDto } from "../dtos/FullTaskDto.ts";
import { StatusEnum } from "../Enums/StatusEnum.ts";
import { TaskFullDataDto } from '../dtos/TaskFullDataDto.ts';

let tasks: FullTaskDto[] = [
    { id: 1, newbieId: '2', assigningId: '1', roadMapPointId: '1', status: StatusEnum.InProgress, title: 'Implement login page', description: 'Create the login page UI.', categoryId: 1, newbieName: "newbieName", assigningName: "assigningName"},
    { id: 2, newbieId: '2', assigningId: '1', roadMapPointId: '2', status: StatusEnum.ToDo, title: 'Setup database', description: 'Configure the database connection.', categoryId: 2, newbieName: "newbieName", assigningName: "assigningName"},
    { id: 3, newbieId: '4', assigningId: '3', roadMapPointId: '4',  status: StatusEnum.Done, title: 'Deploy to production', description: 'Deploy the application to the production server.', categoryId: 3, newbieName: "newbieName", assigningName: "assigningName"},
];

export const assignTask = async (task: TaskDto): Promise<FullTaskDto> => {
    console.log('Mocked assignTask called with task:', task);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTask: FullTaskDto = {
        ...task,
        id: Math.max(...tasks.map(t => t.id!)) + 1,
        status: StatusEnum.ToDo,
        title: 'New Task',
        description: 'New Task Description',
        categoryId: 1,
        newbieName:"newbie",
        assigningName: "mentor"
    };
    tasks.push(newTask);
    return newTask;
}

export const editTask = async (task: FullTaskDto, taskId: number, mentorId: string): Promise<FullTaskDto> => {
    console.log(`Mocked editTask called with taskId: ${taskId}, mentorId: ${mentorId}, task:`, task);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) {
        throw new Error('Task not found');
    }
    tasks[index] = { ...task, id: taskId};
    return tasks[index];
}

export const deleteTask = async (taskId: number): Promise<string> => {
    console.log(`Mocked deleteTask called with taskId: ${taskId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
        tasks[index];
    }
    return 'Task deleted successfully';
}

export const getAllFullTasksByNewbieId = async (newbieId: string): Promise<FullTaskDto[]> => {
    console.log(`Mocked getAllFullTasksByNewbieId called with newbieId: ${newbieId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return tasks.filter(t => t.newbieId === newbieId );
}

export const getAllFullTasksByRoadMapPointId = async (roadMapPointId: string): Promise<FullTaskDto[]> => {
    console.log(`Mocked getAllFullTasksByRoadMapPointId called with roadMapPointId: ${roadMapPointId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return tasks.filter(t => t.roadMapPointId == roadMapPointId );
}

export const getAllFullTasks = async (): Promise<FullTaskDto[]> => {
    console.log('Mocked getAllFullTasks called');
    await new Promise(resolve => setTimeout(resolve, 500));
    return tasks;
}

export const setTaskStatus = async (taskId: number, status: StatusEnum): Promise<FullTaskDto> => {
    console.log(`Mocked setTaskStatus called with taskId: ${taskId}, status: ${status}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        throw new Error('Task not found');
    }
    task.status = status;
    return task;
}

export const getFullTaskById = async (taskId: number): Promise<FullTaskDto> => {
    console.log(`Mocked getFullTaskById called with taskId: ${taskId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const task = tasks.find(t => t.id === taskId );
    if (!task) {
        throw new Error('Task not found');
    }
    return task;
}

export const GetFullTaskData = async (taskId: number): Promise<TaskFullDataDto> => {
    console.log(`Mocked GetFullTaskData called with taskId: ${taskId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const task = tasks.find(t => t.id === taskId );
    if (!task) {
        throw new Error('Task not found');
    }
    // This is a simplified mock. A real implementation would gather more data.
    return { task: task, comments: [], timeLogs: [] };
}
