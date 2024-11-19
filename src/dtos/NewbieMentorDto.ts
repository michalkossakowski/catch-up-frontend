export interface NewbieMentorDto {
    id: string; 
    newbieId: string;
    mentorId: string;
    state: 'Active' | 'Archived' | 'Deleted'; 
    newbieName?: string; 
    mentorName?: string; 
}