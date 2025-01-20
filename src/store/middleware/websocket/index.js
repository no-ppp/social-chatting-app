import { websocketConnectionMiddleware } from './websocketConnectionMiddleware';
import { websocketStatusMiddleware } from './websocketStatusMiddleware';

// Eksportujemy tylko istniejące middleware
export const websocketMiddlewares = [
    websocketConnectionMiddleware,
    websocketStatusMiddleware
]; 