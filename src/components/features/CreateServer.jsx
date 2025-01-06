import { useReducer} from 'react';

// Action types
const ACTIONS = {
    TOGGLE_SERVER_NAME: 'TOGGLE_SERVER_NAME',
    UPDATE_SERVER_NAME: 'UPDATE_SERVER_NAME', 
    SAVE_SERVER_NAME: 'SAVE_SERVER_NAME',
    TOGGLE_SERVER_DESCRIPTION: 'TOGGLE_SERVER_DESCRIPTION',
    UPDATE_SERVER_DESCRIPTION: 'UPDATE_SERVER_DESCRIPTION',
    SAVE_SERVER_DESCRIPTION: 'SAVE_SERVER_DESCRIPTION',
    ADD_CHANNEL: 'ADD_CHANNEL',
    REMOVE_CHANNEL: 'REMOVE_CHANNEL',
    UPDATE_CHANNEL_NAME: 'UPDATE_CHANNEL_NAME',
    TOGGLE_ADD_CHANNEL: 'TOGGLE_ADD_CHANNEL',
    TOGGLE_CHANNEL_EDIT: 'TOGGLE_CHANNEL_EDIT',
    UPDATE_NEW_CHANNEL_NAME: 'UPDATE_NEW_CHANNEL_NAME'
};

// Initial state
const initialState = {
    isEditingName: false,
    isEditingDescription: false,
    serverName: "Your server name...",
    serverDescription: "Your server description...",
    serverIcon: "",
    serverID: "123123123123",
    channels: [
        { id: 1, name: "general", isEditing: false }
    ],
    showAddChannel: false,
    newChannelName: ""
};

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.TOGGLE_SERVER_NAME:
            return { ...state, isEditingName: !state.isEditingName };
        case ACTIONS.UPDATE_SERVER_NAME:
            return { ...state, serverName: action.payload };
        case ACTIONS.SAVE_SERVER_NAME:
            return { ...state, isEditingName: false };
        case ACTIONS.TOGGLE_SERVER_DESCRIPTION:
            return { ...state, isEditingDescription: !state.isEditingDescription };
        case ACTIONS.UPDATE_SERVER_DESCRIPTION:
            return { ...state, serverDescription: action.payload };
        case ACTIONS.SAVE_SERVER_DESCRIPTION:
            return { ...state, isEditingDescription: false };
        case ACTIONS.ADD_CHANNEL:
            if (!state.newChannelName.trim()) return state;
            return { 
                ...state, 
                channels: [...state.channels, {
                    id: state.channels.length + 1,
                    name: state.newChannelName,
                    isEditing: false
                }],
                showAddChannel: false,
                newChannelName: ""
            };
        case ACTIONS.REMOVE_CHANNEL:
            return {
                ...state,
                channels: state.channels.filter(channel => channel.id !== action.payload)
            };
        case ACTIONS.UPDATE_CHANNEL_NAME:
            return {
                ...state,
                channels: state.channels.map(channel => 
                    channel.id === action.payload.id 
                        ? {...channel, name: action.payload.name}
                        : channel
                )
            };
        case ACTIONS.TOGGLE_ADD_CHANNEL:
            return {
                ...state,
                showAddChannel: !state.showAddChannel,
                newChannelName: ""
            };
        case ACTIONS.TOGGLE_CHANNEL_EDIT:
            return {
                ...state,
                channels: state.channels.map(channel =>
                    channel.id === action.payload
                        ? {...channel, isEditing: !channel.isEditing}
                        : {...channel, isEditing: false}
                )
            };
        case ACTIONS.UPDATE_NEW_CHANNEL_NAME:
            return {
                ...state,
                newChannelName: action.payload
            };
        default:
            return state;
    }
};

const CreateServer = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleNameEdit = () => {
        if (state.isEditingName) {
            dispatch({ type: ACTIONS.SAVE_SERVER_NAME });
        } else {
            dispatch({ type: ACTIONS.TOGGLE_SERVER_NAME });
        }
    };

    const handleDescriptionEdit = () => {
        if (state.isEditingDescription) {
            dispatch({ type: ACTIONS.SAVE_SERVER_DESCRIPTION });
        } else {
            dispatch({ type: ACTIONS.TOGGLE_SERVER_DESCRIPTION });
        }
    };

    const handleAddChannel = () => {
        dispatch({ type: ACTIONS.TOGGLE_ADD_CHANNEL });
    };

    const handleRemoveChannel = (channelId) => {
        dispatch({ type: ACTIONS.REMOVE_CHANNEL, payload: channelId });
    };

    const handleChannelEdit = (channelId) => {
        dispatch({ type: ACTIONS.TOGGLE_CHANNEL_EDIT, payload: channelId });
    };

    const renderServerIcon = () => (
        <div className="relative group">
            <img 
                src={state.serverIcon || ""} 
                alt="" 
                className="border-4 border-discord-blue rounded-full 2xl:h-72 2xl:w-72 h-40 w-40 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="text-white text-sm">Upload Server Icon</button>
            </div>
        </div>
    );

    const renderServerInfo = () => (
        <div className="flex flex-col items-center">
            <h1 className="text-white text-3xl font-bold mb-2">Your Server</h1>
            <p className="text-discord-blue text-lg mb-1">Server ID:</p>
            <p className="text-gray-400 text-md">{state.serverID}</p>
        </div>
    );

    const renderNameSection = () => (
        <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                <label className="text-white text-lg font-medium">Server Name</label>
                <button 
                    onClick={handleNameEdit}
                    className="text-discord-blue hover:text-discord-blue-hover transition-colors"
                >
                    {state.isEditingName ? 'Save ✓' : 'Edit ✎'}
                </button>
            </div>
            {state.isEditingName ? (
                <input
                    className="w-full bg-gray-700 text-white p-4 rounded-md focus:ring-2 focus:ring-discord-blue outline-none"
                    placeholder="Enter server name..."
                    value={state.serverName}
                    onChange={(e) => dispatch({ type: ACTIONS.UPDATE_SERVER_NAME, payload: e.target.value })}
                    maxLength={100}
                />
            ) : (
                <div className="w-full bg-gray-700 text-gray-300 p-4 rounded-md break-words">
                    {state.serverName}
                </div>
            )}
        </div>
    );

    const renderDescriptionSection = () => (
        <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                <label className="text-white text-lg font-medium">Server Description</label>
                <button 
                    onClick={handleDescriptionEdit}
                    className="text-discord-blue hover:text-discord-blue-hover transition-colors"
                >
                    {state.isEditingDescription ? 'Save ✓' : 'Edit ✎'}
                </button>
            </div>
            {state.isEditingDescription ? (
                <textarea
                    className="w-full bg-gray-700 text-white p-4 rounded-md min-h-[150px] focus:ring-2 focus:ring-discord-blue outline-none resize-none scrollbar-thin scrollbar-thumb-discord-blue scrollbar-track-gray-700"
                    placeholder="Describe your server..."
                    value={state.serverDescription}
                    onChange={(e) => dispatch({ type: ACTIONS.UPDATE_SERVER_DESCRIPTION, payload: e.target.value })}
                    maxLength={500}
                />
            ) : (
                <div className="w-full bg-gray-700 text-gray-300 p-4 rounded-md h-[150px] break-words overflow-y-auto scrollbar scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500">
                    {state.serverDescription}
                </div>
            )}
        </div>
    );

    const renderChannelsSection = () => (
        <div className="space-y-2 mt-6">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                <label className="text-white text-lg font-medium">Channels</label>
                <button 
                    onClick={handleAddChannel}
                    className="text-discord-blue hover:text-discord-blue-hover transition-colors"
                >
                    Add Channel +
                </button>
            </div>
            
            {state.showAddChannel && (
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
                    <input
                        type="text"
                        placeholder="Enter channel name..."
                        className="w-full bg-gray-700 text-white p-2 rounded-md mb-2 focus:ring-2 focus:ring-discord-blue outline-none"
                        value={state.newChannelName}
                        onChange={(e) => dispatch({ type: ACTIONS.UPDATE_NEW_CHANNEL_NAME, payload: e.target.value })}
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => dispatch({ type: ACTIONS.TOGGLE_ADD_CHANNEL })}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => dispatch({ type: ACTIONS.ADD_CHANNEL })}
                            className="px-4 py-2 bg-discord-blue text-white rounded-md hover:bg-discord-blue-hover transition-colors"
                        >
                            Create Channel
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                {state.channels.map(channel => (
                    <div key={channel.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-md group hover:bg-gray-600 transition-colors">
                        <div className="flex items-center flex-grow">
                            <span className="text-gray-300 mr-2">#</span>
                            {channel.isEditing ? (
                                <input
                                    className="bg-gray-800 text-white p-1 rounded w-full focus:ring-2 focus:ring-discord-blue outline-none"
                                    value={channel.name}
                                    onChange={(e) => dispatch({ 
                                        type: ACTIONS.UPDATE_CHANNEL_NAME, 
                                        payload: { id: channel.id, name: e.target.value }
                                    })}
                                    autoFocus
                                />
                            ) : (
                                <span className="text-white">{channel.name}</span>
                            )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                            <button 
                                onClick={() => handleChannelEdit(channel.id)}
                                className="text-gray-400 hover:text-discord-blue transition-colors ml-2"
                            >
                                {channel.isEditing ? 'Save ✓' : 'Edit ✎'}
                            </button>
                            <button 
                                onClick={() => handleRemoveChannel(channel.id)}
                                className="text-gray-400 hover:text-red-400 transition-colors ml-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="lg:ml-[280px] md:mr-[270px] ml-[40px] flex flex-col min-h-screen items-center bg-discord-darker">
            <div className="w-full max-w-4xl bg-discord-dark rounded-lg shadow-xl p-8">
                <div className="flex flex-col items-center gap-4 mb-4">
                    {renderServerIcon()}
                    {renderServerInfo()}
                </div>

                <div className="flex flex-col gap-6">
                    <div className="space-y-3 bg-discord-darker p-6 rounded-lg shadow-inner">
                        {renderNameSection()}
                        {renderDescriptionSection()}
                        {renderChannelsSection()}
                    </div>
                </div>

                <button className="w-full mt-2 bg-discord-gray hover:bg-discord-blue-hover text-white py-3 px-6 rounded-md text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Edit Server
                </button>
            </div>
        </div>
    );
};

export default CreateServer;