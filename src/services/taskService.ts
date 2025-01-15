import axiosInstance from '../../axiosConfig'
import {TaskDto, TaskResponse} from "../dtos/TaskDto"
import { FullTaskDto } from "../dtos/FullTaskDto.ts";
import {StatusEnum} from "../Enums/StatusEnum.ts";

interface DeleteTaskResponse {
    message: string;
}

export const assignTask = async (task: TaskDto): Promise<TaskDto> => {
    try {
        const response = await axiosInstance.post<TaskResponse>('/Task/AddTaskToUser', task);
        return response.data.task;
    } catch (error: any) {
        handleError('assignTask', error);
        throw error;
    }
}

export const editTask = async (task: FullTaskDto, taskId: number, mentorId: string): Promise<FullTaskDto> => {
    try {
        const response = await axiosInstance.put<{ fullTask: FullTaskDto }>(`/Task/EditFullTask/${taskId}/${mentorId}`, task);
        return response.data.fullTask;
    } catch (error: any) {
        handleError('editTask', error);
        throw error;
    }
}

export const deleteTask = async (taskId: number): Promise<string> => {
    try {
        const response = await axiosInstance.delete<DeleteTaskResponse>(`/Task/Delete/${taskId}`);
        return response.data.message;
    } catch (error: any) {
        handleError('deleteTask', error);
        throw error;
    }
}

export const getAllFullTasksByNewbieId = async (newbieId: string): Promise<FullTaskDto[]> => {
    try {
        const response = await axiosInstance.get<FullTaskDto[]>(`/Task/GetAllFullTasksByNewbieId/${newbieId}`);
        return response.data;
    } catch (error: any) {
        handleError('getAllFullTasksByNewbieId', error);
        throw error;
    }
}

export const getAllFullTasks = async (): Promise<FullTaskDto[]> => {
    try {
        const response = await axiosInstance.get<FullTaskDto[]>('/Task/GetAllFullTasks');
        return response.data;
    } catch (error: any) {
        handleError('getAllFullTasks', error);
        throw error;
    }
}

export const setTaskStatus = async (taskId: number, status: StatusEnum): Promise<FullTaskDto> => {
    try {
        const response = await axiosInstance.patch<{ fullTask: FullTaskDto }>(`/Task/SetStatus/${taskId}/${status}`);
        return response.data.fullTask;
    } catch (error: any) {
        handleError('setTaskStatus', error);
        throw error;
    }
}

const handleError = (operation: string, error: any): void => {
    console.error(`${operation} failed:`, error);
    if (!error.response) {
        throw new Error('API is not available');
    }
    throw new Error(error.response.data?.message || 'An unexpected error occurred');
};