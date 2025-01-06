import React, { useReducer, useRef } from 'react';
import useClickOutside from '../../hooks/useClickOutside';

const ACTIONS = {
  TOGGLE_OPEN: 'TOGGLE_OPEN',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY', 
  SET_SEARCH_TYPE: 'SET_SEARCH_TYPE',
  RESET_SEARCH: 'RESET_SEARCH',
  CLOSE_SEARCH: 'CLOSE_SEARCH'
};

const initialState = {
  isOpen: false,
  searchQuery: '',
  searchType: null
};

const searchReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE_OPEN:
      return { ...state, isOpen: !state.isOpen };
    case ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case ACTIONS.SET_SEARCH_TYPE:
      return { ...state, searchType: action.payload };
    case ACTIONS.RESET_SEARCH:
      return { ...state, searchType: null, searchQuery: '' };
    case ACTIONS.CLOSE_SEARCH:
      return initialState;
    default:
      return state;
  }
};

const SearchBar = () => {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const searchRef = useRef(null);

  useClickOutside(searchRef, state.isOpen, () => {
    dispatch({ type: ACTIONS.CLOSE_SEARCH });
  });

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
                onChange={(e) => dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: e.target.value })}
                placeholder={state.searchType === 'friend' ? "Szukaj znajomego..." : "Szukaj serwera..."}
                className="w-full bg-discord-gray text-white placeholder-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-discord-gray"
              />
              {state.searchQuery && (
                <button
                  onClick={() => dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: '' })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              <div className="text-gray-400 text-sm py-2">
                Brak wyników wyszukiwania
              </div>
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
