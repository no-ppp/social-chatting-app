import { useReducer, useEffect } from 'react';

// Action types
const ACTIONS = {
    TOGGLE_BIO_EDIT: 'TOGGLE_BIO_EDIT',
    UPDATE_BIO: 'UPDATE_BIO', 
    SAVE_BIO: 'SAVE_BIO',
    TOGGLE_EMAIL_POPUP: 'TOGGLE_EMAIL_POPUP',
    TOGGLE_PASSWORD_POPUP: 'TOGGLE_PASSWORD_POPUP',
    CLOSE_POPUPS: 'CLOSE_POPUPS'
};

// Initial state
const initialState = {
    isEditingBio: false,
    bio: "Your bio appears here...",
    username: "eye1231231",
    email: "eye1231231@gmail.com",
    userID: "123123123123",
    active: true,
    showEmailPopup: false,
    showPasswordPopup: false,
    emailButtonDisabled: false,
    passwordButtonDisabled: false
};

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.TOGGLE_BIO_EDIT:
            return { ...state, isEditingBio: !state.isEditingBio };
        case ACTIONS.UPDATE_BIO:
            return { ...state, bio: action.payload };
        case ACTIONS.SAVE_BIO:
            return { ...state, isEditingBio: false };
        case ACTIONS.TOGGLE_EMAIL_POPUP:
            return { 
                ...state, 
                showEmailPopup: !state.showEmailPopup, 
                emailButtonDisabled: true 
            };
        case ACTIONS.TOGGLE_PASSWORD_POPUP:
            return { 
                ...state, 
                showPasswordPopup: !state.showPasswordPopup, 
                passwordButtonDisabled: true 
            };
        case ACTIONS.CLOSE_POPUPS:
            return { 
                ...state, 
                showEmailPopup: false, 
                showPasswordPopup: false,
                emailButtonDisabled: false, 
                passwordButtonDisabled: false 
            };
        default:
            return state;
    }
};

const ProfileEditDashboard = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        let timer;
        if (state.showEmailPopup || state.showPasswordPopup) {
            timer = setTimeout(() => {
                dispatch({ type: ACTIONS.CLOSE_POPUPS });
            }, 10000);
        }
        return () => clearTimeout(timer);
    }, [state.showEmailPopup, state.showPasswordPopup]);

    const handleBioEdit = () => {
        if (state.isEditingBio) {
            dispatch({ type: ACTIONS.SAVE_BIO });
        } else {
            dispatch({ type: ACTIONS.TOGGLE_BIO_EDIT });
        }
    };

    const handleEmailPopup = () => {
        if (!state.emailButtonDisabled) {
            dispatch({ type: ACTIONS.TOGGLE_EMAIL_POPUP });
        }
    };

    const handlePasswordPopup = () => {
        if (!state.passwordButtonDisabled) {
            dispatch({ type: ACTIONS.TOGGLE_PASSWORD_POPUP });
        }
    };

    const renderAvatar = () => (
        <div className="relative group">
            <img 
                src="" 
                alt="" 
                className="border-4 border-discord-blue rounded-full 2xl:h-72 2xl:w-72 h-44 w-44 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="text-white text-sm">Change Avatar</button>
            </div>
        </div>
    );

    const renderUserInfo = () => (
        <div className="flex flex-col items-center">
            <h1 className="text-white text-3xl font-bold mb-2">Welcome, {state.username}!</h1>
            <p className="text-discord-blue text-lg mb-1">User ID:</p>
            <p className="text-gray-400 text-md">{state.userID}</p>
            <div className="flex items-center mt-2">
                <div className={`w-3 h-3 rounded-full ${state.active ? 'bg-green-500' : 'bg-gray-500'} mr-2`}></div>
                <span className="text-gray-300">{state.active ? 'Online' : 'Offline'}</span>
            </div>
            <p className="text-gray-300">{state.email}</p>
        </div>
    );

    const renderEmailSection = () => (
        <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                <label className="text-white text-lg font-medium">Email</label>
                <button 
                    onClick={handleEmailPopup}
                    className={`text-discord-blue hover:text-discord-blue-hover transition-colors ${state.emailButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={state.emailButtonDisabled}
                >
                    ✎ Edit
                </button>
            </div>
            {state.showEmailPopup && (
                <div className="mt-2 p-4 bg-discord-dark rounded-lg">
                    <p className="text-gray-300 text-sm">We've sent instructions to change your email to {state.email}</p>
                    <p className="text-gray-400 text-xs mt-2">Please check your inbox and follow the instructions.</p>
                </div>
            )}
        </div>
    );

    const renderPasswordSection = () => (
        <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                <label className="text-white text-lg font-medium">Password</label>
                <button 
                    onClick={handlePasswordPopup}
                    className={`text-discord-blue hover:text-discord-blue-hover transition-colors ${state.passwordButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={state.passwordButtonDisabled}
                >
                    ✎ Edit
                </button>
            </div>
            {state.showPasswordPopup && (
                <div className="mt-2 p-4 bg-discord-dark rounded-lg">
                    <p className="text-gray-300 text-sm">We've sent instructions to reset your password to {state.email}</p>
                    <p className="text-gray-400 text-xs mt-2">Please check your inbox and follow the instructions.</p>
                </div>
            )}
        </div>
    );

    const renderBioSection = () => (
        <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                <label className="text-white text-lg font-medium">Bio</label>
                <button 
                    onClick={handleBioEdit}
                    className="text-discord-blue hover:text-discord-blue-hover transition-colors"
                >
                    {state.isEditingBio ? 'Save ✓' : 'Edit ✎'}
                </button>
            </div>
            {state.isEditingBio ? (
                <textarea
                    className="w-full bg-gray-700 text-white p-4 rounded-md min-h-[150px] focus:ring-2 focus:ring-discord-blue outline-none resize-none scrollbar-thin scrollbar-thumb-discord-blue scrollbar-track-gray-700"
                    placeholder="Tell us about yourself..."
                    value={state.bio}
                    onChange={(e) => dispatch({ type: ACTIONS.UPDATE_BIO, payload: e.target.value })}
                    maxLength={500}
                />
            ) : (
                <div className="w-full bg-gray-700 text-gray-300 p-4 rounded-md h-[150px] break-words overflow-y-auto scrollbar scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500">
                    {state.bio}
                </div>
            )}
        </div>
    );

    return (
        <div className="lg:ml-[280px] md:mr-[270px] ml-[40px] p-8 flex flex-col min-h-screen items-center bg-discord-darker">
            <div className="w-full max-w-4xl bg-discord-dark rounded-lg shadow-xl p-8">
                <div className="flex flex-col items-center gap-8 mb-8">
                    {renderAvatar()}
                    {renderUserInfo()}
                </div>

                <div className="flex flex-col gap-6">
                    <div className="space-y-4 bg-discord-darker p-6 rounded-lg shadow-inner">
                        {renderEmailSection()}
                        {renderPasswordSection()}
                        {renderBioSection()}
                    </div>
                </div>

                <button className="w-full mt-8 bg-discord-gray hover:bg-discord-blue-hover text-white py-3 px-6 rounded-md text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Save All Changes
                </button>
            </div>
        </div>
    );
};

export default ProfileEditDashboard;