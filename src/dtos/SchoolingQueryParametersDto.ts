export interface SchoolingQueryParameters {
    pageNumber?: number;
    pageSize?: number;
    titleFilter?: string;
    categoryFilter?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
