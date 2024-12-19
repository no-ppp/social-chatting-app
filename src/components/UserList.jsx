import UserItem from './UserItem';

const UserList = ({ users, onUserClick, selectedUser, getStatusColor }) => (
  <div className="space-y-2">
    {users.map(user => (
      <UserItem 
        key={user.id} 
        user={user} 
        onClick={(e) => onUserClick(user, e)} 
        isSelected={selectedUser?.id === user.id} 
        getStatusColor={getStatusColor}
      />
    ))}
  </div>
);

export default UserList;
