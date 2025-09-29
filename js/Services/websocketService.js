// Servicio de WebSockets para comunicación en tiempo real
class WebSocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.messageHandlers = [];
    }

    connect() {
        return new Promise((resolve, reject) => {
            try {
                // Conectar al servidor WebSocket (ajusta la URL según tu configuración)
                this.socket = new WebSocket('ws://shmsapi-9871bf53b299.herokuapp.com/ws');
                
                this.socket.onopen = () => {
                    this.connected = true;
                    console.log("Conectado al servidor WebSocket");
                    resolve();
                };
                
                this.socket.onmessage = (event) => {
                    this.handleMessage(event);
                };
                
                this.socket.onerror = (error) => {
                    console.error("Error en WebSocket:", error);
                    reject(error);
                };
                
                this.socket.onclose = () => {
                    this.connected = false;
                    console.log("Conexión WebSocket cerrada");
                };
                
            } catch (error) {
                console.error("Error conectando WebSocket:", error);
                reject(error);
            }
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.connected = false;
        }
    }

    sendMessage(chatId, message) {
        if (!this.connected) {
            console.error("No conectado al servidor WebSocket");
            return false;
        }

        const messageData = {
            type: 'chat_message',
            chat_id: chatId,
            content: message,
            timestamp: new Date().toISOString()
        };

        this.socket.send(JSON.stringify(messageData));
        return true;
    }

    handleMessage(event) {
        try {
            const messageData = JSON.parse(event.data);
            
            // Notificar a todos los handlers registrados
            this.messageHandlers.forEach(handler => {
                handler(messageData);
            });
            
        } catch (error) {
            console.error("Error procesando mensaje:", error);
        }
    }

    addMessageHandler(handler) {
        this.messageHandlers.push(handler);
    }

    removeMessageHandler(handler) {
        this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    }
}

// Crear instancia global del servicio
const websocketService = new WebSocketService();