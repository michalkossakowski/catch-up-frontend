import axios from 'axios';
import { NewbieMentorDto } from '../dtos/NewbieMentorDto'; 
import { UserDto } from '../dtos/UserDto';

const API_URL = "https://localhost:7097/api/NewbieMentor";

const NewbieMentorService = {
    getAllMentors: async (): Promise<UserDto[]> => {
        try {
            console.log("Trying to getAllMentors");
            const response = await axios.get< UserDto[] >(`${API_URL}/GetAllMentors`);
            console.log("Mentors got successfully:", response.data);
            return response.data;

        } 
        catch (error) {
            console.error("Error while getting mentors", error);

            throw error;
        }
    },
    getNewbieCountByMentor: async (mentorId: string): Promise<number> => {
        try {
          const response = await axios.get< number >(`${API_URL}/GetNewbieCountByMentor/${mentorId}`);
          return response.data;
        } catch (error) {
          console.error("Error while getting newbie count for mentor", error);
          throw error;
        }
      },
};
export default NewbieMentorService;
