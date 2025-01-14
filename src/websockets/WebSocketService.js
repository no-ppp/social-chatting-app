class WebSocketService {
    constructor() {
        this.ws = null;
        this.subscribers = {
            status: new Set(),
            chat: new Set(),
            notification: new Set(),
            initialStatuses: new Set()
        };
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.isConnected = false;
    }

    connect() {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.log('🔴 WebSocket: Brak tokenu dostępu');
            return;
        }

        if (this.ws?.readyState === WebSocket.OPEN) {
            console.log('🟢 WebSocket: Już połączony');
            return;
        }

        console.log('🟡 WebSocket: Próba połączenia...', token.substring(0, 10) + '...');
        
        try {
            this.ws = new WebSocket(`ws://127.0.0.1:8000/ws/main/?token=${token}`);

            this.ws.onopen = () => {
                this.isConnected = true;
                console.log('🟢 WebSocket: Połączenie ustanowione pomyślnie');
                this.reconnectAttempts = 0;
                this.debug();
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📨 WebSocket: Otrzymano wiadomość:', data);
                    
                    switch (data.type) {
                        case 'initial_statuses':
                            console.log('📊 WebSocket: Otrzymano początkowe statusy');
                            this.subscribers.initialStatuses.forEach(callback => callback(data.statuses));
                            break;
                        case 'status_update':
                            console.log('🔄 WebSocket: Aktualizacja statusu użytkownika');
                            this.subscribers.status.forEach(callback => 
                                callback({
                                    userId: data.user_id,
                                    ...data.status_data
                                })
                            );
                            break;
                        case 'chat_message':
                            this.subscribers.chat.forEach(callback => callback(data));
                            break;
                        case 'notification':
                            this.subscribers.notification.forEach(callback => callback(data));
                            break;
                        default:
                            console.log('Nieznany typ wiadomości:', data.type);
                    }
                } catch (error) {
                    console.error('❌ WebSocket: Błąd przetwarzania wiadomości:', error);
                }
            };

            this.ws.onerror = (error) => {
                this.isConnected = false;
                console.error('❌ WebSocket: Błąd połączenia:', error);
                this.debug();
            };

            this.ws.onclose = () => {
                this.isConnected = false;
                console.log('🔴 WebSocket: Połączenie zamknięte');
                this.debug();
                
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
                    console.log(`🔄 WebSocket: Próba ponownego połączenia za ${delay/1000}s (próba ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                    setTimeout(() => this.connect(), delay);
                } else {
                    console.error('❌ WebSocket: Przekroczono maksymalną liczbę prób połączenia');
                }
            };
        } catch (error) {
            console.error('❌ WebSocket: Błąd podczas tworzenia połączenia:', error);
        }
    }

    debug() {
        console.log('📊 WebSocket Status:', {
            wsInstance: !!this.ws,
            connectionState: this.getConnectionState(),
            isConnected: this.isConnected,
            reconnectAttempts: this.reconnectAttempts,
            token: localStorage.getItem('access_token')?.substring(0, 10) + '...',
            subscribersCount: {
                status: this.subscribers.status.size,
                chat: this.subscribers.chat.size,
                notification: this.subscribers.notification.size,
                initialStatuses: this.subscribers.initialStatuses.size
            }
        });
    }

    getConnectionState() {
        if (!this.ws) return 'DISCONNECTED';
        switch(this.ws.readyState) {
            case WebSocket.CONNECTING: return 'CONNECTING';
            case WebSocket.OPEN: return 'CONNECTED';
            case WebSocket.CLOSING: return 'CLOSING';
            case WebSocket.CLOSED: return 'CLOSED';
            default: return 'UNKNOWN';
        }
    }

    subscribeToInitialStatuses(callback) {
        this.subscribers.initialStatuses.add(callback);
        return () => this.subscribers.initialStatuses.delete(callback);
    }

    subscribeToStatus(callback) {
        this.subscribers.status.add(callback);
        return () => this.subscribers.status.delete(callback);
    }

    subscribeToChat(callback) {
        this.subscribers.chat.add(callback);
        return () => this.subscribers.chat.delete(callback);
    }

    subscribeToNotifications(callback) {
        this.subscribers.notification.add(callback);
        return () => this.subscribers.notification.delete(callback);
    }

    updateStatus(status) {
        // Dostosowane do naszego backendu
        this.send({
            type: 'status_update',
            user_id: this.getCurrentUserId(), // musisz zaimplementować tę metodę
            status: status // 'online', 'offline', 'busy', 'away'
        });
    }

    sendChatMessage(chatId, message) {
        this.send({
            type: 'chat_message',
            chat_id: chatId,
            message: message
        });
    }

    send(data) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket nie jest połączony');
        }
    }

    disconnect() {
        if (this.ws) {
            this.updateStatus('offline');
            this.ws.close();
            this.ws = null;
        }
    }

    getCurrentUserId() {
        // Implementacja zależy od tego, gdzie przechowujesz ID użytkownika
        const userData = JSON.parse(localStorage.getItem('user_data'));
        return userData?.id;
    }
}

// Singleton
export const webSocketService = new WebSocketService();
window.webSocketService = webSocketService;