import React, { useState, useRef } from 'react';
import useClickOutside from '../../hooks/useClickOutside';

const emojis = [
    '😀', '😂', '😍', '😎', '😢', '😡', '👍', '👎', '🎉', '❤️',
    '😇', '😈', '🤔', '🤗', '🤩', '🥳', '😱', '😴', '😜', '😏',
    // Dodaj więcej emoji według potrzeb
];

const EmojiPicker = ({ onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const emojiPickerRef = useRef(null);
    useClickOutside(emojiPickerRef, isOpen, () => {
        setIsOpen(false);
    });

    const togglePicker = () => {
        setIsOpen(!isOpen);
    };

    const handleEmojiClick = (emoji) => {
        onSelect(emoji);
        setIsOpen(false); // Zamknij picker po wyborze emoji
    };

    return (
        <div className="relative">
            <button onClick={togglePicker} className="p-2 text-gray-400 hover:text-white" aria-label="Add emoji">
            <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            </button>
            {isOpen && (
                <div ref={emojiPickerRef} className="absolute w-64 bottom-full right-0 z-50 bg-discord-dark border border-gray-700 rounded-lg shadow-xl mb-2 p-3 grid grid-cols-5 gap-2">
                    {emojis.map((emoji) => (
                        <button
                            key={emoji}
                            onClick={() => handleEmojiClick(emoji)}
                            className="text-2xl rounded p-1 transition-colors duration-200"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmojiPicker;