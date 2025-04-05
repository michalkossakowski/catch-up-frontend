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

export interface NotificationResponse {
    notifications: NotificationDto[];
    totalCount: number;         
}