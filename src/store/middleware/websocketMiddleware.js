import  webSocketService  from '../../websockets/WebSocketService';
import { fetchNotifications } from '../slices/notificationSlice';

export const websocketMiddleware = store => next => action => {
    const result = next(action);

    if (action.type === 'websocket/connect') {
        console.log('🔌 Inicjalizacja WebSocket w middleware');
        
        const handleNotification = (message) => {
            console.log('🔔 Otrzymano notyfikację w middleware:', message);
            
            if (message.type === 'notification') {
                // Po prostu odświeżamy listę notyfikacji
                console.log('🔄 Odświeżam listę notyfikacji');
                store.dispatch(fetchNotifications());
            }
        };

        webSocketService.addTypeListener('notification', handleNotification);
    }

    return result;
}; 