import React from 'react';

const ChannelSidebar = () => {
  // Przykładowe dane kanałów
  const channels = [
    { id: 1, name: 'Kanał 1', description: 'This is the first channel' },
    { id: 2, name: 'Kanał 2', description: 'This is the second channel' },
    { id: 3, name: 'Kanał 3', description: 'This is the third channel' }
  ];

  return (
    <div className="bg-discord-sidebar w-60 h-full transition-transform duration-300 shadow-lg rounded-lg border border-gray-800">
      <h2 className="text-white text-lg font-bold p-4 border-b border-gray-700 shadow-md">Kanały</h2>
      {/* Lista kanałów */}
      {channels.map(channel => (
        <div 
          key={channel.id}
          className="relative p-3 hover:bg-gray-600 cursor-pointer transition-colors duration-200 rounded-md flex items-center group"
        >
          <span className="text-gray-300">{channel.name}</span>
          <span className="ml-auto text-gray-500 text-sm">#</span>
          
          {/* Tooltip z informacjami o kanale */}
          <div className="absolute left-full ml-2 p-2 bg-discord-dark rounded-md text-white text-sm w-48 
            opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <p className="font-bold mb-1">{channel.name}</p>
            <p className="text-gray-300 text-xs">{channel.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChannelSidebar;