export interface FaqDto {
    id: number;
    question: string;
    answer: string;
    materialId?: number | null;
    creatorId: string;
}

export interface FaqResponse {
    message: string;
    faq: FaqDto;
}