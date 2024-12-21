import LeftSidebar from './components/leftsidebar/LeftSidebar'
import RightSidebar from './components/rightsidebar/RightSidebar'
import ServerContentDashboard from './components/content/ServerContentDashboard'
import ChannelContentDashboard from './components/content/ChannelContentDashboard'
import Chat from './components/features/Chat'
import ProfileEditDashboard from './components/profile/ProfileEditDashboard'
import ProfileDashboard from './components/profile/ProfileDashboard'
import FriendChat from './components/features/FriendChat'
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
      content: "Wszystko w porządku, właśnie kończę projekt. A u Ciebie?",
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

function App() {
  return (
    <>
      <LeftSidebar />
      <FriendChat messages={messages}/>
      <RightSidebar />
    </>
  )
}

export default App
