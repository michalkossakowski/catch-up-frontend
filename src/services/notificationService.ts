import axiosInstance from '../../axiosConfig';
import { NotificationDto } from '../dtos/NotificationDto';
import Cookies from "js-cookie";

const getAccessToken = () => {
    return Cookies.get("refreshToken");
};

export const getNotifications = async (): Promise<NotificationDto[]> => {
    try {
        const token = getAccessToken();
        const response = await axiosInstance.get<NotificationDto[]>('/Notification/GetByUserToken',
            {
                params: {
                    access_token: token, 
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
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
        const token = getAccessToken();
        const response = await axiosInstance.get('/Notification/ReadNotifications',
            {
                params: {
                    access_token: token, 
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        handleError('readNotifications', error);
        throw error;
    }
};

export const hasUnreadNotifications = async (): Promise<boolean> => {
    try {
        const token = getAccessToken();
        const response = await axiosInstance.get<boolean>('/Notification/HasUnreadNotifications',
            {
                params: {
                    access_token: token, 
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
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