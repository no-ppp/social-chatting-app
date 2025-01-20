import { setOnlineUsers, addOnlineUser, removeOnlineUser } from '../../slices/friendSlice';

export const websocketStatusMiddleware = () => next => action => {
    if (action.type === 'WEBSOCKET_MESSAGE') {
        const data = action.payload;
        console.log('🔵 WebSocket Status Middleware received:', data);
        
        if (data.type === 'group_users') {
            console.log('📋 Setting initial online users:', data.users);
            next(setOnlineUsers(data.users));
        }
        else if (data.type === 'status_update') {
            console.log('🟢 Status update received:', data);
            if (data.status === 'online') {
                console.log('✅ Adding user to online:', data.user_id);
                next(addOnlineUser(data.user_id));
            } else {
                console.log('❌ Removing user from online:', data.user_id);
                next(removeOnlineUser(data.user_id));
            }
        }
    }
    return next(action);
}; 