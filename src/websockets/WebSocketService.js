class WebSocketService {
    ws = null;
    listeners = new Map();  // dodajemy mapę dla listenerów

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

    connect() {
        try {
            const token = localStorage.getItem('access_token');  // dodaj const
            if (!token) {
                throw new Error('No token found!');  // sprawdź czy token istnieje
            }

            this.ws = new WebSocket(`ws://127.0.0.1:8000/ws/main/?token=${token}`);  // dodaj ?token=
            
            this.ws.onopen = () => {
                console.log('🔄 WebSocket connected');
                this.emit('connected', true);  // Emitujemy zdarzenie
            }
            
            this.ws.onclose = () => {
                console.log('🔄 WebSocket disconnected');
                this.emit('connected', false);  // Emitujemy zdarzenie
            }
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📩 Received WebSocket message:', data);
                    
                    // Emituj zdarzenie 'message' zamiast używać forEach na listeners
                    this.emit('message', data);
                    
                    // Możesz też emitować specyficzne zdarzenia
                    if (data.type === 'status_update') {
                        console.log('🔄 Status update received:', data);
                        this.emit('status_update', data);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
        
            
            this.ws.onerror = (error) => {
                console.error('🔄 WebSocket error:', error);
                this.emit('error', error);  // Emitujemy zdarzenie błędu
            }
        } catch (error) {
            console.error('🔄 WebSocket connection error:', error);
            this.emit('error', error);  // Emitujemy zdarzenie błędu
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
}

// Eksportuj instancję, nie klasę
export default new WebSocketService();