import axiosInstance from '../../axiosConfig';
import { TaskContentDto } from '../dtos/TaskContentDto';
import { TaskContentQueryParameters } from '../dtos/TaskContentQueryParametersDto';
import { PagedResponse } from '../interfaces/PagedResponse';

// to jest stary getContents [deprecated]
export const getAllTaskContents = async (): Promise<TaskContentDto[]> => {
    try {
        const response = await axiosInstance.get<{taskContents: TaskContentDto[], totalCount: number}>(
            `/TaskContent/GetAll/${1}/${999999}` // temp change
        );
        return response.data.taskContents;
    } catch (error: any) {
        console.error('Błąd API:', error.response);
        handleError('getTaskContents', error);
        throw error;
    }
};

// nowy getAll z paginacja - uzywac tego!
export const getTaskContents = async (page: number = 1, pageSize: number = 5): Promise<{taskContents: TaskContentDto[], totalCount: number}> => {
    try {
        const response = await axiosInstance.get<{taskContents: TaskContentDto[], totalCount: number}>(
            `/TaskContent/GetAll/${page}/${pageSize}`
        );
        return response.data;
    } catch (error: any) {
        console.error('Błąd API:', error.response);
        handleError('getTaskContents', error);
        throw error;
    }
};

export const getTaskContentsWithPagination = async (params: TaskContentQueryParameters): Promise<PagedResponse<TaskContentDto>> => {
    try {
        const queryParams = new URLSearchParams();
        
        queryParams.append('pageNumber', params.pageNumber.toString());
        queryParams.append('pageSize', params.pageSize.toString());
        
        if (params.titleFilter) {
            queryParams.append('titleFilter', params.titleFilter);
        }
        
        if (params.categoryFilter) {
            queryParams.append('categoryFilter', params.categoryFilter.toString());
        }
        
        if (params.creatorFilter) {
            queryParams.append('creatorFilter', params.creatorFilter);
        }
        
        if (params.sortBy) {
            queryParams.append('sortBy', params.sortBy);
        }
        
        if (params.sortOrder) {
            queryParams.append('sortOrder', params.sortOrder);
        }

        const response = await axiosInstance.get<PagedResponse<TaskContentDto>>(
            `/TaskContent/Get?${queryParams.toString()}`
        );
        return response.data;
    } catch (error: any) {
        console.error('Błąd API:', error.response);
        handleError('getTaskContentsWithPagination', error);
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