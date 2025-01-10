export interface UserDto {
    id: string | undefined;
    name?: string;
    surname: string;
    email?: string;
    password?: string;
    type?: string;
    position?: string;
    avatarId?: number;
}