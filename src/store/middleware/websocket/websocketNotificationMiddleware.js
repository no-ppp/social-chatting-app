import { 
    addNotification, 
    updateNotification, 
    removeNotification,
    clearNotifications
} from '../../slices/notificationSlice';

export const websocketNotificationMiddleware = () => next => action => {
    if (action.type === 'WEBSOCKET_MESSAGE') {
        const data = action.payload;
        console.log('🔔 Notification Middleware received:', data);

        // Sprawdzamy czy to jest notyfikacja
        if (data.type === 'notification' && data.notification) {
            console.log('📨 New notification to add:', data.notification);
            next(addNotification(data.notification));
            return;
        }

        // Pozostałe typy wiadomości
        switch (data.type) {
            case 'notification_update':
                console.log('🔄 Notification update received:', data.notification);
                next(updateNotification(data.notification));
                break;
                
            case 'notification_delete':
                console.log('🗑️ Notification delete received:', data.notification_id);
                next(removeNotification(data.notification_id));
                break;
                
            case 'notifications_clear':
                console.log('🧹 Clear notifications received');
                next(clearNotifications());
                break;
        }
    }

    return next(action);
}; 