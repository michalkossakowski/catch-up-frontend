import axiosInstance from '../../axiosConfig';
import { NotificationDto } from '../dtos/NotificationDto';

export const getNotifications = async (): Promise<NotificationDto[]> => {
    try {
        const response = await axiosInstance.get<NotificationDto[]>('/Notification/GetByUserToken',{});
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return [];
        }
        handleError('getNotifications', error);
        throw error;
    }
};

export const readNotifications = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get('/Notification/ReadNotifications',{});
        return response.data;
    } catch (error: any) {
        handleError('readNotifications', error);
        throw error;
    }
};

export const hasUnreadNotifications = async (): Promise<boolean> => {
    try {
        const response = await axiosInstance.get<boolean>('/Notification/HasUnreadNotifications',{});
        return response.data;
    } catch (error: any) {
        handleError('hasUnreadNotifications', error);
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