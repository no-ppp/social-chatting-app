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

const LeftSidebar = ({channelHandler, serverHandler, editServerHandler, joinServerHandler}) => {
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

      <div className="relative z-50 bg-discord-dark w-16 flex flex-col items-center shadow-lg">
        <ServerSidebar 
          serverHandler={serverHandler}
          editServerHandler={editServerHandler}
          joinServerHandler={joinServerHandler}
          channelList={
            <button 
              className="w-12 h-12 rounded-[24px] bg-discord-gray hover:bg-discord-blue hover:rounded-[16px] cursor-pointer relative group flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Toggle Channels"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={2}
              >
                {state.isChannelsVisible ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                )}
              </svg>
            </button>
          } 
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