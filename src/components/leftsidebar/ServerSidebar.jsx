import React, { useReducer, useRef } from 'react';
import SearchBar from '../features/SearchBar';
import useClickOutside from '../../hooks/useClickOutside';
import Notifications from '../features/Notifications';
const ACTIONS = {
  SELECT_SERVER: 'select_server',
  TOGGLE_OWN_SERVER_OPTIONS: 'toggle_own_server_options'
};

const initialState = {
  selectedServer: null,
  showOwnServerOptions: false,
  ownServer: {
    name: 'Mój Serwer',
    description: 'Twój własny serwer Discord'
  }
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SELECT_SERVER:
      return {
        ...state,
        selectedServer: action.payload,
        showOwnServerOptions: false
      };
    case ACTIONS.TOGGLE_OWN_SERVER_OPTIONS:
      return {
        ...state,
        showOwnServerOptions: !state.showOwnServerOptions
      };
    default:
      return state;
  }
}

const ServerSidebar = ({channelList, serverHandler, onClick, editServerHandler, joinServerHandler}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const optionsRef = useRef(null);

  useClickOutside(optionsRef, state.showOwnServerOptions, () => {
    dispatch({ type: ACTIONS.TOGGLE_OWN_SERVER_OPTIONS });
  });

  // Sample server data - will be replaced with real data from backend
  const servers = [
    { id: 1, name: 'Server 1', description: 'First server' },
    { id: 2, name: 'Server 2', description: 'Second server' },
    { id: 3, name: 'Server 3', description: 'Third server' }
  ];

  // Handle server selection
  const handleServerClick = (serverId) => {
    dispatch({ type: ACTIONS.SELECT_SERVER, payload: serverId });
    serverHandler(serverId);
  };

  return (
    <div className="bg-discord-dark w-16 flex flex-col items-center py-3 h-full">
      {/* Server list */}
      <div className="flex flex-col items-center space-y-5">
        {servers.map(server => (
          <div 
            key={server.id}
            className={`w-12 h-12 ${state.selectedServer === server.id ? 'rounded-[16px]' : 'rounded-[24px]'} bg-discord-gray hover:bg-discord-blue hover:rounded-[16px] cursor-pointer relative group flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl`}
            onClick={() => handleServerClick(server.id)}
          >
            {/* Server initial letter */}
            <span className="text-white font-medium text-lg">
              {server.name.charAt(0)}
            </span>
            
            {/* Selected server indicator */}
            <div className={`absolute left-0 w-1 ${state.selectedServer === server.id ? 'h-[20px]' : 'h-0'} group-hover:h-[20px] bg-white rounded-r-full transition-all duration-200`} />
            
            {/* Server tooltip */}
            <div className="absolute left-full ml-3 p-2 bg-black rounded-md text-white text-sm w-48 
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
              <p className="font-bold mb-1">{server.name}</p>
              <p className="text-gray-300 text-xs">{server.description}</p>
            </div>
          </div>
        ))}

        {/* Add server button with separator */}
        <div className="w-8 h-[2px] bg-discord-gray/50 rounded-full" />
        <div 
          className={`w-12 h-12 ${state.selectedServer === 'own' ? 'rounded-[16px]' : 'rounded-[24px]'} bg-discord-gray hover:bg-discord-green hover:rounded-[16px] cursor-pointer relative group flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl`}
          onClick={() => dispatch({ type: ACTIONS.TOGGLE_OWN_SERVER_OPTIONS })}
        >
          <span className="text-discord-green group-hover:text-white text-2xl font-medium">+</span>
          
          {/* Selected server indicator */}
          <div className={`absolute left-0 w-1 ${state.selectedServer === 'own' ? 'h-[20px]' : 'h-0'} group-hover:h-[20px] bg-white rounded-r-full transition-all duration-200`} />
          
          {/* Server options menu */}
          <div 
            ref={optionsRef}
            className={`absolute left-full ml-3 p-2 bg-black rounded-md text-white text-sm w-48 
            ${state.showOwnServerOptions ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all duration-200 z-50 shadow-xl`}
          >
            <div 
              className="w-full text-left px-2 py-1 hover:bg-discord-gray/30 rounded transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: ACTIONS.SELECT_SERVER, payload: 'own' });
                editServerHandler();
              }}
            >
              Edytuj serwer
            </div>
            <div 
              className="w-full text-left px-2 py-1 hover:bg-discord-gray/30 rounded transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: ACTIONS.SELECT_SERVER, payload: 'own' });
                joinServerHandler();
              }}
            >
              Wejdź na serwer
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-5 mt-auto mb-3">
        {/* <Notifications /> */}

        <div className="w-12 h-12 mt-3 rounded-[24px] bg-discord-gray hover:bg-discord-blue hover:rounded-[16px] cursor-pointer relative group flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl">
          <SearchBar />
          <div className="absolute left-0 w-1 h-0 group-hover:h-[20px] bg-white rounded-r-full transition-all duration-200" />
          {/* Search tooltip */}
          <div className="absolute left-full ml-3 p-2 bg-black rounded-md text-white text-sm w-48 
            opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
            <p className="font-bold mb-1">Szukaj</p>
            <p className="text-gray-300 text-xs">Znajdź znajomego lub serwer</p>
          </div>
        </div>

        {/* Mobile channel toggle button - only visible on small screens */}
        <div 
          onClick={onClick}
          className="w-12 h-12 mt-3 rounded-[24px] bg-discord-gray hover:bg-discord-blue hover:rounded-[16px] cursor-pointer relative group flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl md:hidden"
        >
          {channelList}
          <div className="absolute left-0 w-1 h-0 group-hover:h-[20px] bg-white rounded-r-full transition-all duration-200" />
        </div>
      </div>
    </div>
  );
};

export default ServerSidebar;