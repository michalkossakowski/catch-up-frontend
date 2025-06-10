import axiosInstance from '../../axiosConfig.ts'
import { TaskTimeLogDto } from '../dtos/TaskTimeLogDto.ts';
import { editTask } from './taskService.ts';

const TaskTimeLogService = {
    getTaskTimeLogsByTaskId: async (taskId: number, page: number, pageSize: number,): Promise<{ timeLogs: TaskTimeLogDto[], totalCount: number, hours: Number, minutes: Number}> => {
        try {
            const response = await axiosInstance.get<{ timeLogs: TaskTimeLogDto[], totalCount: number, hours: Number, minutes: Number }>(`/TaskTimeLog/GetTaskTimeLogByTaskId/${taskId}/${page}/${pageSize}`);
            return response.data;
        } catch (error: any) {
            console.error('Error while getting task time logs', error);
            throw error;
        }
    },
    deleteTaskTimeLog: async (taskTimeLogId: number): Promise<void> => {
        try {
            await axiosInstance.delete(`/TaskTimeLog/DeleteTaskTimeLog/${taskTimeLogId}`);
        } catch (error: any) {
            console.error('Error while deleting task time log', error);
            throw error;
        }
    },
    addTaskTimeLog: async (taskTimeLog: TaskTimeLogDto): Promise<TaskTimeLogDto> => {
        try {
            const response = await axiosInstance.post<TaskTimeLogDto>('/TaskTimeLog/AddTaskTimeLog', taskTimeLog);
            return response.data;
        } catch (error: any) {
            console.error('Error while adding task time log', error);
            throw error;
        }
    },
    editTaskTimeLog: async (taskTimeLog: TaskTimeLogDto): Promise<TaskTimeLogDto> => {
        try {
            const response = await axiosInstance.put<TaskTimeLogDto>(`/TaskTimeLog/EditTaskTimeLog/${taskTimeLog.id}`, taskTimeLog);
            return response.data;
        } catch (error: any) {
            console.error('Error while editing task time log', error);
            throw error;
        }
    }  
};
export default TaskTimeLogService;