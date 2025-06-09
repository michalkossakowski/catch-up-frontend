export interface TaskContentQueryParameters {
    pageNumber: number;
    pageSize: number;
    titleFilter?: string;
    categoryFilter?: number;
    creatorFilter?: string;
    sortBy?: string;
    sortOrder?: string;
} 