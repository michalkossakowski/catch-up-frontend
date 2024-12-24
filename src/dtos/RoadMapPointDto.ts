import { StatusEnum } from "../Enums/StatusEnum";

export interface RoadMapPointDto {
    id?: number;
    roadMapId?: number;
    name?: string;
    newbieId?: string;
    startDate?: Date;
    finishDate?: Date;
    deadline?: Date;
    status?: StatusEnum;
}