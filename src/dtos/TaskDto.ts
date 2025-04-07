import {FullTaskDto} from "./FullTaskDto.ts";

export interface TaskDto {
    id?: number;
    newbieId: string;
    assigningId: string;
    taskContentId: number;
    roadMapPointId?: string | null;
    status?: number;
    assignmentDate?: string;
    finalizationDate?: string | null;
    deadline: string | null;
    spendTime?: number;
    priority?: number;
    rate?: number | null;
}

export interface TaskResponse {
    message: string;
    task: TaskDto;
    fullTask: FullTaskDto;
}