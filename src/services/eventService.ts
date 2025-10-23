import { EventDto } from '../dtos/EventDto';

let events: EventDto[] = [
    {
        id: 1,
        title: 'Team Meeting',
        description: 'Weekly team sync',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        ownerId: '1',
        targetUserType: 'all'
    },
    {
        id: 2,
        title: 'Project Deadline',
        description: 'Final submission for Project X',
        startDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        ownerId: '1',
        targetUserType: 'all'
    },
];

export const getUserEvents = async (): Promise<EventDto[]> => {
    console.log('Mocked getUserEvents called');
    await new Promise(resolve => setTimeout(resolve, 500));
    return events;
};

export const addEvent = async (event: EventDto): Promise<EventDto> => {
    console.log('Mocked addEvent called with event:', event);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newEvent: EventDto = { ...event, id: Math.max(...events.map(e => e.id)) + 1 };
    events.push(newEvent);
    return newEvent;
};

export const deleteEvent = async (eventId: number): Promise<void> => {
    console.log(`Mocked deleteEvent called with eventId: ${eventId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    events = events.filter(e => e.id !== eventId);
};