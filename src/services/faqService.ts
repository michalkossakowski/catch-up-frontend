import axiosInstance from '../../axiosConfig';
import { FaqDto, FaqResponse } from '../dtos/FaqDto';

export const getFaqs = async (page: number, pageSize: number): Promise<{ faqs: FaqDto[], totalCount: number }> => {
    try {
        const response = await axiosInstance.get<{ faqs: FaqDto[], totalCount: number }>(`/Faq/GetAll/${page}/${pageSize}`);
        return response.data;
    } catch (error: any) {
        handleError('getFaqs', error);
        throw error;
    }
};

export const getById = async (id: string): Promise<FaqDto[]> => {
    try {
        const response = await axiosInstance.get<FaqDto[]>('/Faq/GetById/'+id);
        return response.data;
    } catch (error: any) {
        handleError('getById', error);
        throw error;
    }
};

export const getBySearch = async (searchPhrase: string): Promise<FaqDto[]> => {
    try {
        const response = await axiosInstance.get<FaqDto[]>('/Faq/Search/'+searchPhrase);
        return response.data;
    } catch (error: any) {
        handleError('searchFaq', error);
        throw error;
    }
};

export const addFaq = async (faq: FaqDto): Promise<FaqResponse> => {
    try {
        const response = await axiosInstance.post('/Faq/Add', faq);
        return response.data;
    } catch (error: any) {
        handleError('addFaq', error);
        throw error;
    }
};

export const editFaq = async (faq: FaqDto): Promise<FaqResponse> => {
    try {
        const response = await axiosInstance.put('/Faq/Edit/' + faq.id, faq);
        return response.data;
    } catch (error: any) {
        handleError('editFaq', error);
        throw error;
    }
};

export const deleteFaq = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete('/Faq/Delete/' + id);
        return response.data;
    } catch (error: any) {
        handleError('deleteFaq', error);
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