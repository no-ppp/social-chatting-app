class webSocketService {
    ws = null;  // dodajemy pole ws

    connect() {
        try {
            const token = localStorage.getItem('access_token');  // dodaj const
            if (!token) {
                throw new Error('No token found!');  // sprawdź czy token istnieje
            }

            this.ws = new WebSocket(`ws://127.0.0.1:8000/ws/main/?token=${token}`);  // dodaj ?token=
            
            this.ws.onopen = () => {
                console.log('🔄 WebSocket connected');
            }
            
            this.ws.onclose = () => {
                console.log('🔄 WebSocket disconnected');
            }
            
            this.ws.onmessage = (event) => {
                console.log('🔄 WebSocket message:', event.data);
            }
            
            this.ws.onerror = (error) => {
                console.error('🔄 WebSocket error:', error);
            }
        } catch (error) {
            console.error('🔄 WebSocket connection error:', error);
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
export default new webSocketService();