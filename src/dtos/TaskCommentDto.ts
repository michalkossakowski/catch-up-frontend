export interface TaskCommentDto {
    id?: number;
    taskId?: number;
    creatorId?: string;
    creatorName?: string;
    materialId?: number;
    content?: string;
    creationDate?: Date;
    modificationDate?: Date;
}