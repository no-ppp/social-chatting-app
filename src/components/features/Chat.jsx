import { useReducer, useEffect, useRef} from 'react';
import EmojiPicker from './EmojiComponent'
import GifPicker from 'gif-picker-react'
import UserMenu from '../rightsidebar/UserMobileMenu'
import useClickOutside from '../../hooks/useClickOutside';

// Define action types
const ACTIONS = {
    SET_MESSAGE: 'SET_MESSAGE',
    TOGGLE_GIF_PICKER: 'TOGGLE_GIF_PICKER',
    TOGGLE_LIKE: 'TOGGLE_LIKE',
    ADD_EMOJI: 'ADD_EMOJI',
    SELECT_GIF: 'SELECT_GIF',
    OPEN_USER_MENU: 'OPEN_USER_MENU',
    CLOSE_USER_MENU: 'CLOSE_USER_MENU'
}

// Initial state
const initialState = {
    messageInput: '',
    isGifPickerOpen: false,
    likedMessages: new Set(),
    userMenuPosition: null,
    selectedUser: null
}

// Reducer function to handle state updates
const chatReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_MESSAGE:
            return {
                ...state,
                messageInput: action.payload
            }
        case ACTIONS.TOGGLE_GIF_PICKER:
            return {
                ...state,
                isGifPickerOpen: !state.isGifPickerOpen
            }
        case ACTIONS.TOGGLE_LIKE:
            const newLiked = new Set(state.likedMessages)
            if (newLiked.has(action.payload)) {
                newLiked.delete(action.payload)
            } else {
                newLiked.add(action.payload)
            }
            return {
                ...state,
                likedMessages: newLiked
            }
        case ACTIONS.ADD_EMOJI:
            return {
                ...state,
                messageInput: state.messageInput + action.payload
            }
        case ACTIONS.SELECT_GIF:
            return {
                ...state,
                isGifPickerOpen: false
            }
        case ACTIONS.OPEN_USER_MENU:    
        return {
                ...state,
                userMenuPosition: action.payload.position,
                selectedUser: action.payload.user
            }
        case ACTIONS.CLOSE_USER_MENU:
            return {
                ...state,
                userMenuPosition: null,
                selectedUser: null
            }
        default:
            return state
    }
}

const Chat = ({ messages = [], isFriendChat = false, isUserMenu = true }) => {
    // Initialize reducer with initial state
    const [state, dispatch] = useReducer(chatReducer, initialState)
    
    // Refs for click outside detection
    const userMenuRef = useRef(null);
    const gifPickerRef = useRef(null);

    // Use custom hook for handling clicks outside
    useClickOutside(userMenuRef, !!state.userMenuPosition, () => {
        dispatch({ type: ACTIONS.CLOSE_USER_MENU });
    });

    useClickOutside(gifPickerRef, state.isGifPickerOpen, () => {
        dispatch({ type: ACTIONS.TOGGLE_GIF_PICKER });
    });

    // Handler functions that dispatch actions
    const handleEmojiSelect = (emoji) => {
        dispatch({ type: ACTIONS.ADD_EMOJI, payload: emoji })
    }

    const handleGifSelect = (gif) => {
        console.log('Selected GIF:', gif)
        dispatch({ type: ACTIONS.SELECT_GIF })
    }

    const handleLike = (messageId) => {
        dispatch({ type: ACTIONS.TOGGLE_LIKE, payload: messageId })
    }

    const handleAvatarClick = (e, user) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        if (isUserMenu) {
        dispatch({ 
            type: ACTIONS.OPEN_USER_MENU, 
            payload: {
                position: { x: 0, y: rect.bottom },
                user
            }
        })};
    }

    return (
        //Think about this, this mt-80 isnt best approach but it works for now 
        //Maybe we should lift this and create a new component for friend chat
        <div className={`${isFriendChat ? 'mt-80' : ''} fixed inset-0 lg:ml-[300px] md:mr-[290px] ml-[50px] flex flex-col bg-discord-gray-light`}>
            <div className="flex justify-between items-center p-4">
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-auto p-4 space-y-4 scrollbar scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500 transition-colors duration-200">
                {messages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-4 hover:bg-gray-700/30 p-2 rounded-lg">
                        <div 
                            onClick={(e) => handleAvatarClick(e, message.user)}
                            className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm md:text-lg cursor-pointer hover:opacity-80"
                        >
                            {message.user?.[0] || '?'}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-baseline space-x-2">
                                <span className="text-white font-semibold text-base md:text-lg">{message.user}</span>
                                <span className="text-gray-400 text-xs md:text-sm">{message.timestamp}</span>
                            </div>
                            <p className="text-left text-gray-300 mt-1 text-sm md:text-base break-words sm:max-w-[600px] max-w-[330px] ">{message.content}</p>
                            <button 
                                onClick={() => handleLike(message.id)}
                                className={`mt-2 text-sm flex items-center space-x-1 ${state.likedMessages.has(message.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                            >
                                <svg className="w-4 h-4" fill={state.likedMessages.has(message.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span> 1</span> {/*implement like logic there in future*/}
                            </button>
                        </div>
                    </div>
                ))}
                {state.userMenuPosition && state.selectedUser && (
                    <div ref={userMenuRef}>
                        <UserMenu 
                            user={{ name: state.selectedUser, status: 'online' }}
                            position={state.userMenuPosition}
                        />
                    </div>
                )}
            </div>
            
            <div className="p-3 lg:p-6 border-t border-gray-700">
                <div className="flex items-center space-x-2 md:space-x-3 relative">
                    <div className="overflow-hidden">
                        <button 
                            onClick={() => dispatch({ type: ACTIONS.TOGGLE_GIF_PICKER })}
                            className="p-2 md:p-3 text-gray-400 hover:text-white"
                            aria-label="Add GIF"
                        >
                            <svg className="w-5 h-5 md:w-7 md:h-7" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-3h4v-2h-4v2zm0-3h4v-2h-4v2zm0-3h4V9h-4v2z"/>
                            </svg>
                        </button>
                        {state.isGifPickerOpen && (
                            <div ref={gifPickerRef} className="absolute bottom-full left-0 mb-2 z-50">
                                <div className="bg-discord-dark border border-gray-700 rounded-lg shadow-xl">
                                    <GifPicker 
                                        tenorApiKey={import.meta.env.VITE_TENOR_API_KEY}
                                        onGifClick={handleGifSelect}
                                        theme="dark"
                                        width={350}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="p-2 md:p-3 text-gray-400 hover:text-white" aria-label="Add attachment">
                        <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                    <input
                        type="text"
                        value={state.messageInput}
                        onChange={(e) => dispatch({ type: ACTIONS.SET_MESSAGE, payload: e.target.value })}
                        placeholder="Napisz wiadomość..."
                        className="flex-1 bg-gray-700 text-white rounded-lg px-3 lg:px-5 py-2 md:py-3 text-sm md:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Message input"
                    />
                    <button className="p-2 md:p-3 text-gray-400 hover:text-white" aria-label="Add emoji">
                        <EmojiPicker onSelect={handleEmojiSelect} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;