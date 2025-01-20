class WebSocketService {
    ws = null;
    listeners = new Map();  // dodajemy mapę dla listenerów
    messageListeners = new Map();
    typeListeners = new Map();  // Nowe: listenery dla konkretnych typów
    store = null;

    constructor() {
        this.messageListeners = new Map();
        this.typeListeners = new Map();  // Nowe: listenery dla konkretnych typów
    }

    // Dodajemy metody do zarządzania listenerami
    addListener(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }

    removeListener(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }

    // Metoda do emitowania zdarzeń
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    setStore(store) {
        console.log('🔵 Setting Redux store in WebSocketService');
        this.store = store;
    }

    connect() {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No token found!');
            }

            this.ws = new WebSocket(`ws://127.0.0.1:8000/ws/main/?token=${token}`);
            
            this.ws.onopen = () => {
                console.log('🔄 WebSocket connected');
                this.store?.dispatch({
                    type: 'WEBSOCKET_MESSAGE',
                    payload: { type: 'connection_established' }
                });
            }
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📩 WebSocket received message:', data);
                    
                    // Dispatch do Redux
                    if (this.store) {
                        this.store.dispatch({
                            type: 'WEBSOCKET_MESSAGE',
                            payload: data
                        });
                    } else {
                        console.warn('⚠️ Redux store not set in WebSocketService');
                    }

                    // Emit dla zachowania kompatybilności wstecznej
                    this.emit('message', data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            }
            
            this.ws.onclose = () => {
                console.log('🔄 WebSocket disconnected');
            }
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            }
        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
        }
    }
    debug() {
        console.log('🔄 WebSocket debug:', this.ws);
    }

    disconnect() {
        if (this.ws) {  // sprawdź czy ws istnieje
            this.ws.close();
            this.ws = null;  // wyczyść referencję
            console.log('🔄 WebSocket disconnected');
        }
    }

    handleMessage(event) {
        try {
            const message = JSON.parse(event.data);
            console.log('📨 Received WebSocket message:', message);

            // Powiadom ogólnych listenerów
            this.messageListeners.forEach(listener => listener(message));

            // Powiadom listenerów konkretnego typu
            if (message.type && this.typeListeners.has(message.type)) {
                this.typeListeners.get(message.type).forEach(listener => {
                    listener(message);
                });
            }
        } catch (error) {
            console.error('❌ Error processing WebSocket message:', error);
        }
    }

    // Dodaj listener dla konkretnego typu wiadomości
    addTypeListener(type, callback) {
        if (!this.typeListeners.has(type)) {
            this.typeListeners.set(type, new Set());
        }
        this.typeListeners.get(type).add(callback);
    }

    // Usuń listener dla konkretnego typu wiadomości
    removeTypeListener(type, callback) {
        if (this.typeListeners.has(type)) {
            this.typeListeners.get(type).delete(callback);
        }
    }
}

// Singleton instance
const instance = new WebSocketService();
export default instance;