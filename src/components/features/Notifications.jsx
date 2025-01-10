import { useState, useEffect } from 'react';
import { friendsAPI } from '../../api/friends';

export default function Notifications() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const requests = await friendsAPI.getFriendRequests();
                setNotifications(requests);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-white hover:text-discord-blue transition-colors"
            >
                <div className="relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center">
                            {notifications.length}
                        </span>
                    )}
                </div>
            </button>

            {showNotifications && (
                <div className="absolute w-64 bg-discord-dark rounded-lg shadow-lg p-4 z-50 bottom-full mb-2">
                    <h3 className="text-white font-medium mb-3">Notifications</h3>
                    {notifications.length === 0 ? (
                        <p className="text-gray-400">No new notifications</p>
                    ) : (
                        <div className="space-y-2">
                            {notifications.map((notification) => (
                                <div key={notification.id} className="text-sm text-white p-2 bg-discord-darker rounded">
                                    <p>Friend request from {notification.sender.username}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}