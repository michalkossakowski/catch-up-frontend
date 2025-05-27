import axiosInstance from '../../axiosConfig.ts'
import { TaskCommentDto } from '../dtos/TaskCommentDto.ts';

interface JsonPatchOperation<T = any> {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
  path: string;
  value?: T;
}

type JsonPatch<T = any> = JsonPatchOperation<T>[];

const TaskCommentService = {
    getTaskCommentsByTaskId: async (taskId: number, page:number, pagesize:number): Promise<{comments: TaskCommentDto[], totalCount: number}> => {
        try {
            const response = await axiosInstance.get<{ comments: TaskCommentDto[], totalCount: number }>(`/TaskComment/GetTaskCommentsByTaskId/${taskId}/${page}/${pagesize}`);
            return response.data;
        } catch (error: any) {
            console.error('Error while getting task comments', error);
            throw error;
        }
    },
    deleteTaskComment: async (taskCommentId: number): Promise<void> => {      
        try {
            await axiosInstance.delete(`/TaskComment/DeleteTaskComment/${taskCommentId}`);
        } catch (error: any) {
            console.error('Error while deleting task comment', error);
            throw error;
        }
    },
    addTaskComment: async (taskComment: TaskCommentDto): Promise<TaskCommentDto> => {
        try {
            const response = await axiosInstance.post<TaskCommentDto>('/TaskComment/AddTaskComment', taskComment);
            return response.data;
        } catch (error: any) {
            console.error('Error while adding task comment', error);
            throw error;
        }
    },
    patchTaskComment: async (taskComment: TaskCommentDto): Promise<TaskCommentDto> => {
        try {
            const patchData: JsonPatch = [
                { op: 'replace', path: '/Content', value: taskComment.content },
                { op: 'replace', path: '/MaterialId', value: taskComment.materialId },
            ];
            const response = await axiosInstance.patch<TaskCommentDto>(`/TaskComment/PatchTaskComment/${taskComment.id}`, patchData,
                {
                    headers: {
                        'Content-Type': 'application/json-patch+json',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error('Error while updating task comment', error);
            throw error;
        }
    }
};
export default TaskCommentService;