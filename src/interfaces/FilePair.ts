import { FileDto } from "../dtos/FileDto";

export interface FilePair {
    fileDto: FileDto;
    file?: File;
}