const MobileUserMenu = ({ user, position, seeProfileHandler, sendMessageHandler, callHandler }) => (
  <div className="absolute z-50 bg-discord-dark rounded-lg shadow-lg py-2 w-48 user-menu" style={{ top: position.y, left: position.x }}>
    <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors" onClick={seeProfileHandler}>
      Zobacz profil
    </button>
    
        <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors" onClick={sendMessageHandler}>
          Wyślij wiadomość
        </button>
        {user.status !== 'offline' && user.friend && (
      <>
        <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors" onClick={callHandler}>
          Zadzwoń
        </button>
      </>
    )}
  </div>
);

export default MobileUserMenu;
