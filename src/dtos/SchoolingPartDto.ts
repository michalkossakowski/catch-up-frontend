import { FileDto } from "./FileDto";
import { MaterialDto } from "./MaterialDto";

export interface SchoolingPartDto {
    id?: number;
    title?: string;
    content?: string;
    shortDescription?: string;
    iconFile?: FileDto;
    materials?: MaterialDto[];
    schoolingUserId?: number;
}