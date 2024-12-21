import React from 'react';

const ServerSidebar = ({serverList, onClick}) => {
  // Przykładowe dane serwerów
  const servers = [
    { id: 1, name: 'Serwer 1', description: 'Pierwszy serwer' },
    { id: 2, name: 'Serwer 2', description: 'Drugi serwer' },
    { id: 3, name: 'Serwer 3', description: 'Trzeci serwer' }
  ];

  return (
    <div className="bg-discord-dark w-16 flex flex-col">
      {/* Lista serwerów */}
      {servers.map(server => (
        <div 
          key={server.id}
          className="p-2 hover:bg-gray-700 cursor-pointer relative group"
        >
          {server.name}
          {/* Tooltip z informacjami o serwerze */}
          <div className="absolute left-full ml-2 p-2 bg-discord-dark rounded-md text-white text-sm w-48 
            opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <p className="font-bold mb-1">{server.name}</p>
            <p className="text-gray-300 text-xs">{server.description}</p>
          </div>
        </div>
      ))}
      <button onClick={onClick} className="absolute bottom-0 left-0 lg:hidden">{serverList}</button>
    </div>
  );
};

export default ServerSidebar;