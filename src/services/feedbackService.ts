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

export const getFeedbacks = async (): Promise<FeedbackDto[]> => {
    try {
        const response = await axiosInstance.get<FeedbackDto[]>(`/feedback/GetAll`);
        return response.data;
    } catch (error: any) {
        handleError('getFeedbacks', error);
        throw error;
    }
};

export const getTitleFeedbacks = async (searchingTitle: string): Promise<FeedbackDto[]> => {
    try {
        const response = await axiosInstance.get<FeedbackDto[]>(`/feedback/GetByTitle/${searchingTitle}`);
        return response.data;
    } catch (error: any) {
        handleError('getTitleFeedbacks', error);
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