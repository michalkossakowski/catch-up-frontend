import { FileDto } from "./FileDto";

export interface SchoolingPartProgressBarDto {
    id?: number;
    order?: number;
    fileIcon?: FileDto;
    isDone?: boolean;
    title?: string;
    shortDescription?: string;
}
