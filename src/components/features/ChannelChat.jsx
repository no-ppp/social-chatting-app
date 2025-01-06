import Chat from './Chat'
import { useState } from 'react'

const testMessages = [
    {
        id: 1,
        user: "John Doe",
        content: "Cześć! Co słychać?",
        timestamp: "10:30"
    },
    {
        id: 2,
        user: "Jane Smith", 
        content: "Wszystko w porządku, a u Ciebie?",
        timestamp: "10:32"
    }
]

const ChannelChat = ({seeProfileHandler,sendMessageHandler}) => {
    const [messages, setMessages] = useState(testMessages)

    return (
        <div className="flex-1">
            <Chat 
            seeProfileHandler={seeProfileHandler}
            sendMessageHandler={sendMessageHandler}
            messages={messages} />
        </div>
    )
}

export default ChannelChat