import { useReducer, useEffect } from 'react';

const initialState = {
  activeUsers: [
    { id: 1, name: 'Użytkownik 1', status: 'online', activity: 'Gra w Minecraft' },
    { id: 2, name: 'Użytkownik 2', status: 'idle', activity: 'Słucha Spotify' },
    { id: 3, name: 'Użytkownik 3', status: 'dnd', activity: 'W trakcie streamowania' }
  ],
  offlineUsers: [
    { id: 4, name: 'Użytkownik 4', status: 'offline', activity: '' }
  ],
  isMenuOpen: false,
  selectedUser: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return { ...state, isMenuOpen: !state.isMenuOpen };
    case 'SET_SELECTED_USER':
      return { ...state, selectedUser: state.selectedUser?.id === action.payload.id ? null : action.payload };
    case 'CLOSE_MENU':
      return { ...state, isMenuOpen: false, selectedUser: null };
    default:
      return state;
  }
};

const RightSidebar = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleUserClick = (user, event) => {
    event.preventDefault();
    dispatch({ type: 'SET_SELECTED_USER', payload: user });
  };

  const handleClickOutside = (event) => {
    if (state.isMenuOpen && !event.target.closest('.user-menu') && !event.target.closest('.fixed.right-0.top-0')) {
      dispatch({ type: 'CLOSE_MENU' });
    } else if (!event.target.closest('.fixed.right-0.top-0')) {
      dispatch({ type: 'CLOSE_MENU' });
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [state.isMenuOpen]);

  const UserMenu = ({ user, position }) => (
    <div 
      className="absolute z-50 bg-discord-dark rounded-lg shadow-lg py-2 w-48 user-menu"
      style={{ top: position.y, left: position.x }}
    >
      <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
        Zobacz profil
      </button>
      {user.status !== 'offline' && (
        <>
          <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
            Wyślij wiadomość
          </button>
          <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
            Zadzwoń
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Przycisk menu mobilnego */}
      <button 
        onClick={() => dispatch({ type: 'TOGGLE_MENU' })}
        className="fixed right-4 top-4 sm:hidden z-50 bg-discord-dark p-2 rounded-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </button>

      {/* Menu mobilne */}
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 sm:hidden ${state.isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed right-0 top-0 w-72 h-screen bg-discord-sidebar transform transition-transform duration-300 ${state.isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gray-400 uppercase text-xs font-bold tracking-wider">
                Aktywni przyjaciele — {state.activeUsers.length}
              </h2>
              <button onClick={() => dispatch({ type: 'CLOSE_MENU' })} className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              {state.activeUsers.map(user => (
                <div 
                  key={user.id} 
                  className="relative flex items-center p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer group transition-all duration-200"
                  onClick={(e) => handleUserClick(user, e)}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-discord-dark rounded-full flex items-center justify-center text-lg font-medium shadow-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div 
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-discord-sidebar ${getStatusColor(user.status)} shadow-md`} 
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                      {user.name}
                    </div>
                    {user.activity && (
                      <div className="text-xs text-gray-400 mt-0.5 italic">
                        {user.activity}
                      </div>
                    )}
                  </div>
                  {state.selectedUser?.id === user.id && (
                    <UserMenu user={user} position={{ x: 0, y: '100%' }} />
                  )}
                </div>
              ))}
            </div>

            <h2 className="text-gray-400 uppercase text-xs font-bold mt-6 mb-2 tracking-wider">
              Offline — {state.offlineUsers.length}
            </h2>
            <div className="space-y-2">
              {state.offlineUsers.map(user => (
                <div 
                  key={user.id} 
                  className="relative flex items-center p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer group transition-all duration-200 opacity-50"
                  onClick={(e) => handleUserClick(user, e)}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-discord-dark rounded-full flex items-center justify-center text-lg font-medium shadow-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div 
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-discord-sidebar ${getStatusColor(user.status)} shadow-md`} 
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                      {user.name}
                    </div>
                  </div>
                  {state.selectedUser?.id === user.id && (
                    <UserMenu user={user} position={{ x: 0, y: '100%' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Standardowy sidebar */}
      <div className="fixed right-0 top-0 w-0 sm:w-60 h-screen bg-discord-sidebar border-l border-gray-800 transition-all duration-300 md:w-72 lg:w-80">
        <div className="p-4">
          <h2 className="text-gray-400 uppercase text-xs font-bold mb-4 tracking-wider">
            Aktywni przyjaciele — {state.activeUsers.length}
          </h2>
          
          <div className="space-y-2">
            {state.activeUsers.map(user => (
              <div 
                key={user.id} 
                className="relative hidden sm:flex items-center p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer group transition-all duration-200"
                onClick={(e) => handleUserClick(user, e)}
              >
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-discord-dark rounded-full flex items-center justify-center text-base sm:text-lg font-medium shadow-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div 
                    className={`absolute bottom-0 right-0 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full border-2 border-discord-sidebar ${getStatusColor(user.status)} shadow-md`} 
                  />
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="text-xs sm:text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                    {user.name}
                  </div>
                  {user.activity && (
                    <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5 italic">
                      {user.activity}
                    </div>
                  )}
                </div>
                {state.selectedUser?.id === user.id && (
                  <UserMenu user={user} position={{ x: 0, y: '100%' }} />
                )}
              </div>
            ))}
          </div>

          <h2 className="text-gray-400 uppercase text-xs font-bold mt-6 mb-2 tracking-wider">
            Offline — {state.offlineUsers.length}
          </h2>
          <div className="space-y-2">
            {state.offlineUsers.map(user => (
              <div 
                key={user.id} 
                className="relative hidden sm:flex items-center p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer group transition-all duration-200 opacity-50"
                onClick={(e) => handleUserClick(user, e)}
              >
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-discord-dark rounded-full flex items-center justify-center text-base sm:text-lg font-medium shadow-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div 
                    className={`absolute bottom-0 right-0 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full border-2 border-discord-sidebar ${getStatusColor(user.status)} shadow-md`} 
                  />
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="text-xs sm:text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                    {user.name}
                  </div>
                </div>
                {state.selectedUser?.id === user.id && (
                  <UserMenu user={user} position={{ x: 0, y: '100%' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
