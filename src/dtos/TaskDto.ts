import { StatusEnum } from '../Enums/StatusEnum';

export interface TaskDto {
    Id?: number
    NewbieId?: string
    AssigningId?: string
    TaskContentId: number 
    RoadMapPointId?: number
    Status: StatusEnum
    AssignmentDate: string
    FinalizationDate?: string
    Deadline?: string
    SpendTime: number
    Priority: number
    Rate?: number
}