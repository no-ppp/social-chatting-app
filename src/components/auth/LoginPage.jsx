import { useReducer } from 'react';
import { authAPI } from '../../api/auth';
import AnimatedBackground from '../common/AnimatedBackground';

const ACTIONS = {
  SET_LOGIN_MODE: 'SET_LOGIN_MODE',
  SET_FORM_DATA: 'SET_FORM_DATA', 
  SET_ERROR: 'SET_ERROR',
  SET_LOADING: 'SET_LOADING',
  RESET_FORM: 'RESET_FORM',
  SET_RESET_MODE: 'SET_RESET_MODE',
  TOGGLE_PASSWORD: 'TOGGLE_PASSWORD',
  TOGGLE_CONFIRM_PASSWORD: 'TOGGLE_CONFIRM_PASSWORD',
  SET_REGISTRATION_ERRORS: 'SET_REGISTRATION_ERRORS'
};

const initialState = {
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
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOGIN_MODE:
      return {
        ...state,
        isLoginMode: action.payload,
        isResetMode: false,
        registrationErrors: initialState.registrationErrors
      };
    case ACTIONS.SET_RESET_MODE:
      return {
        ...state,
        isResetMode: action.payload,
        isLoginMode: !action.payload,
        registrationErrors: initialState.registrationErrors
      };
    case ACTIONS.SET_FORM_DATA:
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.name]: action.payload.value
        },
        registrationErrors: {
          ...state.registrationErrors,
          [action.payload.name]: ''
        }
      };
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case ACTIONS.SET_REGISTRATION_ERRORS:
      return {
        ...state,
        registrationErrors: {
          ...state.registrationErrors,
          ...action.payload
        }
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case ACTIONS.RESET_FORM:
      return {
        ...state,
        formData: initialState.formData,
        error: '',
        registrationErrors: initialState.registrationErrors
      };
    case ACTIONS.TOGGLE_PASSWORD:
      return {
        ...state,
        showPassword: !state.showPassword
      };
    case ACTIONS.TOGGLE_CONFIRM_PASSWORD:
      return {
        ...state,
        showConfirmPassword: !state.showConfirmPassword
      };
    default:
      return state;
  }
};

const LoginPage = ({ onLogin, onRegister }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isLoginMode, isResetMode, formData, error, registrationErrors, isLoading, showPassword, showConfirmPassword } = state;

  const validateRegistrationForm = () => {
    const errors = {};
    
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.SET_ERROR, payload: '' });
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      if (isResetMode) {
        await authAPI.resetPassword(formData.email);
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Password reset link has been sent to your email' });
        return;
      }

      if (!isLoginMode) {
        const validationErrors = validateRegistrationForm();
        if (Object.keys(validationErrors).length > 0) {
          dispatch({ type: ACTIONS.SET_REGISTRATION_ERRORS, payload: validationErrors });
          throw new Error('Please fix the form errors');
        }
        await authAPI.register(formData.email, formData.password, formData.username);
      }

      const response = await authAPI.login(formData.email, formData.password);
      const userData = await authAPI.getMe(response.access);
      onLogin(userData);
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const handleChange = (e) => {
    dispatch({
      type: ACTIONS.SET_FORM_DATA,
      payload: { name: e.target.name, value: e.target.value }
    });
  };

  const toggleMode = () => {
    dispatch({ type: ACTIONS.SET_LOGIN_MODE, payload: !isLoginMode });
    dispatch({ type: ACTIONS.RESET_FORM });
  };

  const toggleResetMode = () => {
    dispatch({ type: ACTIONS.SET_RESET_MODE, payload: !isResetMode });
    dispatch({ type: ACTIONS.RESET_FORM });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0b] relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="w-full max-w-md relative z-10 p-4">
        <div className="text-center mb-8 relative opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <h1 className="text-5xl font-bold mb-2 tracking-wider bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-300% bg-clip-text text-transparent animate-text-gradient">
            DISCORD
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto rounded-full mb-4"></div>
          <h2 className="text-2xl font-bold text-white/90">
            {isResetMode ? 'Reset Password' : isLoginMode ? 'Welcome Back!' : 'Join Us'}
          </h2>
          <p className="text-white/70 mt-2">
            {isResetMode 
              ? 'We will send you password reset instructions'
              : isLoginMode 
                ? 'We are glad you are back!' 
                : 'Start your Discord journey'}
          </p>
        </div>

        <div className="relative group opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
          
          <div className="relative bg-[#0a0a0b]/90 backdrop-blur-xl p-8 rounded-2xl">
            {error && (
              <div className={`${error.includes('Password reset link') ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-red-500/10 border-red-500 text-red-400'} border p-3 rounded-md mb-4 backdrop-blur-sm animate-shake`}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLoginMode && !isResetMode && (
                <div>
                  <label htmlFor="username" className="text-gray-300 text-sm font-medium block mb-2">
                    USERNAME
                  </label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full bg-discord-dark/50 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-discord-blue border ${registrationErrors.username ? 'border-red-500' : 'border-white/5'} transition-all duration-300 hover:border-discord-blue/50`}
                    required
                  />
                  {registrationErrors.username && (
                    <p className="text-red-400 text-sm mt-1">{registrationErrors.username}</p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="email" className="text-gray-300 text-sm font-medium block mb-2">
                  EMAIL
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-discord-dark/50 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-discord-blue border ${registrationErrors.email ? 'border-red-500' : 'border-white/5'} transition-all duration-300 hover:border-discord-blue/50`}
                  required
                />
                {registrationErrors.email && (
                  <p className="text-red-400 text-sm mt-1">{registrationErrors.email}</p>
                )}
              </div>

              {!isResetMode && (
                <div>
                  <label htmlFor="password" className="text-gray-300 text-sm font-medium block mb-2">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full bg-discord-dark/50 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-discord-blue border ${registrationErrors.password ? 'border-red-500' : 'border-white/5'} transition-all duration-300 hover:border-discord-blue/50`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => dispatch({ type: ACTIONS.TOGGLE_PASSWORD })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {registrationErrors.password && (
                    <p className="text-red-400 text-sm mt-1">{registrationErrors.password}</p>
                  )}
                </div>
              )}

              {!isLoginMode && !isResetMode && (
                <div>
                  <label htmlFor="confirmPassword" className="text-gray-300 text-sm font-medium block mb-2">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full bg-discord-dark/50 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-discord-blue border ${registrationErrors.confirmPassword ? 'border-red-500' : 'border-white/5'} transition-all duration-300 hover:border-discord-blue/50`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => dispatch({ type: ACTIONS.TOGGLE_CONFIRM_PASSWORD })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {registrationErrors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{registrationErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              {isLoginMode && !isResetMode && (
                <div className="text-right">
                  <button 
                    type="button"
                    onClick={toggleResetMode}
                    className="text-discord-blue text-sm hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-discord-blue hover:bg-discord-blue-hover text-white py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 font-medium mt-6 transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:hover:scale-100"
              >
                <span>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Please wait...
                    </span>
                  ) : (
                    isResetMode ? 'Send Reset Link' : isLoginMode ? 'Log In' : 'Sign Up'
                  )}
                </span>
              </button>
            </form>

            <div className="mt-6 text-sm text-white/70 text-center">
              {isResetMode ? (
                <p>
                  <button
                    onClick={toggleResetMode}
                    className="text-discord-blue hover:text-discord-blue-hover hover:underline font-medium transition-colors"
                  >
                    Back to Login
                  </button>
                </p>
              ) : isLoginMode ? (
                <p>
                  Need an account?{' '}
                  <button
                    onClick={toggleMode}
                    className="text-discord-blue hover:text-discord-blue-hover hover:underline font-medium transition-colors"
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={toggleMode}
                    className="text-discord-blue hover:text-discord-blue-hover hover:underline font-medium transition-colors"
                  >
                    Log In
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;