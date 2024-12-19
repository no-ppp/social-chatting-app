import React from 'react';

const ServerSidebar = () => {
  // Przykładowe dane serwerów
  const servers = [
    { id: 1, name: 'Serwer 1' },
    { id: 2, name: 'Serwer 2' },
    { id: 3, name: 'Serwer 3' }
  ];

  return (
    <div className="bg-gray-800 w-16 flex flex-col">
      {/* Lista serwerów */}
      {servers.map(server => (
        <div 
          key={server.id}
          className="p-2 hover:bg-gray-700 cursor-pointer"
        >
          {server.name}
        </div>
      ))}
    </div>
  );
};

export default ServerSidebar; 