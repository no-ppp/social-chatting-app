// Chat.jsx
const Chat = ({ messages = [], isFixed }) => {
    return (
        <div className={`${isFixed ? 'fixed inset-0' : 'relative'} lg:ml-[300px] md:mr-[290px] ml-[50px] flex flex-col bg-discord-gray-light`}>
            <div className="flex justify-between items-center p-4">
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-auto p-4 space-y-4 scrollbar scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500 transition-colors duration-200">
                {messages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-4 hover:bg-gray-700/30 p-2 rounded-lg min-w-max md:min-w-0">
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm md:text-lg">
                            {message.user?.[0] || '?'}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-baseline space-x-2">
                                <span className="text-white font-semibold text-base md:text-lg">{message.user}</span>
                                <span className="text-gray-400 text-xs md:text-sm">{message.timestamp}</span>
                            </div>
                            <p className="text-gray-300 mt-1 text-sm md:text-base break-words max-w-[200px] md:max-w-none">{message.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-3 md:p-6 border-t border-gray-700">
                <div className="flex items-center space-x-2 md:space-x-3">
                    <button className="p-2 md:p-3 text-gray-400 hover:text-white" aria-label="Add attachment">
                        <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder="Napisz wiadomość..."
                        className="flex-1 bg-gray-700 text-white rounded-lg px-3 md:px-5 py-2 md:py-3 text-sm md:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Message input"
                    />
                    <button className="p-2 md:p-3 text-gray-400 hover:text-white" aria-label="Add emoji">
                        <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <button className="p-2 md:p-3 text-gray-400 hover:text-white" aria-label="Add image">
                        <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;