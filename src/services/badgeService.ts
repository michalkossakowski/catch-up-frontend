import axiosInstance from '../../axiosConfig';
import { BadgeDto } from '../dtos/BadgeDto';

export const getAllBadges = async (): Promise<BadgeDto[]> => {
    try {
        const response = await axiosInstance.get<BadgeDto[]>('/Badge/GetAll');
        return response.data;
    } catch (error: any) {
        handleError('getAllBadges', error);
        throw error;
    }
};

export const getBadgeById = async (id: number): Promise<BadgeDto> => {
    try {
        const response = await axiosInstance.get<BadgeDto>(`/Badge/GetById/${id}`);
        return response.data;
    } catch (error: any) {
        handleError('getBadgeById', error);
        throw error;
    }
};

export const addBadge = async (badge: BadgeDto): Promise<BadgeDto> => {
    try {
        const response = await axiosInstance.post('/Badge/Add', badge);
        return response.data;
    } catch (error: any) {
        handleError('addBadge', error);
        throw error;
    }
};

export const editBadge = async (badge: BadgeDto): Promise<BadgeDto> => {
    try {
        const response = await axiosInstance.put(`/Badge/Edit/${badge.id}`, badge);
        return response.data;
    } catch (error: any) {
        handleError('editBadge', error);
        throw error;
    }
};

export const deleteBadge = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/Badge/Delete/${id}`);
    } catch (error: any) {
        handleError('deleteBadge', error);
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