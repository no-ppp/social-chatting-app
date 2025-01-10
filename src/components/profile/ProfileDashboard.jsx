import { useReducer, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usersAPI } from '../../api/users';
import { friendsAPI } from '../../api/friends';

const API_URL = 'http://127.0.0.1:8000/api';

const initialState = {
    user: null,
    addFriend: false,
    loading: true,
    error: null,
    isFriend: false
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_ADD_FRIEND':
            return { ...state, addFriend: action.payload };
        case 'SET_IS_FRIEND':
            return { ...state, isFriend: action.payload };
        default:
            return state;
    }
}

const ProfileDashboard = () => {
    const { userId } = useParams();
    const [state, dispatch] = useReducer(reducer, initialState);
    const { user, addFriend, loading, error, isFriend } = state;
    const [hasPendingRequest, setHasPendingRequest] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('Current logged in user:', user); // Debug
        if (user) {
            setCurrentUserId(user.id);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            console.log('Starting fetchData with:', { userId, currentUserId });
            
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                
                // Pobierz dane użytkownika
                const userData = await usersAPI.getUserById(userId);
                console.log('Fetched user profile data:', userData);
                dispatch({ type: 'SET_USER', payload: userData });
                
                // Sprawdź czy są znajomymi
                if (userData.friends && userData.friends.some(friend => friend.id === currentUserId)) {
                    dispatch({ type: 'SET_IS_FRIEND', payload: true });
                    return;
                }
                
                // Sprawdź status przyjaźni tylko jeśli nie są znajomymi
                try {
                    console.log('Checking friend request for user:', userId);
                    const response = await fetch(`${API_URL}/users/${userId}/friend-request/`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    console.log('Friend request response:', response);
                    
                    if (response.ok) {
                        const friendRequestData = await response.json();
                        console.log('Friend request data:', friendRequestData);
                        
                        // Sprawdź czy zalogowany użytkownik jest odbiorcą zaproszenia
                        const isReceiver = friendRequestData.receiver.id === currentUserId && 
                                         friendRequestData.status === 'pending';
                        
                        console.log('Friend request status:', {
                            isReceiver,
                            currentUserId,
                            receiverId: friendRequestData.receiver.id,
                            status: friendRequestData.status
                        });
                        
                        setHasPendingRequest(isReceiver);
                    } else {
                        console.log('No friend request found:', response.status);
                        setHasPendingRequest(false);
                    }
                } catch (error) {
                    console.log('Error checking friend request:', error);
                    setHasPendingRequest(false);
                }
                
            } catch (error) {
                console.error('Error in fetchData:', error);
                dispatch({ type: 'SET_ERROR', payload: 'Failed to load user profile' });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        if (userId && currentUserId) {
            console.log('Conditions met, calling fetchData:', { userId, currentUserId });
            fetchData();
        } else {
            console.log('Waiting for userId and currentUserId:', { userId, currentUserId });
        }
    }, [userId, currentUserId]);

    const handleAddFriend = async () => {
        if (!user?.id) return;
        try {
            await friendsAPI.sendFriendRequest(user.id);
            dispatch({ type: 'SET_ADD_FRIEND', payload: true });
        } catch (error) {
            console.error('Failed to send friend request:', error);
        }
    };

    const handleAcceptFriend = async () => {
        try {
            await friendsAPI.acceptFriendRequest(userId);
            setHasPendingRequest(false);
            dispatch({ type: 'SET_IS_FRIEND', payload: true });
        } catch (error) {
            console.error('Failed to accept friend request:', error);
        }
    };

    const handleRejectFriend = async () => {
        try {
            await friendsAPI.rejectFriendRequest(userId);
            setHasPendingRequest(false);
        } catch (error) {
            console.error('Failed to reject friend request:', error);
        }
    };

    if (loading) {
        return (
            <div className="lg:ml-[280px] md:mr-[270px] ml-[40px] p-8 flex flex-col min-h-screen items-center justify-center bg-discord-darker">
                <div className="text-white">Loading profile...</div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="lg:ml-[280px] md:mr-[270px] ml-[40px] p-8 flex flex-col min-h-screen items-center justify-center bg-discord-darker">
                <div className="text-red-500">{error || 'User not found'}</div>
            </div>
        );
    }

    return (
        <div className="flex-1 justify-center items-center lg:ml-[300px] md:mr-[285px] ml-[60px] p-2 bg-discord-darker">
            <div className="w-full bg-discord-dark rounded-lg shadow-xl p-8 overflow-hidden">
                <div className="flex flex-col items-center gap-8 mb-8">
                    <div className="relative group">
                        <img 
                            src={user.avatar || ''} 
                            alt={user.username} 
                            className="border-4 border-discord-blue rounded-full 2xl:h-72 2xl:w-72 h-44 w-44 object-cover"
                        />
                    </div>
                    
                    <div className="flex flex-col items-center xl:items-start">
                        <h1 className="text-white text-3xl font-bold mb-2">{user.username}</h1>
                        <p className="text-discord-blue text-lg mb-1">User ID:</p>
                        <p className="text-gray-400 text-md">{user.id}</p>
                        <div className="flex items-center mt-2">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-gray-300">{user.status || 'Offline'}</span>
                        </div>
                        <p className="text-gray-300">{user.email}</p>
                    </div>
                </div>

                <div className="gap-6 max-w-full">
                    <div className="space-y-4 bg-discord-darker p-6 rounded-lg shadow-inner">
                        {!isFriend && (
                            hasPendingRequest ? (
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                        <p className="text-white text-lg font-sm">Zaproszenie do znajomych</p>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={handleAcceptFriend}
                                                className="px-4 py-2 bg-discord-blue text-white rounded-md hover:bg-discord-blue-hover transition-colors"
                                            >
                                                Akceptuj
                                            </button>
                                            <button 
                                                onClick={handleRejectFriend}
                                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                            >
                                                Odrzuć
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                        <p className="text-white text-lg font-sm">Add to friends</p>
                                        <button 
                                            onClick={handleAddFriend} 
                                            disabled={addFriend}
                                            className={`text-discord-blue hover:text-discord-blue-hover transition-colors ${addFriend ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </button>
                                    </div>
                                    {addFriend && <p className="text-gray-400 text-lg font-sm">Friend request sent</p>}
                                </div>
                            )
                        )}

                        <div className="space-y-2">
                            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                <label className="text-white text-lg font-medium">Bio</label>
                            </div>
                            <div className="w-full bg-gray-700 text-gray-300 p-4 rounded-md break-words">
                                <p>{user.bio || 'No bio available'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDashboard;