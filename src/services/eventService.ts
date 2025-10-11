import axiosInstance from '../../axiosConfig';
import { EventDto } from '../dtos/EventDto';

export const getUserEvents = async (): Promise<EventDto[]> => {
  try {
    const response = await axiosInstance.get<EventDto[]>('/Event');
    return response.data;
  } catch (error: any) {
    handleError('getUserEvents', error);
    throw error;
  }
};

export const addEvent = async (event: EventDto): Promise<EventDto> => {
  try {
    const response = await axiosInstance.post('/Event', event);
    return response.data.eventDto;
  } catch (error: any) {
    handleError('addEvent', error);
    throw error;
  }
};

export const deleteEvent = async (eventId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/Event/Delete/${eventId}`);
  } catch (error: any) {
    handleError('deleteEvent', error);
    throw error;
  }
};

const handleError = (operation: string, error: any): void => {
  console.error(`${operation} failed:`, error);
  if (!error.response) {
    throw new Error('API is not available');
  }
  throw new Error(error.response.data?.message || 'An unexpected error occurred');
};
