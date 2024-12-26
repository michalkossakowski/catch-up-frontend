export interface FaqDto {
    id: number;
    question: string;
    answer: string;
    materialId?: number | null;
}