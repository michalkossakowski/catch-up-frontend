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
    },
});

export const { addNotification, setNotifications, markAsRead, setNotificationsCount } = notificationSlice.actions;
export default notificationSlice.reducer;