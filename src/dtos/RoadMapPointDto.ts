import { StatusEnum } from "../Enums/StatusEnum";

export interface RoadMapPointDto {
    id?: number;
    roadMapId?: number;
    name?: string;
    newbieId?: string;
    assignmentDate?: Date;
    finalizationDate?: Date;
    deadline?: number;
    status?: StatusEnum;
}