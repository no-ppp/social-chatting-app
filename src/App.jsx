import LeftSidebar from './components/leftsidebar/LeftSidebar'
import RightSidebar from './components/rightsidebar/RightSidebar'
import ServerContentDashboard from './components/content/ServerContentDashboard'
import ChannelContentDashboard from './components/content/ChannelContentDashboard'
import Chat from './components/features/Chat'
import ProfileEditDashboard from './components/profile/ProfileEditDashboard'
import ProfileDashboard from './components/profile/ProfileDashboard'
import FriendChat from './components/features/FriendChat'
import './App.css'

function App() {
  return (
    <>
      <LeftSidebar />
      <FriendChat/>
      <RightSidebar />
    </>
  )
}

export default App
