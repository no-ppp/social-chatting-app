const MobileUserMenu = ({ user, position, seeProfileHandler, sendMessageHandler, callHandler }) => (
  <div className="absolute z-50 bg-discord-dark rounded-lg shadow-lg py-2 w-48 user-menu" style={{ top: position.y, left: position.x }}>
    <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors" onClick={seeProfileHandler}
    type="button"
    data-close-button >
      Zobacz profil
    </button>
    
        <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors" onClick={sendMessageHandler} 
        type="button"
        data-close-button 
        >
          Wyślij wiadomość
        </button>
        {user.status !== 'offline' && user.friend && (
      <>
        <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors" 
        onClick={callHandler}
        type="button"
        data-close-button >
          Zadzwoń
        </button>
      </>
    )}
  </div>
);

export default MobileUserMenu;
