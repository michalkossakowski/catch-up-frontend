export interface FullTaskDto {
    id?: number;
    newbieId?: string;
    materialsId: number;
    categoryId: number;
    title: string;
    description: string;
    roadMapPointId?: string | null;
    status: number;
    assignmentDate?: string;
    finalizationDate?: string | null;
    deadline: string;
    spendTime: number;
    priority: number;
    rate?: number | null;
}