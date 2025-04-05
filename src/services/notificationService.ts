import axiosInstance from '../../axiosConfig';
import { NotificationDto, NotificationResponse } from '../dtos/NotificationDto';

export const getNotifications = async (pageNumber: number = 1, pageSize: number = 50): Promise<{ notifications: NotificationDto[], totalCount: number }> => {
    try {
        const response = await axiosInstance.get<NotificationResponse>('/Notification/GetByUserToken', {
            params: { pageNumber, pageSize }
        });
        
        return {
            notifications: response.data.notifications,
            totalCount: response.data.totalCount
        };
    } catch (error: any) {
        if (error.response?.status === 404) {
            return {
                notifications: [],
                totalCount: 0
            };
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