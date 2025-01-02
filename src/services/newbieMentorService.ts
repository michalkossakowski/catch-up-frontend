import axios from '../../axiosConfig';
import { UserAssignCountDto } from '../dtos/UserAssignCountDto';


const NewbieMentorService = {
    getAllMentors: async (): Promise<UserAssignCountDto[]> => {
        try 
        {
            //console.log("Trying to getAllMentors");
            const response = await axios.get< UserAssignCountDto[] >(`/NewbieMentor/GetAllMentors`);
            //console.log("Mentors got successfully:", response.data);
            return response.data;
        } 
        catch (error) 
        {
            console.error("Error while getting mentors", error);

            throw error;
        }
    },
    getAllNewbies: async (): Promise<UserAssignCountDto[]> => {
      try 
      {
          //console.log("Trying to getAllNewbies");
          const response = await axios.get< UserAssignCountDto[] >(`/NewbieMentor/GetAllNewbies`);
          //console.log("Newbies got successfully:", response.data);
          return response.data;
      } 
      catch (error) 
      {
          console.error("Error while getting newbies", error);

          throw error;
      }
  },
    getNewbieCountByMentor: async (mentorId: string): Promise<number> => {
        try 
        {
          const response = await axios.get< number >(`/NewbieMentor/GetNewbieCountByMentor/${mentorId}`);
          return response.data;
        }
        catch (error) 
        {
          console.error("Error while getting newbie count for mentor", error);
          throw error;
        }
      },
      getMentorCountByNewbie: async (newbieId: string): Promise<number> => {
        try 
        {
          const response = await axios.get< number >(`/NewbieMentor/GetMentorCountByNewbie/${newbieId}`);
          return response.data;
        }
        catch (error) 
        {
          console.error("Error while getting mentor count for newbie", error);
          throw error;
        }
      },
    getAssignmentsByMentor: async (mentorId: string): Promise<UserAssignCountDto[]> => {
        try 
        {
            const response = await axios.get<UserAssignCountDto[]>(`/NewbieMentor/GetAssignmentsByMentor/${mentorId}`);
            return response.data;
        } 
        catch (error) 
        {
            console.error("Error fetching assigned newbies:", error);
            throw error;
        }
    },
    getAssignmentsByNewbie: async (newbieId: string): Promise<UserAssignCountDto[]> => {
      try 
      {
          const response = await axios.get<UserAssignCountDto[]>(`/NewbieMentor/GetAssignmentsByNewbie/${newbieId}`);
          return response.data;
      } 
      catch (error) 
      {
          console.error("Error fetching assigned newbies:", error);
          throw error;
      }
  },
    getAllUnassignedNewbies: async (mentorId: string): Promise<UserAssignCountDto[]> => {
        try 
        {
            const response = await axios.get<UserAssignCountDto[]>(`/NewbieMentor/GetAllUnassignedNewbies/${mentorId}`);
            return response.data;
        } 
        catch (error) 
        {
            console.error("Error fetching unassigned newbies:", error);
            throw error;
        }
    },
    getAllUnassignedMentors: async (newbieId: string): Promise<UserAssignCountDto[]> => {
      try 
      {
          const response = await axios.get<UserAssignCountDto[]>(`/NewbieMentor/GetAllUnassignedMentors/${newbieId}`);
          return response.data;
      } 
      catch (error) 
      {
          console.error("Error fetching unassigned newbies:", error);
          throw error;
      }
   },
    deleteAssignment: async (newbieId: string, mentorId: string) => {
        try 
        {
          await axios.delete(`/NewbieMentor/Delete/${newbieId}/${mentorId}`);
        } 
        catch (error) 
        {
          throw new Error('Failed to delete the assignment');
        }
      },
    Unassign: async (newbieId: string, mentorId: string) => {
        try 
        {
          await axios.delete(`/NewbieMentor/Archive/${newbieId}/${mentorId}`);
        } 
        catch (error) 
        {
          throw new Error('Failed to unassign the assignment');
        }
      },
     assignNewbieToMentor: async (newbieId: string, mentorId: string) => 
        {
        try 
        {
          const response = await axios.post(`/NewbieMentor/Assign/${newbieId}/${mentorId}`);
          return response.data; 
        } 
        catch (error) 
        {
          throw new Error('An error occurred while assigning the newbie to the mentor');
        }
      },
};

export default NewbieMentorService;
