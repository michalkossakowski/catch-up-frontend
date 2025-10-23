
import { TaskCommentDto } from '../dtos/TaskCommentDto.ts';

let comments: TaskCommentDto[] = [
    { id: 1, taskId: 1, creatorId: '1', content: 'This is the first comment.', creationDate: new Date(), materialId: 1},
    { id: 2, taskId: 1, creatorId: '2', content: 'This is the second comment.', creationDate: new Date(), materialId: 2},
    { id: 3, taskId: 2, creatorId: '1', content: 'This is a comment on another task.', creationDate: new Date(), materialId: 3},
];

const TaskCommentService = {
    getTaskCommentsByTaskId: async (taskId: number, page: number, pagesize: number): Promise<{ comments: TaskCommentDto[], totalCount: number }> => {
        console.log(`Mocked getTaskCommentsByTaskId called with taskId: ${taskId}, page: ${page}, pagesize: ${pagesize}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const taskComments = comments.filter(c => c.taskId === taskId);
        const paginatedComments = taskComments.slice((page - 1) * pagesize, page * pagesize);
        return { comments: paginatedComments, totalCount: taskComments.length };
    },

    deleteTaskComment: async (taskCommentId: number): Promise<void> => {
        console.log(`Mocked deleteTaskComment called with taskCommentId: ${taskCommentId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = comments.findIndex(c => c.id === taskCommentId);
        if (index !== -1) {
            comments[index];
        }
    },

    addTaskComment: async (taskComment: TaskCommentDto): Promise<TaskCommentDto> => {
        console.log('Mocked addTaskComment called with taskComment:', taskComment);
        await new Promise(resolve => setTimeout(resolve, 500));
        const newComment: TaskCommentDto = { ...taskComment, id: Math.max(...comments.map(c => c.id!)) + 1};
        comments.push(newComment);
        return newComment;
    },

    patchTaskComment: async (taskComment: TaskCommentDto): Promise<TaskCommentDto> => {
        console.log('Mocked patchTaskComment called with taskComment:', taskComment);
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = comments.findIndex(c => c.id === taskComment.id);
        if (index === -1) {
            throw new Error('Task comment not found');
        }
        comments[index] = { ...comments[index], ...taskComment};
        return comments[index];
    }
};

export default TaskCommentService;
