
import { NotificationDto, NotificationResponse } from '../dtos/NotificationDto';

let notifications: NotificationDto[] = [
    { notificationId: 1, message: 'You have a new task assigned.', isRead: false, sendDate: new Date(), source: '/Faq', senderId: '1', receiverId: '1', title: 'new notification'},
    { notificationId: 2, message: 'Your meeting is starting in 5 minutes.', isRead: false, sendDate: new Date(), source: '/Task', senderId: '1', receiverId: '1', title: 'new notification'},
    { notificationId: 3, message: 'You have a new follower.', isRead: true, sendDate: new Date(), source: '/Faq', senderId: '1', receiverId: '1', title: 'new notification'},
];

export const getNotifications = async (pageNumber: number = 1, pageSize: number = 50): Promise<{ notifications: NotificationDto[], totalCount: number }> => {
    console.log(`Mocked getNotifications called with pageNumber: ${pageNumber}, pageSize: ${pageSize}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const paginatedNotifications = notifications.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    return { notifications: paginatedNotifications, totalCount: notifications.length };
};

export const readNotifications = async (): Promise<any> => {
    console.log('Mocked readNotifications called');
    await new Promise(resolve => setTimeout(resolve, 500));
    notifications.forEach(n => n.isRead = true);
    return { message: 'All notifications marked as read' };
};

export const readNotification = async (notificationId: number): Promise<any> => {
    console.log(`Mocked readNotification called with notificationId: ${notificationId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const notification = notifications.find(n => n.notificationId === notificationId);
    if (notification) {
        notification.isRead = true;
    }
    return { message: `Notification ${notificationId} marked as read` };
};

export const hasUnreadNotifications = async (): Promise<boolean> => {
    console.log('Mocked hasUnreadNotifications called');
    await new Promise(resolve => setTimeout(resolve, 500));
    return notifications.some(n => !n.isRead);
};
