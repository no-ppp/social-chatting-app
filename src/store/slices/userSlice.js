import { createSlice } from '@reduxjs/toolkit';
import { getUserFromLocalStorage } from '../../utils/getUserFromLocalStorage';

const initialState = {
    currentUser: getUserFromLocalStorage() || null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
    },
})