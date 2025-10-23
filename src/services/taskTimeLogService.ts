
import { TaskTimeLogDto } from '../dtos/TaskTimeLogDto.ts';

let timeLogs: TaskTimeLogDto[] = [
    { id: 1, taskId: 1,  creationDate: new Date(), minutes: 60, description: 'Worked on the login UI.' },
    { id: 2, taskId: 1,  creationDate: new Date(), minutes: 30, description: 'Fixed a bug in the login form.'},
    { id: 3, taskId: 2, creationDate: new Date(), minutes: 120, description: 'Set up the database schema.' },
];

const TaskTimeLogService = {
    getTaskTimeLogsByTaskId: async (taskId: number, page: number, pageSize: number): Promise<{ timeLogs: TaskTimeLogDto[], totalCount: number, hours: number, minutes: number }> => {
        console.log(`Mocked getTaskTimeLogsByTaskId called with taskId: ${taskId}, page: ${page}, pageSize: ${pageSize}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const taskTimeLogs = timeLogs.filter(tl => tl.taskId === taskId);
        const totalMinutes = taskTimeLogs.reduce((acc, tl) => acc + tl.minutes!, 0);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const paginatedTimeLogs = taskTimeLogs.slice((page - 1) * pageSize, page * pageSize);
        return { timeLogs: paginatedTimeLogs, totalCount: taskTimeLogs.length, hours, minutes };
    },

    deleteTaskTimeLog: async (taskTimeLogId: number): Promise<void> => {
        console.log(`Mocked deleteTaskTimeLog called with taskTimeLogId: ${taskTimeLogId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = timeLogs.findIndex(tl => tl.id === taskTimeLogId);
        if (index !== -1) {
            timeLogs[index];
        }
    },

    addTaskTimeLog: async (taskTimeLog: TaskTimeLogDto): Promise<TaskTimeLogDto> => {
        console.log('Mocked addTaskTimeLog called with taskTimeLog:', taskTimeLog);
        await new Promise(resolve => setTimeout(resolve, 500));
        const newTimeLog: TaskTimeLogDto = { ...taskTimeLog, id: Math.max(...timeLogs.map(tl => tl.id!)) + 1 };
        timeLogs.push(newTimeLog);
        return newTimeLog;
    },

    editTaskTimeLog: async (taskTimeLog: TaskTimeLogDto): Promise<TaskTimeLogDto> => {
        console.log('Mocked editTaskTimeLog called with taskTimeLog:', taskTimeLog);
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = timeLogs.findIndex(tl => tl.id === taskTimeLog.id);
        if (index === -1) {
            throw new Error('Task time log not found');
        }
        timeLogs[index] = { ...taskTimeLog };
        return timeLogs[index];
    }
};

export default TaskTimeLogService;
