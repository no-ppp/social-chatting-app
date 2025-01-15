import { useState, useEffect } from 'react';
import { friendsAPI } from '../../api/friends';

const useFetchFriends = (dispatch) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                setLoading(true);
                const userStr = localStorage.getItem('user');
                
                if (!userStr) {
                    console.log('No user found in localStorage');
                    return;
                }

                let user;
                try {
                    user = JSON.parse(userStr);
                } catch (e) {
                    console.error('Failed to parse user data:', e);
                    return;
                }

                if (!user?.id) {
                    console.log('No user ID found:', user);
                    return;
                }

                const data = await friendsAPI.getFriends(user.id);
                dispatch({ type: 'SET_FRIENDS', payload: data || [] });
            } catch (error) {
                console.error('Failed to fetch friends:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [dispatch]);

    return { loading, error };
};

export default useFetchFriends;