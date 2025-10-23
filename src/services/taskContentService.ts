
import { TaskContentDto } from '../dtos/TaskContentDto';
import { TaskContentQueryParameters } from '../dtos/TaskContentQueryParametersDto';
import { PagedResponse } from '../interfaces/PagedResponse';

let taskContents: TaskContentDto[] = [
    { id: 1, title: 'Implement login page', description: 'Create the login page UI.', categoryId: 1, creatorId: '1'},
    { id: 2, title: 'Setup database', description: 'Configure the database connection.', categoryId: 2, creatorId: '1'},
    { id: 3, title: 'Deploy to production', description: 'Deploy the application to the production server.', categoryId: 3, creatorId: '2'},
];

export const getAllTaskContents = async (): Promise<TaskContentDto[]> => {
    console.log('Mocked getAllTaskContents called');
    await new Promise(resolve => setTimeout(resolve, 500));
    return taskContents;
};

export const getTaskContents = async (page: number = 1, pageSize: number = 5): Promise<{ taskContents: TaskContentDto[], totalCount: number }> => {
    console.log(`Mocked getTaskContents called with page: ${page}, pageSize: ${pageSize}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const filteredTaskContents = taskContents;
    const paginatedTaskContents = filteredTaskContents.slice((page - 1) * pageSize, page * pageSize);
    return { taskContents: paginatedTaskContents, totalCount: filteredTaskContents.length };
};

export const getTaskContentsWithPagination = async (params: TaskContentQueryParameters): Promise<PagedResponse<TaskContentDto>> => {
    console.log('Mocked getTaskContentsWithPagination called with params:', params);
    await new Promise(resolve => setTimeout(resolve, 500));
    let filteredTaskContents = taskContents;
    // Apply filters, sorting, etc. based on params (simplified for mock)
    const pageNumber = params.pageNumber ?? 1;
    const pageSize = params.pageSize ?? 10;
    const paginatedTaskContents = filteredTaskContents.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    return { data: paginatedTaskContents, totalCount: filteredTaskContents.length, pageNumber, pageSize };
};

export const getById = async (id: string): Promise<TaskContentDto[]> => {
    console.log(`Mocked getById called with id: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return taskContents.filter(tc => tc.id === parseInt(id) );
};

export const getByTitle = async (title: string): Promise<TaskContentDto[]> => {
    console.log(`Mocked getByTitle called with title: ${title}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return taskContents.filter(tc => tc.title.toLowerCase().includes(title.toLowerCase()) );
};

export const getByCreatorId = async (creatorId: string): Promise<TaskContentDto[]> => {
    console.log(`Mocked getByCreatorId called with creatorId: ${creatorId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return taskContents.filter(tc => tc.creatorId === creatorId );
};

export const getByCategoryId = async (categoryId: string): Promise<TaskContentDto[]> => {
    console.log(`Mocked getByCategoryId called with categoryId: ${categoryId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return taskContents.filter(tc => tc.categoryId === parseInt(categoryId) );
};

export const addTaskContent = async (taskContent: TaskContentDto): Promise<TaskContentDto> => {
    console.log('Mocked addTaskContent called with taskContent:', taskContent);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTaskContent: TaskContentDto = { ...taskContent, id: Math.max(...taskContents.map(tc => tc.id)) + 1};
    taskContents.push(newTaskContent);
    return newTaskContent;
};

export const editTaskContent = async (taskContent: TaskContentDto): Promise<TaskContentDto> => {
    console.log('Mocked editTaskContent called with taskContent:', taskContent);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = taskContents.findIndex(tc => tc.id === taskContent.id);
    if (index === -1) {
        throw new Error('TaskContent not found');
    }
    taskContents[index] = { ...taskContent};
    return taskContents[index];
};

export const deleteTaskContent = async (id: number): Promise<any> => {
    console.log(`Mocked deleteTaskContent called with id: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = taskContents.findIndex(tc => tc.id === id);
    if (index !== -1) {
        taskContents[index];
    }
    return { message: 'TaskContent deleted successfully' };
};
