// discord-clone/src/components/UserItem.jsx
import UserMenu from './UserMenu'; // Upewnij się, że masz ten komponent

const UserItem = ({ user, onClick, isSelected, getStatusColor }) => (
  <div 
    className="relative flex items-center p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer group transition-all duration-200"
    onClick={onClick}
  >
    <div className="relative">
      <div className="w-10 h-10 bg-discord-dark rounded-full flex items-center justify-center text-lg font-medium shadow-lg">
        {user.name.charAt(0)}
      </div>
      <div 
        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-discord-sidebar ${getStatusColor(user.status)} shadow-md`} 
      />
    </div>
    
    <div className="ml-4 flex-1">
      <div className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
        {user.name}
      </div>
      {user.activity && (
        <div className="text-xs text-gray-400 mt-0.5 italic">
          {user.activity}
        </div>
      )}
    </div>
    {isSelected && (
      <UserMenu user={user} position={{ x: 0, y: '100%' }} />
    )}
  </div>
);

export default UserItem;