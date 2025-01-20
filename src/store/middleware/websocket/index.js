import { websocketConnectionMiddleware } from './websocketConnectionMiddleware';
import { websocketStatusMiddleware } from './websocketStatusMiddleware';
import { websocketNotificationMiddleware } from './websocketNotificationMiddleware';

// Eksportujemy tylko istniejące middleware
export const websocketMiddlewares = [
    websocketConnectionMiddleware,
    websocketStatusMiddleware,
    websocketNotificationMiddleware
]; 