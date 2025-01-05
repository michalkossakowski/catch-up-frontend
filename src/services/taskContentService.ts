import axiosInstance from '../../axiosConfig';
import { TaskContentDto } from '../dtos/TaskContentDto';

export const getTaskContents = async (): Promise<TaskContentDto[]> => {
    try {
        console.log('URL:', '/TaskContent/GetAll');
        const response = await axiosInstance.get<TaskContentDto[]>('/TaskContent/GetAll');
        console.log('Odpowiedź:', response);
        return response.data;
    } catch (error: any) {
        console.error('Błąd API:', error.response);
        handleError('getTaskContents', error);
        throw error;
    }
};

export const getById = async (id: string): Promise<TaskContentDto[]> => {
    try {
        const response = await axiosInstance.get<TaskContentDto[]>('/TaskContent/GetById/'+id);
        return response.data;
    } catch (error: any) {
        handleError('getById', error);
        throw error;
    }
}

export const getByTitle = async (title: string): Promise<TaskContentDto[]> => {
    try {
        const response = await axiosInstance.get<TaskContentDto[]>('/TaskContent/GetByTitle/'+title);
        return response.data;
    } catch (error: any) {
        handleError('getByTitle', error);
        throw error;
    }
}

export const getByCreatorId = async (creatorId: string): Promise<TaskContentDto[]> => {
    try {
        const response = await axiosInstance.get<TaskContentDto[]>('/TaskContent/GetByCreatorId/'+creatorId);
        return response.data;
    } catch (error: any) {
        handleError('getByCreatorId', error);
        throw error;
    }
}

export const getByCategoryId = async (categoryId: string): Promise<TaskContentDto[]> => {
    try {
        const response = await axiosInstance.get<TaskContentDto[]>('/TaskContent/GetByCategoryId/'+categoryId);
        return response.data;
    } catch (error: any) {
        handleError('getByCategoryId', error);
        throw error;
    }
}

export const addTaskContent = async (taskContent: TaskContentDto): Promise<TaskContentDto> => {
    try {

        console.log('Current User ID:', taskContent.creatorId);

        if (!taskContent.creatorId) {
            console.error('CreatorId is not set in TaskContentDto');
            throw new Error('CreatorId is required');
        }
        
        const response = await axiosInstance.post<TaskContentDto>('/TaskContent/Add/', taskContent);
        return response.data;
    } catch (error: any) {
        handleError('addTaskContent', error);
        throw error;
    }
};

export const editTaskContent = async (taskContent: TaskContentDto): Promise<TaskContentDto> => {
    try {
        const response = await axiosInstance.put<TaskContentDto>('/TaskContent/Edit/' + taskContent.id, taskContent);
        return response.data;
    } catch (error: any) {
        handleError('editTaskContent', error);
        throw error;
    }
};

export const deleteTaskContent = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete('/TaskContent/Delete/' + id);
        return response.data;
    } catch (error: any) {
        handleError('deleteTaskContent', error);
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