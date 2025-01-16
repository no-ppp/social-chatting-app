import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: JSON.parse(localStorage.getItem('user')) || null,

}


const userSlice = createSlice({
    name: 'user',
    initialState,
    
})