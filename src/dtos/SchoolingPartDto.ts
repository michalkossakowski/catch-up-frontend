import { MaterialDto } from "./MaterialDto";

export interface SchoolingPartDto {
    id?: number;
    name?: string;
    content?: string;
    materials?: MaterialDto[];
}