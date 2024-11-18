export interface FaqDto {
    id: number;
    title: string;
    answer: string;
    materialsId?: number | null;
}