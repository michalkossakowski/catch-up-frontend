import { FeedbackDto } from '../dtos/FeedbackDto';
import { ResourceTypeEnum } from '../Enums/ResourceTypeEnum';

let feedbacks: FeedbackDto[] = [
    { id: 1, title: 'Great app!', description: 'I really like using Catch-up.', senderId: '1', receiverId: '2', resourceType: ResourceTypeEnum.Faq, resourceId: 1, createdDate: new Date(), isResolved: false },
    { id: 2, title: 'Bug report', description: 'I found a bug in the calendar.', senderId: '2', receiverId: '1', resourceType: ResourceTypeEnum.Schooling, resourceId: 2, createdDate: new Date(), isResolved: false },
    { id: 3, title: 'Feature request', description: 'Please add a dark mode.', senderId: '1', receiverId: '2', resourceType: ResourceTypeEnum.Task, resourceId: 1, createdDate: new Date(), isResolved: true },
];

export const addFeedback = async (feedback: FeedbackDto): Promise<any> => {
    console.log('Mocked addFeedback called with feedback:', feedback);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newFeedback: FeedbackDto = { ...feedback, id: Math.max(...feedbacks.map(f => f.id ?? 0)) + 1, createdDate: new Date(), isResolved: false };
    feedbacks.push(newFeedback);
    return newFeedback;
};

export const getFeedbacks = async (): Promise<FeedbackDto[]> => {
    console.log('Mocked getFeedbacks called');
    await new Promise(resolve => setTimeout(resolve, 500));
    return feedbacks;
};

export const getTitleFeedbacks = async (searchingTitle: string): Promise<FeedbackDto[]> => {
    console.log(`Mocked getTitleFeedbacks called with searchingTitle: ${searchingTitle}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return feedbacks.filter(f => f.title.toLowerCase().includes(searchingTitle.toLowerCase()));
};

export const deleteFeedback = async (id: number): Promise<any> => {
    console.log(`Mocked deleteFeedback called with id: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    feedbacks = feedbacks.filter(f => f.id !== id);
    return { message: 'Feedback deleted successfully' };
};

export const doneFeedback = async (id: number): Promise<any> => {
    console.log(`Mocked doneFeedback called with id: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = feedbacks.findIndex(f => f.id === id);
    if (index !== -1) {
        feedbacks[index].isResolved = !feedbacks[index].isResolved;
    }
    return { message: 'Feedback status changed successfully' };
};
