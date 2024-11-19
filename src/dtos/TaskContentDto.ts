export interface TaskContentDto {
    id: number;
    creatorId?: string | null;
    categoryId?: number | null;
    materialsId?: number | null;
    title: string;
    description: string;
}
