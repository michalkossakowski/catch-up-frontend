import { FileDto } from "./FileDto";

export interface SchoolingPartDto {
    id?: number;
    title?: string;
    content?: string;
    shortDescription?: string;
    iconFile?: FileDto;
    materials?: number[];
    schoolingUserId?: number;
}