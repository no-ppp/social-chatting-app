import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import './App.css'

function App() {
  return (
    <>
      <LeftSidebar />
      <div className="main-content flex-grow p-4 flex flex-col">
        <h1 className="text-white text-2xl font-bold">Witaj w Discord Clone</h1>
        <p className="text-gray-400 mt-2">Tutaj możesz zarządzać swoimi serwerami, kanałami i znajomymi.</p>
      </div>
      <RightSidebar />
    </>
  )
}

export default App
