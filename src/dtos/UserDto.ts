export interface UserDto {
    id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    type: string;
    position: string;
    state: number;      
    assignCount?: number;
}