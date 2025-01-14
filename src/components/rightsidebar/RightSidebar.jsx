import { useReducer, useRef, useEffect, useState, useCallback } from 'react';
import UserMobileMenu from './UserMobileMenu';
import useClickOutside from '../../hooks/useClickOutside'; // this is custom hook for click outside -->src/hooks
import { friendsAPI } from '../../api/friends';
import { useNavigate } from 'react-router-dom';

// Initial state for the sidebar
const initialState = {
  activeUsers: [],
  offlineUsers: [],
  userProfile: {
    username: 'User',
    status: 'online',
    activity: 'Available',
    showStatusMenu: false
  },
  isMenuOpen: false,
  selectedUser: null,
};

// Reducer to handle state updates
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FRIENDS':
      return {
        ...state,
        activeUsers: action.payload.filter(friend => friend.status !== 'offline'),
        offlineUsers: action.payload.filter(friend => friend.status === 'offline')
      };
    case 'TOGGLE_MENU':
      return { ...state, isMenuOpen: !state.isMenuOpen, selectedUser: null };
    case 'SET_SELECTED_USER':
      return { ...state, selectedUser: state.selectedUser?.id === action.payload.id ? null : action.payload };
    case 'CLOSE_MENU':
      return { ...state, isMenuOpen: false, selectedUser: null };
    case 'CLOSE_USER_MENU':
      return { ...state, selectedUser: null };
    case 'TOGGLE_STATUS_MENU':
      return { 
        ...state, 
        userProfile: {
          ...state.userProfile,
          showStatusMenu: !state.userProfile.showStatusMenu
        }
      };
    case 'SET_USER_STATUS':
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          status: action.payload,
          showStatusMenu: false,
          activity: action.payload === 'online' ? 'Available' : 
                   action.payload === 'idle' ? 'Away' :
                   action.payload === 'dnd' ? 'Do Not Disturb' : 'Offline'
        }
      };
    case 'UPDATE_USER_STATUS':
      console.log('Reducer: UPDATE_USER_STATUS', action.payload);
      
      // Znajdź użytkownika w obu listach
      const userInActive = state.activeUsers.find(user => user.id === action.payload.userId);
      const userInOffline = state.offlineUsers.find(user => user.id === action.payload.userId);
      
      let newActiveUsers = [...state.activeUsers];
      let newOfflineUsers = [...state.offlineUsers];

      if (action.payload.isOnline) {
        // Jeśli użytkownik jest online, przenieś go do aktywnych
        if (userInOffline) {
          newOfflineUsers = newOfflineUsers.filter(user => user.id !== action.payload.userId);
          newActiveUsers.push({...userInOffline, status: 'online'});
        } else if (userInActive) {
          newActiveUsers = newActiveUsers.map(user =>
            user.id === action.payload.userId ? {...user, status: 'online'} : user
          );
        }
      } else {
        // Jeśli użytkownik jest offline, przenieś go do offline
        if (userInActive) {
          newActiveUsers = newActiveUsers.filter(user => user.id !== action.payload.userId);
          newOfflineUsers.push({...userInActive, status: 'offline'});
        } else if (userInOffline) {
          newOfflineUsers = newOfflineUsers.map(user =>
            user.id === action.payload.userId ? {...user, status: 'offline'} : user
          );
        }
      }

      return {
        ...state,
        activeUsers: newActiveUsers,
        offlineUsers: newOfflineUsers
      };
    default:
      return state;
  }
};

const RightSidebar = ({settingHandler, seeProfileHandler, sendMessageHandler, callHandler, onLogout}) => {
  const navigate = useNavigate();
  
  // Bezpieczne pobieranie danych użytkownika
  const getUserFromLocalStorage = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  // Inicjalizacja stanu z bezpiecznym parsowaniem
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    userProfile: {
      ...initialState.userProfile,
      ...(getUserFromLocalStorage() || {}),
    }
  });
  const menuRef = useRef(null);
  const statusMenuRef = useRef(null);
  const selectedUserRef = useRef(null);
  const userMenuRef = useRef(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateUserStatus = useCallback((userId, isOnline) => {
    console.log('Aktualizacja statusu użytkownika:', userId, isOnline);
    
    dispatch({
      type: 'UPDATE_USER_STATUS',
      payload: {
        userId: userId,
        isOnline: isOnline
      }
    });
  }, [dispatch]);

  useEffect(() => {
    const handleStatusUpdate = (data) => {
      console.log('Otrzymano aktualizację statusu:', data);
      
      // Sprawdź, czy dane zawierają potrzebne informacje
      if (data.user_id && data.is_online !== undefined) {
        console.log('Aktualizuję status dla użytkownika:', data.user_id, data.is_online);
        updateUserStatus(data.user_id, data.is_online);
      }
    };

    // Subskrybuj aktualizacje statusu
    
    const unsubscribe = webSocketService.subscribeToStatus(handleStatusUpdate);
    

    return () => {
      unsubscribe();
    };
  }, [updateUserStatus]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const userStr = localStorage.getItem('user');
        
        if (!userStr) {
          console.log('No user found in localStorage');
          return;
        }

        let user;
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          console.error('Failed to parse user data:', e);
          return;
        }

        if (!user?.id) {
          console.log('No user ID found:', user);
          return;
        }

        const data = await friendsAPI.getFriends(user.id);
        setFriends(data || []);
        dispatch({ type: 'SET_FRIENDS', payload: data || [] });
      } catch (error) {
        console.error('Failed to fetch friends:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  useClickOutside(menuRef, state.isMenuOpen, () => dispatch({ type: 'CLOSE_MENU' }));
  useClickOutside(userMenuRef, state.selectedUser !== null, () => dispatch({ type: 'CLOSE_USER_MENU' }));
  useClickOutside(statusMenuRef, state.userProfile.showStatusMenu, () => dispatch({ type: 'TOGGLE_STATUS_MENU' }));

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && state.isMenuOpen) { // 768px is md breakpoint
        dispatch({ type: 'CLOSE_MENU' });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state.isMenuOpen]);

  // Helper function to get status indicator color
  const getStatusColor = (status) => {
    const statusColors = {
      online: 'bg-green-500',
      idle: 'bg-yellow-500', 
      dnd: 'bg-red-500',
      offline: 'bg-gray-500',
    };
    return statusColors[status] || statusColors.offline;
  };

  // Handle user selection
  const handleUserClick = (user, event) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch({ type: 'SET_SELECTED_USER', payload: user });
  };

  // Handle profile view
  const handleProfileView = (userId) => {
    console.log('Attempting to view profile for user:', userId);
    try {
      // Najpierw zamknij menu
      dispatch({ type: 'CLOSE_USER_MENU' });
      dispatch({ type: 'CLOSE_MENU' });
      
      // Małe opóźnienie przed nawigacją
      setTimeout(() => {
        console.log('Navigating to:', `/profile/${userId}`);
        navigate(`/app/profile/${userId}`);
      }, 100);
      
    } catch (error) {
      console.error('Error navigating to profile:', error);
    }
  };

  // Render user profile status menu
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

  // Render individual user component
  const renderUser = (user) => (
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
        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-discord-sidebar ${getStatusColor(user.status)} shadow-md`} />
      </div>
      <div className="ml-4 flex-1">
        <div className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">{user.username}</div>
        {user.activity && <div className="text-xs text-gray-400 mt-0.5 italic">{user.activity}</div>}
      </div>
      {state.selectedUser?.id === user.id && (
        <div 
          ref={userMenuRef}
          onClick={(e) => e.stopPropagation()}
          className="absolute z-[100]"
        >
          <UserMobileMenu
            user={user} 
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

  // Render user profile
  const renderUserProfile = () => (
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
          <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-discord-sidebar ${getStatusColor(state.userProfile.status)} shadow-md`} />
        </div>
        <div className="ml-4 flex-1">
          <div className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
            {state.userProfile.username}
          </div>
          <div className="text-xs text-gray-400 mt-0.5 italic">{state.userProfile.activity}</div>
        </div>
      </div>
      {state.userProfile.showStatusMenu && renderStatusMenu()}
    </div>
  );

  return (
    <>
      {/* Mobile menu toggle button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dispatch({ type: 'TOGGLE_MENU' });
        }}
        type="button"
        className="fixed right-4 top-4 md:hidden z-50 bg-discord-dark p-2 rounded-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {state.isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${state.isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div ref={menuRef} className={`fixed right-0 top-0 w-72 h-screen bg-discord-sidebar transform transition-transform duration-300 ${state.isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4">
            <div className="bg-discord-dark rounded-lg p-3 shadow-md border border-gray-800 hover:border-gray-700 hover:bg-discord-dark/90 transition-all duration-200 mb-4">
              {renderUserProfile()}
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gray-400 uppercase text-xs font-bold tracking-wider">Active Friends — {state.activeUsers.length}</h2>
            </div>
            <div className="space-y-2">{state.activeUsers.map(renderUser)}</div>
            <h2 className="text-gray-400 uppercase text-xs font-bold mt-6 mb-2 tracking-wider">Offline — {state.offlineUsers.length}</h2>
            <div className="space-y-2">{state.offlineUsers.map(renderUser)}</div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="fixed right-0 top-0 w-0 h-screen bg-discord-sidebar border-l border-gray-800 transition-all duration-300 md:w-72">
        <div className="p-4">
          <div className="bg-discord-dark rounded-lg p-3 shadow-md border border-gray-800 hover:border-gray-700 hover:bg-discord-dark/90 transition-all duration-200 mb-4">
            {renderUserProfile()}
          </div>
          <h2 className="text-gray-400 uppercase text-xs font-bold mb-4 tracking-wider">Active Friends — {state.activeUsers.length}</h2>
          <div className="space-y-2">{state.activeUsers.map(renderUser)}</div>
          <h2 className="text-gray-400 uppercase text-xs font-bold mt-6 mb-2 tracking-wider">Offline — {state.offlineUsers.length}</h2>
          <div className="space-y-2">{state.offlineUsers.map(renderUser)}</div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
