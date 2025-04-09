import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationDto } from '../dtos/NotificationDto';

interface NotificationState {
    notifications: NotificationDto[];
    hasUnread: boolean;
    notificationsCount: number; 
}

const initialState: NotificationState = {
    notifications: [],
    hasUnread: false,
    notificationsCount: 0,
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification(state, action: PayloadAction<NotificationDto>) {
            state.notifications.unshift(action.payload);
            state.hasUnread = true;
            state.notificationsCount += 1;
        },
        setNotifications(state, action: PayloadAction<NotificationDto[]>) {
            state.notifications = action.payload;
            state.hasUnread = action.payload.some(notification => !notification.isRead);
        },
        setNotificationsCount(state, action: PayloadAction<number>) {
            state.notificationsCount = action.payload; 
        },
        markAsRead(state) {
            state.hasUnread = false;
            state.notifications.forEach(n => n.isRead = true);
        },
        markNotificationAsRead(state, action: PayloadAction<number>) {
            const notificationId = action.payload;
            const notification = state.notifications.find(n => n.notificationId === notificationId);
            if (notification) {
                notification.isRead = true;
                state.hasUnread = state.notifications.some(n => !n.isRead);
            }
        },
    },
});

export const { addNotification, setNotifications, markAsRead, markNotificationAsRead, setNotificationsCount } = notificationSlice.actions;
export default notificationSlice.reducer;