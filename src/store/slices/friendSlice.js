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
    onlineUsers: [],
    status: 'idle',
    error: null,
}

const friendSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        
        setOlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        addOnlineUser: (state, action) => {
            state.onlineUsers.add(action.payload);
        },
        removeOnlineUser: (state, action) => {
            state.onlineUsers.delete(action.payload);

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
    }
);

export const selectAllFriends = (state) => state.friends.friends;
export const selectFriendStatus = (state) => state.friends.status;
export const selectFriendError = (state) => state.friends.error;
export const selectOnlineFriends = (state) => 
    state.friends.friends.filter(friend => state.friends.onlineUsers.had(friend.id));
export const selectOfflineFriends = (state) =>
    state.friends.friends.filter(friend => state.friends.onlineUsers.has(friend.id));


export const { setOnlineUsers, addOnlineUser, removeOnlineUser } = friendSlice.actions;

export default friendSlice.reducer;