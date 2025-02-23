import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationDto } from '../dtos/NotificationDto';

interface NotificationState {
    notifications: NotificationDto[];
    hasUnread: boolean;
}

const initialState: NotificationState = {
    notifications: [],
    hasUnread: false,
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification(state, action: PayloadAction<NotificationDto>) {
            state.notifications.unshift(action.payload);
            state.hasUnread = true;
        },
        setNotifications(state, action: PayloadAction<NotificationDto[]>) {
            state.notifications = action.payload; 
            state.hasUnread = action.payload.some(notification => !notification.isRead);
        },
        markAsRead(state) {
            state.hasUnread = false;
            state.notifications.forEach(n => n.isRead = true);
        }
    },
});

export const { addNotification, setNotifications, markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;