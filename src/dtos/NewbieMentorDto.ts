export interface NewbieMentorDto {
    newbieId: number;
    mentorId: number; 
    state: Number; 
    StartDate?: string; // ISO 8601 format, np. "2024-11-23T12:34:56.789Z"
    EndDate?: string; // ISO 8601 format, np. "2024-11-23T12:34:56.789Z"
}