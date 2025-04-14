import axiosInstance from '../../axiosConfig';
import { PresetDto } from '../dtos/PresetDto';

interface PresetResponse {
    message: string;
    preset: PresetDto;
}

export const getPresets = async (): Promise<PresetDto[]> => {
    try {
        const response = await axiosInstance.get<PresetDto[]>('/Preset/GetAll');
        return response.data;
    } catch (error: any) {
        handleError('getPresets', error);
        throw error;
    }
};

export const getPresetById = async (id: number): Promise<PresetDto> => {
    try {
        const response = await axiosInstance.get<PresetDto>(`/Preset/GetById/${id}`);
        return response.data;
    } catch (error: any) {
        handleError('getPresetById', error);
        throw error;
    }
};

export const getPresetsByCreatorId = async (creatorId: string): Promise<PresetDto[]> => {
    try {
        const response = await axiosInstance.get<PresetDto[]>(`/Preset/GetByCreatorId/${creatorId}`);
        return response.data;
    } catch (error: any) {
        handleError('getPresetsByCreatorId', error);
        throw error;
    }
};

export const getPresetsByName = async (name: string): Promise<PresetDto[]> => {
    try {
        const response = await axiosInstance.get<PresetDto[]>(`/Preset/GetByName/${name}`);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        handleError('getPresetsByName', error);
        throw error;
    }
};

export const getPresetsByTaskContent = async (taskContentId: number): Promise<PresetDto[]> => {
    try {
        const response = await axiosInstance.get<PresetDto[]>(`/Preset/GetByTaskContent/${taskContentId}`);
        return response.data;
    } catch (error: any) {
        handleError('getPresetsByTaskContent', error);
        throw error;
    }
};

export const searchPresets = async (searchString: string): Promise<PresetDto[]> => {
    try {
        const response = await axiosInstance.get<PresetDto[]>(`/Preset/SearchPresets/${searchString}`);
        return response.data;
    } catch (error: any) {
        handleError('searchPresets', error);
        throw error;
    }
};

export const addPreset = async (preset: PresetDto): Promise<PresetDto> => {
    try {
        const response = await axiosInstance.post<PresetResponse>('/Preset/Add', preset);
        return response.data.preset;
    } catch (error: any) {
        handleError('addPreset', error);
        throw error;
    }
};

export const editPreset = async (preset: PresetDto): Promise<PresetDto> => {
    try {
        const response = await axiosInstance.put<PresetResponse>(`/Preset/Edit/${preset.id}`, preset);
        return response.data.preset;
    } catch (error: any) {
        handleError('editPreset', error);
        throw error;
    }
};

export const deletePreset = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/Preset/Delete/${id}`);
    } catch (error: any) {
        handleError('deletePreset', error);
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