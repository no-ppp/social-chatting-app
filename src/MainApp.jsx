import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LeftSidebar from './components/leftsidebar/LeftSidebar';
import RightSidebar from './components/rightsidebar/RightSidebar';
import Chat from './components/features/Chat';
import ProfileDashboard from './components/profile/ProfileDashboard';

const MainApp = ({ onLogout }) => {
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [selectedServer, setSelectedServer] = useState(null);

    return (
        <div className="flex h-screen bg-discord-gray">
            <LeftSidebar 
                selectedServer={selectedServer}
                setSelectedServer={setSelectedServer}
                setSelectedChannel={setSelectedChannel}
            />
            
            <div className="flex-1 flex">
                <Routes>
                    <Route path="/" element={
                        <div className="flex-1 flex justify-center items-center text-white">
                            Select a channel to start chatting
                        </div>
                    } />
                    <Route path="/channels/:serverId/:channelId" element={
                        <Chat 
                            selectedChannel={selectedChannel}
                            selectedServer={selectedServer}
                        />
                    } />
                    <Route path="/profile/:userId" element={
                        <ProfileDashboard />
                    } />
                </Routes>
            </div>
            
            <RightSidebar 
                onLogout={onLogout}
            />
        </div>
    );
};

export default MainApp;