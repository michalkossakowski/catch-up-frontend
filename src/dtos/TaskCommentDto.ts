export interface TaskCommentDto {
    Id?: number;
    TaskId?: number;
    CreatorId?: string;
    CreatorName?: string;
    MaterialId?: number;
    Content?: string;
    CreationDate?: Date;
    ModificaionDate?: Date;
}