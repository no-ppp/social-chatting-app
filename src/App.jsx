import { useReducer } from 'react'
import LeftSidebar from './components/leftsidebar/LeftSidebar'
import RightSidebar from './components/rightsidebar/RightSidebar'
import ServerContentDashboard from './components/content/ServerContentDashboard'
import Chat from './components/features/Chat'
import ProfileEditDashboard from './components/profile/ProfileEditDashboard'
import ProfileDashboard from './components/profile/ProfileDashboard'
import FriendChat from './components/features/FriendChat'
import ChannelChat from './components/features/ChannelChat'
import './App.css'

const messages = [
  {
      id: 1,
      user: "John Doe",
      content: "Cześć! Co słychać?",
      timestamp: "10:30"
  },
  {
      id: 2, 
      user: "Jane Smith",
      content: "Wszystko w porządku, właśnie kończę projekt. A u Ciebie?",
      timestamp: "10:32"
  },
  {
      id: 3,
      user: "John Doe", 
      content: "Też dobrze! Może spotkamy się na kawę?",
      timestamp: "10:35"
  },
  {
      id: 4,
      user: "Jane Smith",
      content: "Świetny pomysł! O której proponujesz?",
      timestamp: "10:36"
  },
  {
      id: 5,
      user: "John Doe",
      content: "Cześć! Co słychać?",
      timestamp: "10:30"
  },
  {
      id: 6, 
      user: "Jane Smith",
      content: "Wszystko w porządku, właśnie kończę projekt. A u Ciebie asdasdasdas saddasdas?",
      timestamp: "10:32"
  },
  {
      id: 7,
      user: "John Doe", 
      content: "Też dobrze! Może spotkamy się na kawę?",
      timestamp: "10:35"
  },
  {
      id: 8,
      user: "Jane Smith",
      content: "Świetny pomysł! O której proponujesz?",
      timestamp: "10:36"
  },
  {
    id: 9,
    user: "Jane Smith",
    content: "Świetny pomysł! O której proponujesz?",
    timestamp: "10:36"
}
];

const ACTIONS = {
  SHOW_FRIEND_CHAT: 'SHOW_FRIEND_CHAT',
  SHOW_SERVER_CONTENT: 'SHOW_SERVER_CONTENT',
  SHOW_CHANNEL_CONTENT: 'SHOW_CHANNEL_CONTENT',
  SHOW_PROFILE_EDIT: 'SHOW_PROFILE_EDIT',
  SHOW_PROFILE: 'SHOW_PROFILE'
}

const initialState = {
  currentView: 'FRIEND_CHAT',
  messages: messages
}

const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_FRIEND_CHAT:
      return {
        ...state,
        currentView: 'FRIEND_CHAT'
      }
    case ACTIONS.SHOW_SERVER_CONTENT:
      return {
        ...state,
        currentView: 'SERVER_CONTENT'
      }
    case ACTIONS.SHOW_CHANNEL_CONTENT:
      return {
        ...state,
        currentView: 'CHANNEL_CONTENT'
      }
    case ACTIONS.SHOW_PROFILE_EDIT:
      return {
        ...state,
        currentView: 'PROFILE_EDIT'
      }
    case ACTIONS.SHOW_PROFILE:
      return {
        ...state,
        currentView: 'PROFILE'
      }
    default:
      return state
  }
}

{/*TODO: add user avatar make a pulse border add sound to the call refactor it to reducer*/}
{/*TODO: workon doubleclicks there are some errors on gif*/}
{/*TODO: add user menu*/}
{/*TODO: add friend chat*/}
{/*TODO: add server chat*/}
{/*TODO: add channel chat*/}
{/*TODO: add profile edit*/}
{/*TODO: add profile*/}
{/*TODO: add server content*/}
{/*TODO: add channel content*/}
{/*TODO: add some kind of a search bar to look for friends*/}
{/*TODO: move to the backend to dont stack there forever*/}
{/*TODO: implement other things in future*/}
function App() {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const renderContent = () => {
    switch (state.currentView) {
      case 'FRIEND_CHAT':
        return <FriendChat messages={state.messages} />
      case 'SERVER_CONTENT':
        return <ServerContentDashboard />
      case 'CHANNEL_CONTENT':
        return <ChannelChat 
          seeProfileHandler={() => dispatch({ type: ACTIONS.SHOW_PROFILE })}
          sendMessageHandler={() => dispatch({ type: ACTIONS.SHOW_FRIEND_CHAT })}
        />
      case 'PROFILE_EDIT':
        return <ProfileEditDashboard />
      case 'PROFILE':
        return <ProfileDashboard 
          sendMessageHandler={() => dispatch({ type: ACTIONS.SHOW_FRIEND_CHAT })} // will have to work on it with backend so user cant send message if not in friends
          />
      default:
        return <FriendChat messages={state.messages} />
    }
  }

  const handleServerClick = (serverId) => {
    console.log('Server clicked:', serverId); // Debug log
    dispatch({type: ACTIONS.SHOW_SERVER_CONTENT});
  }

  return (
    <>
      <LeftSidebar 
        serverHandler={handleServerClick}
        serverList={state.serverList}
        channelHandler={() => dispatch( { type: ACTIONS.SHOW_CHANNEL_CONTENT })}
      />
      {renderContent()}
      <RightSidebar 
        settingHandler={() => dispatch({ type: ACTIONS.SHOW_PROFILE_EDIT })}
        seeProfileHandler={() => dispatch({ type: ACTIONS.SHOW_PROFILE })}
        sendMessageHandler={() => dispatch({ type: ACTIONS.SHOW_FRIEND_CHAT })} // I leave it in the same dispatch for now
        callHandler={() => dispatch({ type: ACTIONS.SHOW_FRIEND_CHAT })} // when working on backend we will change it to the call handler
      />
    </>
  )
}

export default App
