import { useEffect } from 'react';
import webSocketService from '../../websockets/WebSocketService';
import { useDispatch } from 'react-redux';
import { handleWebSocketNotification } from '../../store/slices/notificationSlice';

const useWebSocketNotification = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('🔄 useWebSocketNotification hook mounted');
        
        const handleNotification = (message) => {
            console.log('🎯 handleNotification wywołany z:', message);
            
            if (message.type === 'notification' && message.notification) {
                console.log('📬 Dispatching WebSocket notification:', message.notification);
                dispatch(handleWebSocketNotification(message.notification));
            }
        };

        console.log('🎧 Dodawanie listenera notyfikacji');
        webSocketService.addTypeListener('notification', handleNotification);

        return () => {
            console.log('🛑 useWebSocketNotification hook unmounted');
            webSocketService.removeTypeListener('notification', handleNotification);
        };
    }, [dispatch]);
};

export default useWebSocketNotification;