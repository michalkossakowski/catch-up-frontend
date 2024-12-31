import axiosInstance from '../../axiosConfig';
import { UserDto } from '../dtos/UserDto';

export const searchUsers = async (searchPhrase: string): Promise<UserDto[]> => {
    const response = await axiosInstance.get(`/User/Search/${searchPhrase}`);
    return response.data;
};
