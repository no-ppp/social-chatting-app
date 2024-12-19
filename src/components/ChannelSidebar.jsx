import React from 'react';

const ChannelSidebar = () => {
  // Przykładowe dane kanałów
  const channels = [
    { id: 1, name: 'Kanał 1' },
    { id: 2, name: 'Kanał 2' },
    { id: 3, name: 'Kanał 3' }
  ];

  return (
    <div className="bg-discord-sidebar w-60 h-full transition-transform duration-300 shadow-lg rounded-lg border border-gray-800">
      <h2 className="text-white text-lg font-bold p-4 border-b border-gray-700 shadow-md">Kanały</h2>
      {/* Lista kanałów */}
      {channels.map(channel => (
        <div 
          key={channel.id}
          className="p-3 hover:bg-gray-600 cursor-pointer transition-colors duration-200 rounded-md flex items-center"
        >
          <span className="text-gray-300">{channel.name}</span>
          <span className="ml-auto text-gray-500 text-sm">#</span>
        </div>
      ))}
    </div>
  );
};

export default ChannelSidebar; 