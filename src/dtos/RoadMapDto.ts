import { StatusEnum } from "../Enums/StatusEnum";

export interface RoadMapDto {
    id?: number;
    newbieId?: string;
    creatorId?: string;
    creatorName?: string;
    title?: string;
    description?: string;
    assignDate?: Date;
    finishDate?: Date;
    status?: StatusEnum;
    progress?: number;
}