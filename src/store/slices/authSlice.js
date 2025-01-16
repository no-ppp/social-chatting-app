import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/auth';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoginMode: true,
    isResetMode: false,
    formData: {
      email: '',
      password: '',
      username: '',
      confirmPassword: '',
    },
    error: '',
    registrationErrors: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    isLoading: false,
    showPassword: false,
    showConfirmPassword: false
  },
  reducers: {
    setLoginMode: (state, action) => {
      state.isLoginMode = action.payload;
      state.isResetMode = false;
      state.registrationErrors = {};
    },
    setResetMode: (state, action) => {
      state.isResetMode = action.payload;
      state.isLoginMode = !action.payload;
      state.registrationErrors = {};
    },
    updateFormData: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
      state.registrationErrors[name] = '';
    },
    setRegistrationErrors: (state, action) => {
      state.registrationErrors = action.payload;
    },
    togglePassword: (state) => {
      state.showPassword = !state.showPassword;
    },
    toggleConfirmPassword: (state) => {
      state.showConfirmPassword = !state.showConfirmPassword;
    },
    resetForm: (state) => {
      state.formData = {
        email: '',
        password: '',
        username: '',
        confirmPassword: '',
      };
      state.error = '';
      state.registrationErrors = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
        window.location.href = '/app';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setLoginMode, 
  setResetMode, 
  updateFormData, 
  setRegistrationErrors,
  togglePassword,
  toggleConfirmPassword,
  resetForm
} = authSlice.actions;

export default authSlice.reducer;