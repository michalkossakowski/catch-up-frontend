import axiosInstance from '../../axiosConfig'
import {TaskDto, TaskResponse} from "../dtos/TaskDto"
import { FullTaskDto } from "../dtos/FullTaskDto.ts";
import {StatusEnum} from "../Enums/StatusEnum.ts";
import { TaskFullDataDto } from '../dtos/TaskFullDataDto.ts';

interface DeleteTaskResponse {
    message: string;
}

export const assignTask = async (task: TaskDto): Promise<FullTaskDto> => {
    try {
        const response = await axiosInstance.post<TaskResponse>('/Task/AddTaskToUser', task);
        return response.data.fullTask;
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
export const getAllFullTasksByRoadMapPointId = async (roadMapPointId: number): Promise<FullTaskDto[]> => {
    try {
        const response = await axiosInstance.get<FullTaskDto[]>(`/Task/GetAllFullTasksByRoadMapPointId/${roadMapPointId}`);
        return response.data;
    } catch (error: any) {
        handleError('getAllFullTasksByRoadMapPointId', error);
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

export const getFullTaskById = async (taskId: number): Promise<FullTaskDto> => {
    try {
        const response = await axiosInstance.get<FullTaskDto>(`/Task/GetFullTaskById/${taskId}`);
        return response.data;
    } catch (error: any) {
        handleError('getFullTaskById', error);
        throw error;
    }
}

export const GetFullTaskData = async (taskId: number): Promise<TaskFullDataDto> => {
    try{
        const response = await axiosInstance.get<TaskFullDataDto>(`/Task/GetFullTaskData/${taskId}`);
        return response.data;
    }catch (error: any) {
        handleError('getFullTaskById', error);
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