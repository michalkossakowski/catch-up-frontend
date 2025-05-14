import axiosInstance from '../../axiosConfig';

export interface UserProfileDto {
  userId: string;
  bio?: string;
  department?: string;
  location?: string;
  phone?: string;
  teamsUsername?: string;
  slackUsername?: string;
  interests: string[];
  languages: string[];
}

const getUserProfile = async (userId: string): Promise<UserProfileDto | null> => {
  try {
    const response = await axiosInstance.get(`/UserProfile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

const createUserProfile = async (profile: UserProfileDto): Promise<UserProfileDto | null> => {
  try {
    const response = await axiosInstance.post(`/UserProfile`, profile);
    return response.data;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

const updateUserProfile = async (profile: UserProfileDto): Promise<UserProfileDto | null> => {
  try {
    const response = await axiosInstance.put(`/UserProfile/${profile.userId}`, profile);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export default {
  getUserProfile,
  createUserProfile,
  updateUserProfile
}; 