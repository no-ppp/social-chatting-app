import {useReducer} from 'react';
import Chat from '../features/Chat';
const initialState = {
    isPopupOpen: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_POPUP':
            return { ...state, isPopupOpen: !state.isPopupOpen };
        default:
            return state;
    }
};

const ChannelContentDashboard = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleTogglePopup = () => {
        dispatch({ type: 'TOGGLE_POPUP' });
    };

    return (
        <div className="lg:ml-[280px] md:mr-[270px] ml-[40px] p-4 flex flex-col min-h-screen">
            <h1 className="text-white text-2xl font-bold">Welcome on the Channel!</h1>
            <div className="relative">
                <p>Where does it come from? 
                    Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old...
                </p>
                <button 
                    onClick={handleTogglePopup} 
                    className="mt-4 bg-discord-dark text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                    Read Full Text
                </button>

                {state.isPopupOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-discord-dark p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto relative">
                            <button 
                                onClick={handleTogglePopup}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h2 className="text-white text-xl font-bold mb-4">Full Text</h2>
                            <p className="text-gray-400 mb-4">
                                Where does it come from? 
                                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
                            </p>
                            <p className="text-gray-400">
                                The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.

                                But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.

                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
                            </p>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-4">
            </div>
        </div>
    )
}

export default ChannelContentDashboard;