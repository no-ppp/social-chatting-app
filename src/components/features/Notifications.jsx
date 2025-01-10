import { useEffect, useReducer, useState } from 'react';
import { friendsAPI } from '../../api/friends';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

const initialState = {
    showNotifications: false,
    notifications: [],
    loading: false,
    error: null
};

function notificationsReducer(state, action) {
    switch (action.type) {
        case 'TOGGLE_NOTIFICATIONS':
            return {
                ...state,
                showNotifications: !state.showNotifications
            };
        case 'FETCH_NOTIFICATIONS_START':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'FETCH_NOTIFICATIONS_SUCCESS':
            return {
                ...state,
                loading: false,
                notifications: action.payload,
                error: null
            };
        case 'FETCH_NOTIFICATIONS_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'MARK_NOTIFICATION_READ':
            return {
                ...state,
                notifications: state.notifications.map(notification =>
                    notification.id === action.payload.id
                        ? { ...notification, is_read: action.payload.is_read }
                        : notification
                )
            };
        default:
            return state;
    }
}

export default function Notifications() {
    const [state, dispatch] = useReducer(notificationsReducer, initialState);
    const { showNotifications, notifications, loading, error } = state;
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        dispatch({ type: 'FETCH_NOTIFICATIONS_START' });
        try {
            const requests = await friendsAPI.getFriendRequests();
            console.log('Pobrane powiadomienia:', requests);
            dispatch({ type: 'FETCH_NOTIFICATIONS_SUCCESS', payload: requests });
        } catch (error) {
            console.error('Błąd podczas pobierania powiadomień:', error);
            dispatch({ type: 'FETCH_NOTIFICATIONS_ERROR', payload: error.message });
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleNotificationClick = async (notification) => {
        try {
            console.log('Handling notification click:', notification); // Debugging
            console.log('Navigating to sender_id:', notification.sender_id); // Debugging
            
            await friendsAPI.markAsReaded(notification.id);
            
            // Aktualizuj stan lokalnie
            dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { id: notification.id, is_read: true } });

            // Zamknij menu powiadomień
            dispatch({ type: 'TOGGLE_NOTIFICATIONS' });

            // Przekieruj do profilu używając pełnej ścieżki
            if (notification.sender_id) {
                console.log(`Redirecting to /app/profile/${notification.sender_id}`); // Debugging
                navigate(`/app/profile/${notification.sender_id}`);
            } else {
                console.error('No sender_id in notification:', notification);
            }
        } catch (error) {
            console.error('Error handling notification click:', error);
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => dispatch({ type: 'TOGGLE_NOTIFICATIONS' })}
                className="text-white hover:text-discord-blue transition-colors"
            >
                <div className="relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {notifications && notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center">
                            {notifications.filter(notif => !notif.is_read).length}
                        </span>
                    )}
                </div>
            </button>

            {showNotifications && (
                <div className="absolute w-96 bg-discord-dark rounded-lg shadow-lg p-4 z-50 left-full ml-2 bottom-0">
                    <div className="relative">
                        <h3 className="text-white font-semibold text-lg mb-4">Powiadomienia</h3>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <p className="text-gray-400">Ładowanie...</p>
                            </div>
                        ) : error ? (
                            <div className="flex justify-center py-8">
                                <p className="text-red-400">{error}</p>
                            </div>
                        ) : !notifications || notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="text-gray-400 text-center">Brak nowych powiadomień</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                                {notifications.map((notification) => (
                                    <div 
                                        key={notification.id} 
                                        className={`text-sm p-3 rounded flex items-start gap-3 cursor-pointer ${
                                            notification.is_read ? 'bg-discord-darker' : 'bg-discord-blue bg-opacity-10'
                                        }`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <img 
                                            src={notification.sender?.avatar || '/default-avatar.png'} 
                                            alt={notification.sender?.email || 'User avatar'}
                                            className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-discord-blue"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className="text-white font-semibold truncate">
                                                    {notification.sender || 'Użytkownik'}
                                                </p>
                                                <span className="text-xs text-gray-400 flex-shrink-0">
                                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 mt-1 break-words">
                                                {notification.text}
                                            </p>
                                            {notification.notification_type === 'friend_request' && (
                                                <div className="flex gap-3 mt-3">
                                                    <span className="text-gray-400 italic">
                                                        {notification.is_read ? 'Oczekujące zaproszenie' : 'Nowe zaproszenie do znajomych'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-discord-dark transform rotate-45"></div>
                    </div>
                </div>
            )}
        </div>
    );
}