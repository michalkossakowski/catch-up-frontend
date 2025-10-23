import { BadgeDto } from '../dtos/BadgeDto';
import { BadgeTypeCountEnum } from '../Enums/BadgeTypeCountEnum';

let badges: BadgeDto[] = [
    { id: 1, name: 'Newbie Recruiter', description: 'Awarded for recruiting 10 newbies', iconId: 1, count: 10, countType: BadgeTypeCountEnum.NewbiesCount, achievedDate: null },
    { id: 2, name: 'Task Master', description: 'Awarded for assigning 20 tasks', iconId: 2, count: 20, countType: BadgeTypeCountEnum.AssignedTasksCount, achievedDate: null },
    { id: 3, name: 'Content Creator', description: 'Awarded for creating 30 tasks', iconId: 3, count: 30, countType: BadgeTypeCountEnum.CreatedTasksCount, achievedDate: null },
];

export const getAllBadges = async (): Promise<BadgeDto[]> => {
    console.log('Mocked getAllBadges called');
    await new Promise(resolve => setTimeout(resolve, 500));
    return badges;
};

export const getBadgeById = async (id: number): Promise<BadgeDto> => {
    console.log(`Mocked getBadgeById called with id: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const badge = badges.find(b => b.id === id);
    if (!badge) {
        throw new Error('Badge not found');
    }
    return badge;
};

export const addBadge = async (badge: BadgeDto): Promise<BadgeDto> => {
    console.log('Mocked addBadge called with badge:', badge);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newBadge: BadgeDto = { ...badge, id: Math.max(...badges.map(b => b.id)) + 1 };
    badges.push(newBadge);
    return newBadge;
};

export const editBadge = async (badge: BadgeDto): Promise<BadgeDto> => {
    console.log('Mocked editBadge called with badge:', badge);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = badges.findIndex(b => b.id === badge.id);
    if (index === -1) {
        throw new Error('Badge not found');
    }
    badges[index] = badge;
    return badges[index];
};

export const deleteBadge = async (id: number): Promise<void> => {
    console.log(`Mocked deleteBadge called with id: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    badges = badges.filter(b => b.id !== id);
};


export const getByMentorId = async (): Promise<BadgeDto[]> => {
    console.log('Mocked getAllBadges called');
    await new Promise(resolve => setTimeout(resolve, 500));
    return badges;
};