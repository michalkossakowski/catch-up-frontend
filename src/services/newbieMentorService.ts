
import axios from '../../axiosConfig';
import { NewbieMentorDto } from '../dtos/NewbieMentorDto'; 
import { UserDto } from '../dtos/UserDto';


const NewbieMentorService = {
    getAllMentors: async (): Promise<UserDto[]> => {
        try {
            console.log("Trying to getAllMentors");
            const response = await axios.get< UserDto[] >(`/NewbieMentor/GetAllMentors`);
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
          const response = await axios.get< number >(`/NewbieMentor/GetNewbieCountByMentor/${mentorId}`);
          return response.data;
        }
        catch (error) {
          console.error("Error while getting newbie count for mentor", error);
          throw error;
        }
      },
    getAssignmentsByMentor: async (mentorId: string): Promise<UserDto[]> => {
        try {
            const response = await axios.get<UserDto[]>(`/NewbieMentor/GetAssignmentsByMentor/${mentorId}`);
            return response.data;
        } 
        catch (error) {
            console.error("Error fetching assigned newbies:", error);
            throw error;
        }
    },
    getAllUnassignedNewbies: async (mentorId: string): Promise<UserDto[]> => {
        try {
            const response = await axios.get<UserDto[]>(`/NewbieMentor/GetAllUnassignedNewbies/${mentorId}`);
            return response.data;
        } 
        catch (error) {
            console.error("Error fetching unassigned newbies:", error);
            throw error;
        }
    },
    deleteAssignment: async (newbieId: string, mentorId: string) => {
        try {
          await axios.delete(`/NewbieMentor/Delete/${newbieId}/${mentorId}`);
        } catch (error) {
          throw new Error('Failed to delete the assignment');
        }
      },
     assignNewbieToMentor: async (newbieId: string, mentorId: string) => 
        {
        try {
          const response = await axios.post(`/NewbieMentor/Assign/${newbieId}/${mentorId}`);
          return response.data; 
        } catch (error) {
          throw new Error('An error occurred while assigning the newbie to the mentor');
        }
      },
};

export default NewbieMentorService;
