export interface FileDto {
    id: number;
    name?: string;
    type?: string;
    source?: string;
    dateOfUpload?: Date;
    sizeInBytes?: number;
    owner?: string;
}
