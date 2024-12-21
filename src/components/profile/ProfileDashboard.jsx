import { useState } from 'react'

const ProfileDashboard = () => {
    const [addFriend, setAddFriend] = useState(false)

    const addFriendHandler = () => {
        setAddFriend(true)
    }

    return (
        <div className="lg:ml-[280px] md:mr-[270px] ml-[40px] p-8 flex flex-col min-h-screen items-center bg-discord-darker">
            <div className="w-full max-w-4xl bg-discord-dark rounded-lg shadow-xl p-8 overflow-hidden">
                <div className="flex flex-col xl:flex-row items-center gap-8 mb-8">
                    <div className="relative group">
                        <img 
                            src="" 
                            alt="" 
                            className="border-4 border-discord-blue rounded-full 2xl:h-72 2xl:w-72 h-44 w-44 object-cover"
                        />
                    </div>
                    
                    <div className="flex flex-col items-center xl:items-start">
                        <h1 className="text-white text-3xl font-bold mb-2">eye1231231</h1>
                        <p className="text-discord-blue text-lg mb-1">User ID:</p>
                        <p className="text-gray-400 text-md">123123123123</p>
                        <div className="flex items-center mt-2">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-gray-300">Online</span>
                        </div>
                        <p className="text-gray-300">eye1231231@gmail.com</p>
                    </div>
                </div>

                <div className="gap-6 max-w-full">
                    <div className="space-y-4 bg-discord-darker p-6 rounded-lg shadow-inner">
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                <p className="text-white text-lg font-sm">Add to friends</p>
                                <button onClick={addFriendHandler} className="text-discord-blue hover:text-discord-blue-hover transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                            </div>
                            {addFriend && <p className="text-gray-400 text-lg font-sm">Friend request sent</p>}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                <p className="text-white text-lg font-sm">Send message</p>
                                <button className="text-discord-blue hover:text-discord-blue-hover transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                <label className="text-white text-lg font-medium">Bio</label>
                            </div>
                            <div className="w-full bg-gray-700 text-gray-300 p-4 rounded-md break-words">
                                <p>Your bio appears here...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileDashboard;