import { useState } from 'react';
import ServerSidebar from './ServerSidebar';
import ChannelSidebar from './ChannelSidebar';

const Sidebar = () => {
  const [isChannelsVisible, setChannelsVisible] = useState(false);

  return (
    <div className="fixed left-0 top-0 flex h-screen">
      <ServerSidebar />
      
      <div className={`transition-transform duration-300 ${isChannelsVisible ? 'block' : 'hidden'} sm:block`}>
        <ChannelSidebar />
      </div>

      <button 
        className="fixed bottom-4 left-4 bg-discord-dark rounded-full p-2 text-white sm:hidden"
        onClick={() => setChannelsVisible(!isChannelsVisible)}
      >
        {isChannelsVisible ? '🔼' : '🔽'}
      </button>
    </div>
  );
};

export default Sidebar;
