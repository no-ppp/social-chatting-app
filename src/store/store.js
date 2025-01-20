import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import { websocketMiddlewares } from './middleware/websocket';
import friendReducer from './slices/friendSlice';
import notificationReducer from './slices/notificationSlice';
import authReducer from './slices/authSlice';
import WebSocketService from '../websockets/WebSocketService';

// Włącz obsługę Set w Immer
enableMapSet();

const store = configureStore({
    reducer: {
        auth: authReducer,
        friends: friendReducer,
        notifications: notificationReducer,
        // ... other reducers
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ['friends.onlineUsers'],
            },
        }).concat(websocketMiddlewares),
});

// Ustaw store w WebSocketService
console.log('🔵 Initializing WebSocketService with Redux store');
WebSocketService.setStore(store);

export default store;