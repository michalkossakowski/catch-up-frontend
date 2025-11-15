import { FileDto } from "./FileDto";
import { SchoolingPartDto } from "./SchoolingPartDto";

export interface SchoolingDto {
    id?: number;
    categoryId?: number;
    creatorId?: string;
    title?: string;
    shortDescription?: string;
    priority?: number;
    content?: string;
    schoolingParts: SchoolingPartDto[];
}
