export interface NotificationDto {
    notificationId: number;
    senderId: string;
    receiverId: string;
    title: string;
    message: string;
    sendDate: Date;
    source: string;
    isRead: boolean;
}