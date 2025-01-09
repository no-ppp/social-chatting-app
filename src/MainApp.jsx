import { useReducer } from 'react'
import { authAPI } from './api/auth'
import LeftSidebar from './components/leftsidebar/LeftSidebar'
import RightSidebar from './components/rightsidebar/RightSidebar'
import ServerContentDashboard from './components/content/ServerContentDashboard'
import ProfileEditDashboard from './components/profile/ProfileEditDashboard'
import ProfileDashboard from './components/profile/ProfileDashboard'
import FriendChat from './components/features/FriendChat'
import ChannelChat from './components/features/ChannelChat'
import CreateServer from './components/features/CreateServer'
import { useNavigate } from 'react-router-dom'

const messages = [
  {
      id: 1,
      user: "John Doe", 
      content: "Cześć! Co słychać?",
      timestamp: "10:30"
  },
];

const ACTIONS = {
  SHOW_FRIEND_CHAT: 'SHOW_FRIEND_CHAT',
  SHOW_SERVER_CONTENT: 'SHOW_SERVER_CONTENT', 
  SHOW_CHANNEL_CONTENT: 'SHOW_CHANNEL_CONTENT',
  SHOW_PROFILE_EDIT: 'SHOW_PROFILE_EDIT',
  SHOW_PROFILE: 'SHOW_PROFILE',
  SHOW_CREATE_SERVER: 'SHOW_CREATE_SERVER',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
}

const initialState = {
  currentView: 'FRIEND_CHAT',
  messages: messages,
  serverList: [],
  isLoggedIn: false,
  user: null,
  showServerContent: false,
  showChannelContent: false,
  showFriendChat: true,
  showProfile: false,
  showProfileEdit: false,
  showCreateServer: false
}

const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_FRIEND_CHAT:
      return {
        ...state,
        currentView: 'FRIEND_CHAT',
        showFriendChat: true,
        showServerContent: false,
        showChannelContent: false,
        showProfile: false,
        showProfileEdit: false,
        showCreateServer: false
      }
    case ACTIONS.SHOW_SERVER_CONTENT:
      return {
        ...state,
        currentView: 'SERVER_CONTENT',
        showServerContent: true,
        showFriendChat: false,
        showChannelContent: false,
        showProfile: false,
        showProfileEdit: false,
        showCreateServer: false
      }
    case ACTIONS.SHOW_CHANNEL_CONTENT:
      return {
        ...state,
        currentView: 'CHANNEL_CONTENT',
        showChannelContent: true,
        showServerContent: false,
        showFriendChat: false,
        showProfile: false,
        showProfileEdit: false,
        showCreateServer: false
      }
    case ACTIONS.SHOW_PROFILE_EDIT:
      return {
        ...state,
        currentView: 'PROFILE_EDIT',
        showProfileEdit: true,
        showProfile: false,
        showServerContent: false,
        showChannelContent: false,
        showFriendChat: false,
        showCreateServer: false
      }
    case ACTIONS.SHOW_PROFILE:
      return {
        ...state,
        currentView: 'PROFILE',
        showProfile: true,
        showProfileEdit: false,
        showServerContent: false,
        showChannelContent: false,
        showFriendChat: false,
        showCreateServer: false
      }
    case ACTIONS.SHOW_CREATE_SERVER:
      return {
        ...state,
        currentView: 'CREATE_SERVER',
        showCreateServer: true,
        showProfile: false,
        showProfileEdit: false,
        showServerContent: false,
        showChannelContent: false,
        showFriendChat: false
      }
    case ACTIONS.LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload
      }
    case ACTIONS.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null
      }
    default:
      return state
  }
}

const MainApp = ({ onLogout }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      <LeftSidebar 
        channelHandler={() => dispatch({ type: ACTIONS.SHOW_CHANNEL_CONTENT })}
        serverHandler={() => dispatch({ type: ACTIONS.SHOW_SERVER_CONTENT })}
      />
      {state.showServerContent && <ServerContentDashboard />}
      {state.showChannelContent && <ChannelChat />}
      {state.showFriendChat && <FriendChat />}
      {state.showProfile && <ProfileDashboard />}
      {state.showProfileEdit && <ProfileEditDashboard />}
      {state.showCreateServer && <CreateServer />}
      <RightSidebar 
        settingHandler={() => dispatch({ type: ACTIONS.SHOW_PROFILE_EDIT })}
        seeProfileHandler={() => dispatch({ type: ACTIONS.SHOW_PROFILE })}
        sendMessageHandler={() => dispatch({ type: ACTIONS.SHOW_FRIEND_CHAT })}
        callHandler={() => dispatch({ type: ACTIONS.SHOW_FRIEND_CHAT })}
        onLogout={handleLogout}
      />
    </>
  )
}

export default MainApp;