import React, { useState } from 'react';

const ServerSidebar = ({channelList, serverHandler, onClick}) => {
  // Track which server is currently selected
  const [selectedServer, setSelectedServer] = useState(null);

  // Sample server data - will be replaced with real data from backend
  const servers = [
    { id: 1, name: 'Server 1', description: 'First server' },
    { id: 2, name: 'Server 2', description: 'Second server' },
    { id: 3, name: 'Server 3', description: 'Third server' }
  ];

  // Handle server selection
  const handleServerClick = (serverId) => {
    setSelectedServer(serverId);
    serverHandler(serverId);
  };

  return (
    <div className="bg-discord-dark w-16 flex flex-col items-center py-3 h-full">
      {/* Server list */}
      <div className="flex flex-col items-center space-y-5">
        {servers.map(server => (
          <div 
            key={server.id}
            className={`w-12 h-12 ${selectedServer === server.id ? 'rounded-[16px]' : 'rounded-[24px]'} bg-discord-gray hover:bg-discord-blue hover:rounded-[16px] cursor-pointer relative group flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl`}
            onClick={() => handleServerClick(server.id)}
          >
            {/* Server initial letter */}
            <span className="text-white font-medium text-lg">
              {server.name.charAt(0)}
            </span>
            
            {/* Selected server indicator */}
            <div className={`absolute left-0 w-1 ${selectedServer === server.id ? 'h-[20px]' : 'h-0'} group-hover:h-[20px] bg-white rounded-r-full transition-all duration-200`} />
            
            {/* Server tooltip */}
            <div className="absolute left-full ml-3 p-2 bg-black rounded-md text-white text-sm w-48 
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
              <p className="font-bold mb-1">{server.name}</p>
              <p className="text-gray-300 text-xs">{server.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile channel toggle button */}
      <div className="mt-auto mb-3 lg:hidden">
        <div 
          onClick={onClick}
          className="w-12 h-12 rounded-[24px] bg-discord-gray hover:bg-discord-blue hover:rounded-[16px] cursor-pointer relative group flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {channelList}
          <div className="absolute left-0 w-1 h-0 group-hover:h-[20px] bg-white rounded-r-full transition-all duration-200" />
        </div>
      </div>
    </div>
  );
};

export default ServerSidebar;