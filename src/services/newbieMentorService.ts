import axios from '../../axiosConfig';
import { UserAssignCountDto } from '../dtos/UserAssignCountDto';
import { RoleEnum } from '../Enums/RoleEnum';

interface UsersResponse {
  users: UserAssignCountDto[];
  count: number;
}

interface AssignmentsResponse {
  assignments: UserAssignCountDto[];
  count: number;
}

const NewbieMentorService = {
  // Pobierz wszystkich użytkowników (mentorów lub nowych pracowników, przypisanych lub nie)
  getUsers: async (
    role: RoleEnum,
    assigned?: boolean,
    relatedId?: string
  ): Promise<UsersResponse> => {
    try {
      const params: Record<string, string> = { role };
      if (assigned !== undefined) {
        params.assigned = assigned.toString();
      }
      if (relatedId) {
        params.relatedId = relatedId;
      }

      const response = await axios.get<UsersResponse>('/NewbieMentor/GetUsers', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error(`Error during get ${role === RoleEnum.Mentor ? 'mentor' : 'newbie'}:`, error);
      throw error;
    }
  },

  // Pobierz przypisania dla mentora lub nowego pracownika
  getAssignments: async (id: string, role: RoleEnum): Promise<AssignmentsResponse> => {
    try {
      const response = await axios.get<AssignmentsResponse>(
        `/NewbieMentor/GetAssignments/${id}`,
        {
          params: { role },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error during assign ${role === RoleEnum.Mentor ? 'mentor' : 'newbie'}:`,
        error
      );
      throw error;
    }
  },

  // Usuń lub archiwizuj przypisanie
  setAssignmentState: async (newbieId: string, mentorId: string, state: 'Archived' | 'Deleted'): Promise<void> => {
    try {
      await axios.patch(`/NewbieMentor/SetState/${newbieId}/${mentorId}`, null, {
        params: { state },
      });
    } catch (error) {
      console.error(
        `Error during ${state === 'Archived' ? 'archive' : 'delete'} assignment:`,
        error
      );
      throw new Error(
        `Failed during ${state === 'Archived' ? 'archive' : 'delete'} assignment`
      );
    }
  },

  // Przypisz nowego pracownika do mentora
  assignNewbieToMentor: async (newbieId: string, mentorId: string): Promise<void> => {
    try {
      await axios.post(`/NewbieMentor/Assign/${newbieId}/${mentorId}`);
    } catch (error) {
      console.error('Error during assign mentor to newbie:', error);
      throw new Error('Error during assign mentor to newbie');
    }
  },
};

export default NewbieMentorService;