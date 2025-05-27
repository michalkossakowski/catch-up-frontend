export interface TaskTimeLogDto {
    id?: number;
    taskId?: number;
    hours?: number;
    minutes?: number;
    description?: string;
    creationDate?: Date;
    modificationDate?: Date;
}