import Chat from './Chat'
import { useState, useEffect } from 'react'

const testMessages = [
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
    }
];

const FriendChat = ({ friend, messages = testMessages }) => {
    const [isCalling, setIsCalling] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const [callDuration, setCallDuration] = useState(0);

    useEffect(() => {
        let timer;
        if (isCallActive) {
            timer = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isCallActive]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleCall = () => {
        if (!isCallActive) {
            setIsCalling(true);
            setTimeout(() => {
                setIsCalling(false);
                setIsCallActive(true);
                setCallDuration(0);
            }, 2000);
        } else {
            setIsCallActive(false);
            setCallDuration(0);
        }
    };
    {/*TODO: add user avatar make a pulse border add sound to the call refactor it to reducer*/}
    return (
        <div className="-mt-5 md:bg-gray-900 md:p-2">
            <div className={`items-center p-4 border-4 rounded-lg ${isCallActive ? 'border-green-500' : 'border-discord-blue'} border-gray-700 lg:ml-[300px] md:mr-[290px] ml-[50px] bg-discord-dark`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center relative">
                        <img src="" alt="User 1" className={`w-40 h-40 rounded-full border-4 ${isCallActive ? 'border-green-500' : 'border-discord-blue hover:border-discord-blue-hover'} transition-colors`}/>
                        <img src="" alt="User 2" className={`w-40 h-40 rounded-full border-4 ${isCallActive ? 'border-green-500' : 'border-discord-blue hover:border-discord-blue-hover'} transition-colors -ml-4`}/>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-white text-xl font-semibold">Czat z użytkownikiem</p>
                        <button 
                            onClick={handleCall}
                            disabled={isCalling}
                            className={`p-2 rounded-full ${isCallActive ? 'bg-red-500 hover:bg-red-600' : isCalling ? 'bg-green-500 animate-pulse' : 'bg-discord-blue hover:bg-discord-blue-hover'} transition-colors`} 
                            aria-label={isCallActive ? "Zakończ rozmowę" : "Rozpocznij rozmowę głosową"}
                        >
                            <svg className={`w-6 h-6 text-white ${isCalling ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </button>
                    </div>
                    {isCalling && (
                        <div className="text-green-500 animate-pulse">
                            Calling...
                        </div>
                    )}
                    {isCallActive && (
                        <div className="text-green-500">
                            Call in progress: {formatTime(callDuration)}
                        </div>
                    )}
                </div>
            </div>
            <Chat messages={messages} isUserChat={true} isFriendChat={true} isUserMenu={false} />
        </div>
    )
}

export default FriendChat