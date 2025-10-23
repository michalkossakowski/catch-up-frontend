
import { UserDto } from '../dtos/UserDto';
import { TypeEnum } from '../Enums/TypeEnum';


let users: UserDto[] = [
    { id: '1', name: 'HRek', surname: 'HRowsky', email: 'hr@catchup.com', password: 'password', type: TypeEnum.Admin, position: 'HR' },
    { id: '2', name: 'Other', surname: 'User', email: 'other@catchup.com', password: 'password', type: TypeEnum.Newbie, position: 'Junior Developer' },
    { id: '3', name: 'Mentor', surname: 'Mentorsky', email: 'mentor@catchup.com', password: 'password', type: TypeEnum.Mentor, position: 'Team Lead' },
    { id: '4', name: 'Newbie', surname: 'Newbiewsky', email: 'newbie@catchup.com', password: 'password', type: TypeEnum.Newbie, position: 'Junior Developer' },
    { id: '5', name: 'Admin', surname: 'Adminsky', email: 'admin@catchup.com', password: 'password', type: TypeEnum.Admin, position: 'Administrator' },
];

export const searchUsers = async (searchPhrase: string): Promise<UserDto[]> => {
    console.log(`Mocked searchUsers called with searchPhrase: ${searchPhrase}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return users.filter(u => 
        u.name.toLowerCase().includes(searchPhrase.toLowerCase()) || 
        u.surname.toLowerCase().includes(searchPhrase.toLowerCase()) || 
        u.email.toLowerCase().includes(searchPhrase.toLowerCase()));
};

export const getUserById = async (userId: string): Promise<UserDto> => {
    console.log(`Mocked getUserById called with userId: ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = users.find(u => u.id === userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

export const addUser = async (user: UserDto): Promise<UserDto> => {
    console.log('Mocked addUser called with user:', user);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: UserDto = { ...user, id: (Math.max(...users.map(u => parseInt(u.id))) + 1).toString() };
    users.push(newUser);
    return newUser;
};

export const editUser = async (userId: string, updateData: Partial<UserDto>): Promise<UserDto> => {
    console.log(`Mocked editUser called with userId: ${userId}, updateData:`, updateData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
        throw new Error('User not found');
    }
    users[index] = { ...users[index], ...updateData };
    return users[index];
};

export const getAdmins = async (): Promise<UserDto[]> => {
    console.log('Mocked getAdmins called');
    await new Promise(resolve => setTimeout(resolve, 500));
    return users.filter(u => u.type === TypeEnum.Admin);
};

export const getAll = async (): Promise<UserDto[]> => {
    console.log('Mocked getAll called');
    await new Promise(resolve => setTimeout(resolve, 500));
    return users;
};

export const getMyNewbies = async (): Promise<UserDto[]> => {
    console.log('Mocked getMyNewbies called');
    await new Promise(resolve => setTimeout(resolve, 500));
    // Assuming the current user is a mentor and has newbies '2' and '4'
    return users.filter(u => u.id === '2' || u.id === '4');
};
