import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { 
    fetchNotifications, 
    markAsRead,
    markAllAsRead,
    removeNotification,
    selectAllNotifications,
    selectLoading,
    selectError,
    selectUnreadCount
} from '../../store/slices/notificationSlice';

export default function Notifications() {
    console.log('🔄 Notifications component rendered');
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const notifications = useSelector(selectAllNotifications);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const unreadCount = useSelector(selectUnreadCount);

    useEffect(() => {
        console.log('📋 Notifications updated:', notifications);
    }, [notifications]);

    useEffect(() => {
        console.log('🔄 Initial notifications fetch');
        dispatch(fetchNotifications());
    }, [dispatch]);

    useEffect(() => {
        console.log('🔄 Notifications component re-render:', { 
            notificationsCount: notifications.length,
            unreadCount 
        });
    }, [notifications, unreadCount]);

    const handleNotificationClick = async (notification) => {
        try {
            await dispatch(markAsRead(notification.id));
            
            switch (notification.notification_type) {
                case 'friend_request':
                    setIsOpen(false);
                    navigate(`/app/profile/${notification.related_request?.sender?.id}`);
                    break;
                case 'message':
                    setIsOpen(false);
                    navigate(`/app/chat/${notification.chat_id}`);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Error handling notification:', error);
        }
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllAsRead());
    };

    const handleRemoveNotification = (e, id) => {
        e.stopPropagation();
        dispatch(removeNotification(id));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.notifications-container')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    if (loading) return <div>Ładowanie...</div>;
    if (error) return <div>Błąd: {error}</div>;

    return (
        <div className="relative notifications-container">
            <button 
                className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                title="Powiadomienia"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-full top-0 ml-2 w-80 bg-discord-dark rounded-lg shadow-lg max-h-[80vh] overflow-y-auto z-50">
                    <div className="sticky top-0 bg-discord-dark p-2 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="text-white font-medium">Powiadomienia</h3>
                        {notifications.length > 0 && (
                            <button 
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-gray-400 hover:text-white transition-colors"
                            >
                                Oznacz wszystkie jako przeczytane
                            </button>
                        )}
                    </div>
                    
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-700">
                            {notifications.map((notification) => (
                                <div 
                                    key={notification.id} 
                                    className={`p-4 cursor-pointer hover:bg-gray-700/30 transition-colors relative group ${
                                        notification.is_read 
                                            ? 'bg-gray-700/50' 
                                            : 'bg-discord-blue/10'
                                    }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                            <p className={`${notification.is_read ? 'text-gray-400' : 'text-white'}`}>
                                                {notification.text}
                                            </p>
                                            <span className="text-xs text-gray-500">
                                                {formatDistanceToNow(new Date(notification.created_at), { 
                                                    addSuffix: true,
                                                    locale: pl 
                                                })}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => handleRemoveNotification(e, notification.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                                            title="Usuń powiadomienie"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-gray-400 text-center">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>Brak powiadomień</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}