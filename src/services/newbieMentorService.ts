import { NewbieMentorDto } from '../dtos/NewbieMentorDto';
import { UserAssignCountDto } from '../dtos/UserAssignCountDto';
import { TypeEnum } from '../Enums/TypeEnum';

let users: UserAssignCountDto[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', type: TypeEnum.Mentor},
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', type: TypeEnum.Newbie },
    { id: '3', name: 'Peter Jones', email: 'peter.jones@example.com', type: TypeEnum.Mentor},
    { id: '4', name: 'Mary Williams', email: 'mary.williams@example.com', type: TypeEnum.Newbie},
];

let assignments: NewbieMentorDto[] = [
    { newbieId: 2, mentorId: 1, state: 0, StartDate: new Date().toISOString() }, // Active
    { newbieId: 4, mentorId: 1, state: 1, StartDate: new Date().toISOString() }, // Archived
    { newbieId: 2, mentorId: 3, state: 2, StartDate: new Date().toISOString() }, // Deleted
];

const NewbieMentorService = {
    getUsers: async (
        role: TypeEnum,
        assigned?: boolean,
        relatedId?: string
    ): Promise<UserAssignCountDto[]> => {
        console.log('Mocked getUsers called with:', { role, assigned, relatedId });
        await new Promise(resolve => setTimeout(resolve, 500));
        let filteredUsers = users.filter(u => u.type === role);
        if (assigned === true) {
            // This logic is not implemented in the mock
        } else if (assigned === false) {
            // This logic is not implemented in the mock
        }
        return filteredUsers;
    },

    getAssignments: async (id: string, role: TypeEnum): Promise<UserAssignCountDto[]> => {
        console.log(`Mocked getAssignments called with id: ${id}, role: ${role}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const relatedAssignments = assignments.filter(a => (role === TypeEnum.Mentor ? a.mentorId.toString() === id : a.newbieId.toString() === id) && a.state === 0); // Active
        const relatedUserIds = relatedAssignments.map(a => role === TypeEnum.Mentor ? a.newbieId.toString() : a.mentorId.toString());
        return users.filter(u => relatedUserIds.includes(u.id!));
    },

    setAssignmentState: async (newbieId: string, mentorId: string, state: 'Archived' | 'Deleted'): Promise<void> => {
        console.log(`Mocked setAssignmentState called with newbieId: ${newbieId}, mentorId: ${mentorId}, state: ${state}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const assignment = assignments.find(a => a.newbieId.toString() === newbieId && a.mentorId.toString() === mentorId);
        if (assignment) {
            assignment.state = state === 'Archived' ? 1 : 2;
        }
    },

    assignNewbieToMentor: async (newbieId: string, mentorId: string): Promise<void> => {
        console.log(`Mocked assignNewbieToMentor called with newbieId: ${newbieId}, mentorId: ${mentorId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const newbieIdNum = parseInt(newbieId);
        const mentorIdNum = parseInt(mentorId);
        if (!assignments.some(a => a.newbieId === newbieIdNum && a.mentorId === mentorIdNum)) {
            assignments.push({ newbieId: newbieIdNum, mentorId: mentorIdNum, state: 0, StartDate: new Date().toISOString() });
        }
    },
};

export default NewbieMentorService;
