import axiosInstance from '../../axiosConfig'
import { TaskDto } from "../dtos/TaskDto"

export const assignTask = async (task: TaskDto,taskContentId: number,newbieId: string): Promise<TaskDto>=>{
    try{
        const response = await axiosInstance.post<TaskDto>(`/Task/AddTaskToUser/${newbieId}/${taskContentId}`, task);
        return response.data
    }catch(error: any){
        handleError('assignTask',error)
        throw error
    }
}
const handleError = (operation: string, error: any): void => {
    console.error(`${operation} failed:`, error);
    if (!error.response) {
        throw new Error('API is not available');
    }
    throw new Error(error.response.data?.message || 'An unexpected error occurred');
};