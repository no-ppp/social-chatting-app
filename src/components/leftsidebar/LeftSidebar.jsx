import { useReducer, useEffect } from 'react';
import ServerSidebar from './ServerSidebar';
import ChannelSidebar from './ChannelSidebar';

const initialState = {
  isChannelsVisible: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_CHANNELS':
      return { ...state, isChannelsVisible: !state.isChannelsVisible };
    case 'CLOSE_CHANNELS':
      return { ...state, isChannelsVisible: false };
    default:
      return state;
  }
};

const LeftSidebar = ({channelHandler, serverHandler}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleClickOutside = (event) => {
    if (state.isChannelsVisible && !event.target.closest('.left-sidebar')) {
      dispatch({ type: 'CLOSE_CHANNELS' });
    }
  };


  return (
    <div className="fixed left-0 top-0 flex h-screen z-50 left-sidebar">
      
      <div 
        className={`
          fixed inset-0 bg-black/50 transition-opacity duration-300 lg:hidden
          ${state.isChannelsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `} 
        onClick={() => dispatch({ type: 'CLOSE_CHANNELS' })} 
      />

      <div className="relative z-50 bg-discord-dark w-16 flex flex-col">
        <ServerSidebar 
        serverHandler={serverHandler}
          serverList={state.isChannelsVisible ? '🔼' : '🔽'} 
          onClick={() => dispatch({ type: 'TOGGLE_CHANNELS' })}
        />
        
      </div>
      

      <div 
        className={`
          absolute top-0 h-full transform transition-transform duration-300 lg:relative lg:translate-x-0
          ${state.isChannelsVisible ? 'translate-x-0' : '-translate-x-full'}
          hidden lg:block
        `}
      >
        <ChannelSidebar 
        channelHandler={channelHandler}
        />
      </div>

      <div 
        className={`
          absolute left-16 top-0 h-full transform transition-transform duration-300 lg:hidden
          ${state.isChannelsVisible ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <ChannelSidebar 
        channelHandler={channelHandler}/>
      </div>
      

      
    </div>
  );
};

export default LeftSidebar;