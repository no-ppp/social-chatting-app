import { useEffect } from 'react';
import webSocketService from '../../websockets/WebSocketService';
import { authAPI } from '../../api/auth';

const useWebSocketConnect = () => {
  const isAuthenticated = authAPI.isAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 Inicjalizacja WebSocket w App...');
      webSocketService.connect();
      webSocketService.debug();
    }
    return () => {
      webSocketService.disconnect();
    };
  }, [isAuthenticated]);

  return;
};

export default useWebSocketConnect;