
import { StatusEnum } from '../Enums/StatusEnum';   
export interface FullTaskDto {
    id?: number;
    newbieId: string;
    newbieName: string;
    assigningId: string;
    assigningName: string;
    materialsId?: number;
    categoryId?: number;
    title: string;
    description: string;
    roadMapPointId?: string | null;
    status?: StatusEnum;
    assignmentDate?: Date;
    finalizationDate?: Date | null;
    deadline?: Date | null;
    spendTime?: number;
    priority?: number;
    rate?: number | null;
}