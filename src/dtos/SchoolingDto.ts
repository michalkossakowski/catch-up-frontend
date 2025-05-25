import { FileDto } from "./FileDto";
import { SchoolingPartProgressBarDto } from "./SchoolingPartProgressBarDto";

export interface SchoolingDto {
    id?: number;
    categoryId?: number;
    creatorId?: string;
    title?: string;
    shortDescription?: string;
    priority?: number;
    iconFile?: FileDto;
    content?: string;
    schoolingPartProgressBar: SchoolingPartProgressBarDto[];
}
