import axios from '../../axiosConfig';
import { UserAssignCountDto } from '../dtos/UserAssignCountDto';
import { TypeEnum } from '../Enums/TypeEnum';


const NewbieMentorService = {
  // Fetch all users (mentors or newbies, assigned or not)
  getUsers: async (
    role: TypeEnum,
    assigned?: boolean,
    relatedId?: string
  ): Promise<UserAssignCountDto[]> => {
    try {
      const params: Record<string, string> = { role };
      if (assigned !== undefined) {
        params.assigned = assigned.toString();
      }
      if (relatedId) {
        params.relatedId = relatedId;
      }

      const response = await axios.get<UserAssignCountDto[]>('/NewbieMentor/GetUsers', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error(`Error while fetching ${role === TypeEnum.Mentor ? 'mentors' : 'newbies'}:`, error);
      throw error;
    }
  },

  // Fetch assignments for a mentor or newbie
  getAssignments: async (id: string, role: TypeEnum): Promise<UserAssignCountDto[]> => {
    try {
      const response = await axios.get<UserAssignCountDto[]>(
        `/NewbieMentor/GetAssignments/${id}`,
        {
          params: { role },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error while fetching assignments for ${role === TypeEnum.Mentor ? 'mentor' : 'newbie'}:`,
        error
      );
      throw error;
    }
  },

  // Delete or archive an assignment
  setAssignmentState: async (newbieId: string, mentorId: string, state: 'Archived' | 'Deleted'): Promise<void> => {
    try {
      await axios.patch(`/NewbieMentor/SetState/${newbieId}/${mentorId}`, null, {
        params: { state },
      });
    } catch (error) {
      console.error(
        `Error during ${state === 'Archived' ? 'archiving' : 'deleting'} assignment:`,
        error
      );
      throw new Error(
        `Failed to ${state === 'Archived' ? 'archive' : 'delete'} the assignment`
      );
    }
  },

  // Assign a newbie to a mentor
  assignNewbieToMentor: async (newbieId: string, mentorId: string): Promise<void> => {
    try {
      await axios.post(`/NewbieMentor/Assign/${newbieId}/${mentorId}`);
    } catch (error) {
      console.error('Error while assigning newbie to mentor:', error);
      throw new Error('An error occurred while assigning the newbie to the mentor');
    }
  },
};

export default NewbieMentorService;