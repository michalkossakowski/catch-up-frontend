import { TaskPresetDto } from '../dtos/TaskPresetDto';

let taskPresets: TaskPresetDto[] = [
    { id: 1, presetId: 1, taskContentId: 1, isDeleted: false },
    { id: 2, presetId: 1, taskContentId: 2, isDeleted: false },
    { id: 3, presetId: 2, taskContentId: 2, isDeleted: false },
    { id: 4, presetId: 3, taskContentId: 3, isDeleted: false },
];

export const getAllTaskPresets = async (): Promise<TaskPresetDto[]> => {
    console.log('Mocked getAllTaskPresets called');
    await new Promise(resolve => setTimeout(resolve, 500));
    return taskPresets.filter(tp => !tp.isDeleted);
};

export const getTaskPresetById = async (taskPresetId: number): Promise<TaskPresetDto[]> => {
    console.log(`Mocked getTaskPresetById called with taskPresetId: ${taskPresetId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return taskPresets.filter(tp => tp.id === taskPresetId && !tp.isDeleted);
};

export const getTaskPresetsByTaskContent = async (taskContentId: number): Promise<TaskPresetDto[]> => {
    console.log(`Mocked getTaskPresetsByTaskContent called with taskContentId: ${taskContentId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return taskPresets.filter(tp => tp.taskContentId === taskContentId && !tp.isDeleted);
};

export const addTaskPreset = async (taskPreset: TaskPresetDto): Promise<TaskPresetDto> => {
    console.log('Mocked addTaskPreset called with taskPreset:', taskPreset);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTaskPreset: TaskPresetDto = { ...taskPreset, id: Math.max(...taskPresets.map(tp => tp.id)) + 1, isDeleted: false };
    taskPresets.push(newTaskPreset);
    return newTaskPreset;
};

export const editTaskPreset = async (taskPresetId: number, taskPreset: TaskPresetDto): Promise<void> => {
    console.log(`Mocked editTaskPreset called with taskPresetId: ${taskPresetId}, taskPreset:`, taskPreset);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = taskPresets.findIndex(tp => tp.id === taskPresetId);
    if (index !== -1) {
        taskPresets[index] = { ...taskPreset, id: taskPresetId, isDeleted: false };
    }
};

export const removeTaskFromPreset = async (presetId: number, taskContentId: number): Promise<void> => {
    console.log(`Mocked removeTaskFromPreset called with presetId: ${presetId}, taskContentId: ${taskContentId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    taskPresets = taskPresets.filter(tp => !(tp.presetId === presetId && tp.taskContentId === taskContentId));
};

export const removeTaskFromAllPresets = async (taskContentId: number): Promise<void> => {
    console.log(`Mocked removeTaskFromAllPresets called with taskContentId: ${taskContentId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    taskPresets = taskPresets.filter(tp => tp.taskContentId !== taskContentId);
};

export const getTaskPresetsByPreset = async (presetId: number): Promise<TaskPresetDto[]> => {
    console.log(`Mocked getTaskPresetsByPreset called with presetId: ${presetId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return taskPresets.filter(tp => tp.presetId === presetId && !tp.isDeleted);
};

export const deleteByPresetId = async (presetId: number): Promise<void> => {
    console.log(`Mocked deleteByPresetId called with presetId: ${presetId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    taskPresets.forEach(tp => {
        if (tp.presetId === presetId) {
            tp.isDeleted = true;
        }
    });
};