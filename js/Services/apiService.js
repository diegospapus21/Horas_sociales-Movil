// Servicio para comunicación con la API REST
class ApiService {
    constructor() {
        this.baseURL = 'https://shmsapi-9871bf53b299.herokuapp.com';
    }

    // Obtener todos los chats del usuario actual
    async getChats() {
        try {
            // En una app real, el usuario actual se obtendría del sistema de autenticación
            const response = await fetch(`${this.baseURL}/chats/usuario/current-user-id`, {credentials: "include"});
            if (!response.ok) throw new Error('Error obteniendo chats');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw new Error('No se pudieron cargar los chats');
        }
    }

    // Obtener mensajes de un chat específico
    async getMessages(chatId) {
        try {
            const response = await fetch(`${this.baseURL}/mensajes/chat/${chatId}`, {credentials: "include"});
            if (!response.ok) throw new Error('Error obteniendo mensajes');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw new Error('No se pudieron cargar los mensajes');
        }
    }

    // Enviar un mensaje
    async sendMessage(messageData) {
        try {
            const response = await fetch(`${this.baseURL}/mensajes`, {
                credentials: "include",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData)
            });
            
            if (!response.ok) throw new Error('Error enviando mensaje');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw new Error('No se pudo enviar el mensaje');
        }
    }

    // Buscar contactos
    async searchContacts(query) {
        try {
            const response = await fetch(`${this.baseURL}/usuarios/buscar?nombre=${encodeURIComponent(query)}`, {credentials: "include"});
            if (!response.ok) throw new Error('Error buscando contactos');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw new Error('No se pudo realizar la búsqueda');
        }
    }

    // Crear un nuevo chat
    async createChat(contactId) {
        try {
            const response = await fetch(`${this.baseURL}/chats`, {
                credentials: "include",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario1: 'current-user-id', // ID del usuario actual
                    usuario2: contactId,
                    estadoChat: 1
                })
            });
            
            if (!response.ok) throw new Error('Error creando chat');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw new Error('No se pudo crear el chat');
        }
    }
}

// Crear instancia global del servicio
const apiService = new ApiService();