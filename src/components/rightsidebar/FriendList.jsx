const renderUser = (user) => {
    const userStatus = onlineUsers.has(user.id) ? 'online' : 'offline';

    return (
        <div 
            key={user.id} 
            ref={state.selectedUser?.id === user.id ? selectedUserRef : null}
            className={`relative flex items-center p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer group transition-all duration-200`} 
            onClick={(e) => handleUserClick(user, e)}
        >
            <div className="relative">
                <div className="w-10 h-10 bg-discord-dark rounded-full flex items-center justify-center text-lg font-medium shadow-lg">
                    {user.username?.charAt(0)}
                </div>
                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-discord-sidebar ${getStatusColor(userStatus)} shadow-md`} />
            </div>
            <div className="ml-4 flex-1">
                <div className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                    {user.username}
                </div>
                <div className="text-xs text-gray-400">
                    {userStatus === 'online' ? 'Online' : 'Offline'}
                </div>
            </div>
            {state.selectedUser?.id === user.id && (
                <div 
                    ref={userMenuRef}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute z-[100]"
                >
                    <UserMobileMenu
                        user={{...user, status: userStatus}}
                        position={{ x: 0, y: '100%' }}
                        seeProfileHandler={() => {
                            console.log('Profile handler clicked for user:', user.id);
                            handleProfileView(user.id);
                        }}
                        callHandler={() => callHandler(user.id)}
                        sendMessageHandler={() => sendMessageHandler(user.id)}
                    />
                </div>
            )}
        </div>
    );
};
export default FriendList;