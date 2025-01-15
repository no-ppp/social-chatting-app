import { useState, useEffect } from 'react';
import WebSocketService from '../../websockets/WebSocketService';

const useWebSocketStatus = () => {
    const [onlineUsers, setOnlineUsers] = useState(new Set());

    useEffect(() => {
        console.log('🔵 useUserStatus hook initialized');

        const handleStatusUpdate = (data) => {
            console.log('🟢 Status update received in hook:', data);
            if (data.type === 'status_update') {
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

        // Dodaj listener do konkretnego typu eventu
        WebSocketService.addListener('message', handleStatusUpdate);
        
        // Cleanup
        return () => {
            console.log('🔴 Removing status update listener');
            WebSocketService.removeListener('message', handleStatusUpdate);
        };
    }, []);

    return { onlineUsers };
};

export default useWebSocketStatus;