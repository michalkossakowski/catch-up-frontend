export interface UserAssignCountDto {
    id: string | undefined;
    name?: string;
    surname?: string;
    email?: string;
    password?: string;
    type?: string;
    position?: string;
    state?: number;
    avatarId?: number;
}