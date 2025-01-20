export const websocketActions = {
    connect: () => ({ type: 'WEBSOCKET_CONNECT' }),
    disconnect: () => ({ type: 'WEBSOCKET_DISCONNECT' }),
    message: (data) => ({ 
        type: 'WEBSOCKET_MESSAGE', 
        payload: data 
    })
}; 