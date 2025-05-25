import axiosInstance from '../../axiosConfig.ts'
import { TaskCommentDto } from '../dtos/TaskCommentDto.ts';


const TaskCommentService = {
    getTaskCommentsByTaskId: async (taskId: number, page:number, pagesize:number): Promise<{comments: TaskCommentDto[], totalCount: number}> => {
        try {
            const response = await axiosInstance.get<{ comments: TaskCommentDto[], totalCount: number }>(`/TaskComment/GetTaskCommentsByTaskId/${taskId}/${page}/${pagesize}`);
            return response.data;
        } catch (error: any) {
            console.error('Error while getting task comments', error);
            throw error;
        }
    }
};
export default TaskCommentService;