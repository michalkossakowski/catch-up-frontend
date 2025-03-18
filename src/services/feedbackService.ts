import axiosInstance from '../../axiosConfig';
import { FeedbackDto } from '../dtos/FeedbackDto';

export const addFeedback = async (feedback: FeedbackDto): Promise<any> => {
    try {
        const response = await axiosInstance.post('/feedback/Add', feedback);
        return response.data;
    } catch (error: any) {
        handleError('addFeedback', error);
        throw error;
    }
};

export const getFeedbacks = async (userId: string, isAdmin: boolean): Promise<FeedbackDto[]> => {
    try {
        const endpoint = isAdmin ? 
            `/feedback/GetByReceiverId/${userId}` : 
            `/feedback/GetBySenderId/${userId}`;
        const response = await axiosInstance.get<FeedbackDto[]>(endpoint);
        return response.data;
    } catch (error: any) {
        handleError('getFeedbacks', error);
        throw error;
    }
};

export const deleteFeedback = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/feedback/delete/${id}`);
        return response.data;
    } catch (error: any) {
        handleError('deleteFeedback', error);
        throw error;
    }
};

export const doneFeedback = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.put(`/feedback/ChangeDoneStatus/${id}`);
        return response.data;
    } catch (error: any) {
        handleError('changeDoneFeedback', error);
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