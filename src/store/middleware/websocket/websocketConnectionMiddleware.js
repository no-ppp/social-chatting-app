import WebSocketService from '../../../websockets/WebSocketService';

export const websocketConnectionMiddleware = () => next => action => {
    switch (action.type) {
        case 'WEBSOCKET_CONNECT':
            WebSocketService.connect();
            break;
        case 'WEBSOCKET_DISCONNECT':
            WebSocketService.disconnect();
            break;
        // ... inne akcje związane z połączeniem
    }
    return next(action);
}; 