import React, { useReducer, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useClickOutside from '../../hooks/useClickOutside';
import { usersAPI } from '../../api/users';

const ACTIONS = {
  TOGGLE_OPEN: 'TOGGLE_OPEN',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SEARCH_TYPE: 'SET_SEARCH_TYPE',
  SET_ALL_USERS: 'SET_ALL_USERS',
  SET_FILTERED_USERS: 'SET_FILTERED_USERS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET_SEARCH: 'RESET_SEARCH',
  CLOSE_SEARCH: 'CLOSE_SEARCH'
};

const initialState = {
  isOpen: false,
  searchQuery: '',
  searchType: null,
  allUsers: [],
  filteredUsers: [],
  isLoading: false,
  error: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE_OPEN:
      return { ...state, isOpen: !state.isOpen };
    case ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case ACTIONS.SET_SEARCH_TYPE:
      return { ...state, searchType: action.payload };
    case ACTIONS.SET_ALL_USERS:
      return { ...state, allUsers: action.payload, isLoading: false };
    case ACTIONS.SET_FILTERED_USERS:
      return { ...state, filteredUsers: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: true, error: null };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ACTIONS.RESET_SEARCH:
      return { ...state, searchType: null, searchQuery: '', filteredUsers: [] };
    case ACTIONS.CLOSE_SEARCH:
      return initialState;
    default:
      return state;
  }
};

const SearchBar = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useClickOutside(searchRef, state.isOpen, () => {
    dispatch({ type: ACTIONS.CLOSE_SEARCH });
  });

  useEffect(() => {
    const fetchUsers = async () => {
      if (state.isOpen && state.searchType === 'friend' && state.allUsers.length === 0) {
        dispatch({ type: ACTIONS.SET_LOADING });
        try {
          const users = await usersAPI.getAllUsers();
          if (Array.isArray(users)) {
            dispatch({ type: ACTIONS.SET_ALL_USERS, payload: users });
          } else {
            throw new Error('Invalid response format');
          }
        } catch (error) {
          dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        }
      }
    };

    fetchUsers();
  }, [state.isOpen, state.searchType]);

  useEffect(() => {
    if (!state.searchQuery || !Array.isArray(state.allUsers)) {
      dispatch({ type: ACTIONS.SET_FILTERED_USERS, payload: [] });
      return;
    }

    const query = state.searchQuery.toLowerCase();
    const filteredUsers = state.allUsers.filter(user => {
      if (!user || typeof user !== 'object') return false;
      
      const username = String(user.username || '').toLowerCase();
      const email = String(user.email || '').toLowerCase();
      
      return username.includes(query) || email.includes(query);
    });

    dispatch({ type: ACTIONS.SET_FILTERED_USERS, payload: filteredUsers });
  }, [state.searchQuery, state.allUsers]);

  const handleUserClick = async (userId) => {
    try {
      dispatch({ type: ACTIONS.CLOSE_SEARCH });
      navigate(`/app/profile/${userId}`);
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => dispatch({ type: ACTIONS.TOGGLE_OPEN })}
        className="p-2 rounded-full hover:bg-discord-gray transition-colors duration-200"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          fill="none" 
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {state.isOpen && !state.searchType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div ref={searchRef} className="bg-discord-dark w-full max-w-md mx-4 rounded-lg shadow-lg border border-gray-700 p-4">
            <h3 className="text-white text-lg font-semibold mb-4 text-center">Co chcesz wyszukać?</h3>
            <div className="flex gap-4">
              <button
                onClick={() => dispatch({ type: ACTIONS.SET_SEARCH_TYPE, payload: 'friend' })}
                className="flex-1 bg-discord-gray text-white py-3 rounded-md hover:bg-gray-600 transition-colors"
              >
                Znajomego
              </button>
              <button
                onClick={() => dispatch({ type: ACTIONS.SET_SEARCH_TYPE, payload: 'server' })}
                className="flex-1 bg-discord-gray text-white py-3 rounded-md hover:bg-gray-600 transition-colors"
              >
                Serwer
              </button>
            </div>
          </div>
        </div>
      )}

      {state.isOpen && state.searchType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div ref={searchRef} className="bg-discord-dark w-full max-w-2xl mx-4 rounded-lg shadow-lg border border-gray-700 p-4">
            <div className="relative">
              <input
                type="text"
                value={state.searchQuery}
                onChange={(e) => dispatch({ 
                  type: ACTIONS.SET_SEARCH_QUERY, 
                  payload: e.target.value 
                })}
                placeholder={state.searchType === 'friend' ? "Wyszukaj znajomego..." : "Szukaj serwera..."}
                className="w-full bg-discord-gray text-white placeholder-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-gray"
              />
            </div>
            
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              {state.isLoading ? (
                <div className="text-gray-400 text-sm py-2">Wyszukiwanie...</div>
              ) : state.error ? (
                <div className="text-red-500 text-sm py-2">{state.error}</div>
              ) : state.filteredUsers.length > 0 ? (
                state.filteredUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className="flex items-center gap-3 p-2 hover:bg-discord-gray rounded-md cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-discord-gray flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full" />
                      ) : (
                        <span className="text-white">{user.username && user.username[0]}</span>
                      )}
                    </div>
                    <div>
                      <div className="text-white">{user.username}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </div>
                ))
              ) : state.searchQuery ? (
                <div className="text-gray-400 text-sm py-2">
                  Brak wyników wyszukiwania
                </div>
              ) : null}
            </div>

            <div className="mt-4 flex gap-4">
              <button
                onClick={() => dispatch({ type: ACTIONS.RESET_SEARCH })}
                className="flex-1 bg-discord-gray text-white py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Wróć
              </button>
              <button
                onClick={() => dispatch({ type: ACTIONS.CLOSE_SEARCH })}
                className="flex-1 bg-discord-gray-light text-white py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
