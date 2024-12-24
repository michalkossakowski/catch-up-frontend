import { StatusEnum } from "../Enums/StatusEnum";

export interface RoadMapDto {
    id?: number;
    newbieId?: string;
    name?: string;
    startDate?: Date;
    finishDate?: Date;
    status?: StatusEnum;
}