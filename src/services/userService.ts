import axiosInstance from '../../axiosConfig';
import { UserDto } from '../dtos/UserDto';

export const searchUsers = async (searchPhrase: string): Promise<UserDto[]> => {
    try {

    const response = await axiosInstance.get(`/User/Search/${searchPhrase}`);
        return response.data;
    } catch (error: any) {
        handleError('getUserById', error);
        throw error;
    }
};

export const getUserById = async (userId: string): Promise<UserDto> => {
    try {
        const response = await axiosInstance.get<UserDto>(`/User/GetById/${userId}`);
        return response.data;
    } catch (error: any) {
        handleError('getUserById', error);
        throw error;
    }
};

export const addUser = async (user: UserDto): Promise<UserDto> => {
    try {
        const response = await axiosInstance.post<UserDto>('/User/Add', user);
        return response.data;
    } catch (error: any) {
        handleError('addUser', error);
        throw error;
    }
};

export const editUser = async (userId: string, updateData: Partial<UserDto>): Promise<UserDto> => {
    try {
        const response = await axiosInstance.patch<UserDto>(`/User/Edit/${userId}`, updateData);
        return response.data;
    } catch (error: any) {
        handleError('editUser', error);
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