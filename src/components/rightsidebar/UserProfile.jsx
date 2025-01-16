import UserStatusMenu from './UserStatusMenu';

const renderUserProfile = () => {
    const currentUser = getUserFromLocalStorage();
    const isOnline = currentUser ? onlineUsers.has(currentUser.id) : false;
    const currentStatus = isOnline ? 'online' : 'offline';

    return (
        <div className="relative">
            <div 
                className="flex items-center p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-all duration-200"
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'TOGGLE_STATUS_MENU' });
                }}
                type="button"
                data-close-button
            >
                <div className="relative">
                    <div className="w-10 h-10 bg-discord-dark rounded-full flex items-center justify-center text-lg font-medium shadow-lg">
                        {state.userProfile.username?.charAt(0)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-discord-sidebar ${getStatusColor(currentStatus)} shadow-md`} />
                </div>
                <div className="ml-4 flex-1">
                    <div className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                        {state.userProfile.username}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 italic">
                        {isOnline ? 'Online' : 'Offline'}
                    </div>
                </div>
            </div>
            {state.userProfile.showStatusMenu && <UserStatusMenu />}
        </div>
    );
};
export default UserProfile;