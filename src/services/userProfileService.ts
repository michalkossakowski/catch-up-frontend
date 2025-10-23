import { UserProfileDto } from '../dtos/UserProfileDto';

let userProfiles: UserProfileDto[] = [
    {
        userId: '1',
        bio: 'Software developer with a passion for frontend technologies.',
        department: 'Engineering',
        location: 'New York, USA',
        phone: '123-456-7890',
        teamsUsername: 'johndoe',
        slackUsername: 'johndoe',
        interests: ['React', 'TypeScript', 'Node.js'],
        languages: ['English', 'Spanish'],
    },
];

const getUserProfile = async (userId: string): Promise<UserProfileDto | null> => {
    console.log(`Mocked getUserProfile called with userId: ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const profile = userProfiles.find(p => p.userId === userId);
    return profile || null;
};

const createUserProfile = async (profile: UserProfileDto): Promise<UserProfileDto | null> => {
    console.log('Mocked createUserProfile called with profile:', profile);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (userProfiles.some(p => p.userId === profile.userId)) {
        throw new Error('User profile already exists');
    }
    userProfiles.push(profile);
    return profile;
};

const updateUserProfile = async (profile: UserProfileDto): Promise<UserProfileDto | null> => {
    console.log('Mocked updateUserProfile called with profile:', profile);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = userProfiles.findIndex(p => p.userId === profile.userId);
    if (index === -1) {
        throw new Error('User profile not found');
    }
    userProfiles[index] = profile;
    return profile;
};

export default {
    getUserProfile,
    createUserProfile,
    updateUserProfile
};