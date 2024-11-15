import { FileDto } from "./FileDto";

export interface MaterialDto {
    id?: number;
    name: string;
    files?: FileDto[]
}
