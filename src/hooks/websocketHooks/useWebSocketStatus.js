import { useState, useEffect } from 'react';
import WebSocketService from '../../websockets/WebSocketService';

const useWebSocketStatus = () => {
    const [onlineUsers, setOnlineUsers] = useState(new Set());

    useEffect(() => {
        console.log('🔵 useWebSocketStatus hook initialized');

        const handleMessage = (data) => {
            console.log('📩 Message received in hook:', data);
            
            if (data.type === 'group_users') {
                console.log('📋 Initial users list received:', data.users);
                setOnlineUsers(new Set(data.users));
            }
            else if (data.type === 'status_update') {
                console.log('🟢 Status update received:', data);
                setOnlineUsers(prev => {
                    const newSet = new Set(prev);
                    if (data.status === 'online') {
                        console.log('✅ Adding user to online:', data.user_id);
                        newSet.add(data.user_id);
                    } else {
                        console.log('❌ Removing user from online:', data.user_id);
                        newSet.delete(data.user_id);
                    }
                    return newSet;
                });
            }
        };

        // Dodaj listener do wiadomości
        WebSocketService.addListener('message', handleMessage);
        
        // Cleanup
        return () => {
            console.log('🔴 Removing message listener');
            WebSocketService.removeListener('message', handleMessage);
        };
    }, []);

    return { onlineUsers };
};

export default useWebSocketStatus;