const renderStatusMenu = () => (
    <div ref={statusMenuRef} className="absolute top-full left-0 mt-2 w-48 bg-discord-dark rounded-lg shadow-lg p-2 status-menu z-50">
      <button 
        onClick={() => dispatch({ type: 'SET_USER_STATUS', payload: 'online' })}
        className="w-full flex items-center p-2 hover:bg-gray-700 rounded-lg"
        type="button"
        data-close-button
      >
        <div className={`w-3 h-3 rounded-full ${getStatusColor('online')} mr-2`}></div>
        <span className="text-white">Online</span>
      </button>
      <button 
        onClick={() => dispatch({ type: 'SET_USER_STATUS', payload: 'idle' })}
        className="w-full flex items-center p-2 hover:bg-gray-700 rounded-lg"
        type="button"
        data-close-button
      >
        <div className={`w-3 h-3 rounded-full ${getStatusColor('idle')} mr-2`}></div>
        <span className="text-white">Idle</span>
      </button>
      <button 
        onClick={() => dispatch({ type: 'SET_USER_STATUS', payload: 'dnd' })}
        className="w-full flex items-center p-2 hover:bg-gray-700 rounded-lg"
        type="button"
        data-close-button
      >
        <div className={`w-3 h-3 rounded-full ${getStatusColor('dnd')} mr-2`}></div>
        <span className="text-white">Do Not Disturb</span>
      </button>
      <button 
        onClick={() => dispatch({ type: 'SET_USER_STATUS', payload: 'offline' })}
        className="w-full flex items-center p-2 hover:bg-gray-700 rounded-lg"
        type="button"
        data-close-button
      >
        <div className={`w-3 h-3 rounded-full ${getStatusColor('offline')} mr-2`}></div>
        <span className="text-white">Offline</span>
      </button>
      <div className="border-t border-gray-700 my-2"></div>
      <button 
        onClick={() => dispatch({ type: 'OPEN_SETTINGS' })}
        className="w-full flex items-center p-2 hover:bg-gray-700 rounded-lg"
        type="button"
        data-close-button
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-white">Ustawienia</span>
      </button>
      <button 
        onClick={onLogout}
        className="w-full flex items-center p-2 hover:bg-gray-700 rounded-lg text-red-500 hover:text-red-400"
        type="button"
        data-close-button
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Wyloguj się</span>
      </button>
    </div>
  );
  
  export default UserStatusMenu;