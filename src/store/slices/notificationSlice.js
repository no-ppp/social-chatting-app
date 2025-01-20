import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationAPI } from '../../api/notification.js';

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async () => {
    const response = await notificationAPI.getNotifications();
    return response;
})

export const markAsReaded = createAsyncThunk('notifications/markAsReaded', async (notificationId) => {
    const response = await notificationAPI.markAsReaded(notificationId);
    return response;
})

export const markAllAsReaded = createAsyncThunk('notifications/markAllAsReaded', async () => {
    const resposne = await notificationAPI.markAllAsReaded();
    return response
})

export const deleteNotification = createAsyncThunk('notifications/deleteNotification', async (notificationId) => {
    const response = await notificationAPI.deleteNotification(notificationId);
    return response;
})

// Thunk do obsługi nowych notyfikacji WebSocket
export const handleWebSocketNotification = createAsyncThunk(
    'notifications/handleWebSocket',
    async (notification) => {
        try {
            // Możemy tu dodać jakąś logikę API jeśli potrzebna
            // np. potwierdzenie otrzymania notyfikacji
            return notification;
        } catch (error) {
            console.error('Błąd podczas obsługi notyfikacji WebSocket:', error);
            throw error;
        }
    }
);

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            console.log('💾 Adding notification:', action.payload);
            const exists = state.notifications.some(n => n.id === action.payload.id);
            if (!exists) {
                state.notifications.unshift(action.payload);
                if (!action.payload.is_read) {
                    state.unreadCount += 1;
                }
            } else {
                console.log('⚠️ Notification already exists:', action.payload.id);
            }
        },
        updateNotification: (state, action) => {
            const index = state.notifications.findIndex(n => n.id === action.payload.id);
            if (index !== -1) {
                const wasUnread = !state.notifications[index].is_read;
                const isNowRead = action.payload.is_read;
                state.notifications[index] = action.payload;
                
                if (wasUnread && isNowRead) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            }
        },
        removeNotification: (state, action) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification && !notification.is_read) {
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
        markAsRead: (state, action) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification && !notification.is_read) {
                notification.is_read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(notification => {
                notification.is_read = true;
            });
            state.unreadCount = 0;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter(n => !n.is_read).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(markAsReaded.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n.id === action.payload.id);
                if (notification) {
                    notification.is_read = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markAllAsReaded.fulfilled, (state, action) => {
                state.notifications.forEach(notification => notification.is_read = true);
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(notification => notification.id !== action.payload)
            })
            .addCase(handleWebSocketNotification.fulfilled, (state, action) => {
                console.log('💾 Dodawanie notyfikacji WebSocket:', action.payload);
                const exists = state.notifications.some(n => n.id === action.payload.id);
                
                if (!exists) {
                    state.notifications.unshift(action.payload);
                    if (!action.payload.is_read) {
                        state.unreadCount += 1;
                    }
                    console.log('✅ Notyfikacja WebSocket dodana');
                } else {
                    console.log('⚠️ Notyfikacja już istnieje');
                }
            })
    }
});

export const {
    addNotification,
    updateNotification,
    removeNotification,
    clearNotifications,
    markAsRead,
    markAllAsRead,
    setLoading,
    setError
} = notificationSlice.actions;

// Selektory
export const selectAllNotifications = (state) => state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectLoading = (state) => state.notifications.loading;
export const selectError = (state) => state.notifications.error;

export default notificationSlice.reducer;