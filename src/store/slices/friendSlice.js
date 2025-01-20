import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { friendsAPI} from '../../api/friends';
import getUserFromLocalStorage from '../../utils/getUserFromLocalStorage';

export const fetchFriends = createAsyncThunk(
    '/friends/fetchFriends',
async (__, { rejectWithValue })=> {
    try {
        const user = getUserFromLocalStorage();
        if (!user) {
            return rejectWithValue('No user found in localStorage');
        }
        const data = await friendsAPI.getFriends(user.id);
        return data || [];
    } catch (error) {
        console.error('Error fetching friends:', error);
        return rejectWithValue(error.message);
    }
    }
);

const initialState = {
    friends: [],
    onlineUsers: new Set(),
    status: 'idle',
    error: null,
}

const friendSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        setOnlineUsers: (state, action) => {
            console.log('💾 Setting online users:', action.payload);
            state.onlineUsers = new Set(action.payload);
        },
        addOnlineUser: (state, action) => {
            console.log('➕ Adding online user:', action.payload);
            const newSet = new Set(state.onlineUsers);
            newSet.add(action.payload);
            state.onlineUsers = newSet;
        },
        removeOnlineUser: (state, action) => {
            console.log('➖ Removing online user:', action.payload);
            const newSet = new Set(state.onlineUsers);
            newSet.delete(action.payload);
            state.onlineUsers = newSet;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchFriends.pending, (state) =>{
            state.status = 'loading';
            state.error = null;
        })
        .addCase(fetchFriends.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.friends = action.payload;
        })
        .addCase(fetchFriends.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
    }
});

export const selectAllFriends = (state) => state.friends.friends;
export const selectFriendStatus = (state) => state.friends.status;
export const selectFriendError = (state) => state.friends.error;
export const selectOnlineUsers = (state) => state.friends.onlineUsers;
export const selectOnlineFriends = (state) => 
    state.friends.friends.filter(friend => state.friends.onlineUsers.has(friend.id));
export const selectOfflineFriends = (state) =>
    state.friends.friends.filter(friend => !state.friends.onlineUsers.has(friend.id));

export const { setOnlineUsers, addOnlineUser, removeOnlineUser } = friendSlice.actions;

export default friendSlice.reducer;