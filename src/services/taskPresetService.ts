import axiosInstance from '../../axiosConfig';
import { TaskPresetDto } from '../dtos/TaskPresetDto';

export const getAllTaskPresets = async (): Promise<TaskPresetDto[]> => {
    try {
        const response = await axiosInstance.get<TaskPresetDto[]>('/TaskPreset/GetAll');
        return response.data;
    } catch (error: any) {
        handleError('getAllTaskPresets', error);
        throw error;
    }
};

export const getTaskPresetById = async (taskPresetId: number): Promise<TaskPresetDto[]> => {
    try {
        const response = await axiosInstance.get<TaskPresetDto[]>(`/TaskPreset/GetById/${taskPresetId}`);
        return response.data;
    } catch (error: any) {
        handleError('getTaskPresetById', error);
        throw error;
    }
};

export const getTaskPresetsByTaskContent = async (taskContentId: number): Promise<TaskPresetDto[]> => {
    try {
        const response = await axiosInstance.get<TaskPresetDto[]>(`/TaskPreset/GetByTaskContent/${taskContentId}`);
        return response.data;
    } catch (error: any) {
        handleError('getTaskPresetsByTaskContent', error);
        throw error;
    }
};

export const addTaskPreset = async (taskPreset: TaskPresetDto): Promise<TaskPresetDto> => {
    try {
        const response = await axiosInstance.post<TaskPresetDto>('/TaskPreset/Add', taskPreset);
        return response.data;
    } catch (error: any) {
        handleError('addTaskPreset', error);
        throw error;
    }
};

export const editTaskPreset = async (taskPresetId: number, taskPreset: TaskPresetDto): Promise<void> => {
    try {
        await axiosInstance.put(`/TaskPreset/Edit/${taskPresetId}`, taskPreset);
    } catch (error: any) {
        handleError('editTaskPreset', error);
        throw error;
    }
};

export const removeTaskFromPreset = async (presetId: number, taskContentId: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/TaskPreset/RemoveTaskFromPreset/${presetId}/${taskContentId}`);
    } catch (error: any) {
        handleError('removeTaskFromPreset', error);
        throw error;
    }
};

export const removeTaskFromAllPresets = async (taskContentId: number): Promise<void> => {
    try {
        console.log('API call URL:', `/TaskPreset/RemoveTaskFromAllPresets/${taskContentId}`);
        await axiosInstance.delete(`/TaskPreset/RemoveTaskFromAllPresets/${taskContentId}`);
    } catch (error: any) {
        console.error('Error in removeTaskFromAllPresets:', error);
        if (error.response?.status === 404) {
            console.error('Endpoint not found. Please check if the API endpoint exists and is correctly configured.');
        }
        handleError('removeTaskFromAllPresets', error);
        throw error;
    }
};

export const getTaskPresetsByPreset = async (presetId: number): Promise<TaskPresetDto[]> => {
    try {
        const response = await axiosInstance.get<TaskPresetDto[]>(`/TaskPreset/GetByPreset/${presetId}`);
        return response.data;
    } catch (error) {
        handleError('getTaskPresetsByPreset', error);
        throw error;
    }
};

export const deleteByPresetId = async (presetId: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/TaskPreset/DeleteByPreset/${presetId}`);
    } catch (error: any) {
        handleError('deleteByPresetId', error);
        throw error;
    }
};

const handleError = (operation: string, error: any): void => {
    console.error(`${operation} failed:`, error);
    if (!error.response) {
        throw new Error('API is not available');
    }
    throw new Error(error.response.data?.message || 'An unexpected error occurred');
}; 