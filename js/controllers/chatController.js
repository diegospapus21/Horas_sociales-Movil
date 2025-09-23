// Controlador principal del chat
class ChatController {
    constructor() {
        this.currentChat = null;
        this.chats = [];
        this.filteredChats = [];
        this.currentUser = null;
        
        this.init();
    }

    async init() {
        try {
            // Obtener usuario actual (simulado)
            this.currentUser = {
                id: 'usuario-actual-id',
                name: 'Usuario Actual',
                avatar: 'U'
            };
            
            // Conectar WebSockets
            await websocketService.connect();
            websocketService.addMessageHandler(this.handleWebSocketMessage.bind(this));
            
            // Cargar chats
            await this.loadChats();
            
            // Configurar event listeners
            this.setupEventListeners();
            
        } catch (error) {
            console.error('Error inicializando chat:', error);
            this.showError('Error al conectar con el servidor');
        }
    }

    async loadChats() {
        try {
            // Obtener chats desde la API
            const response = await apiService.getChats();
            this.chats = response;
            this.filteredChats = [...this.chats];
            this.renderChats();
            
        } catch (error) {
            console.error('Error cargando chats:', error);
            this.showError('No se pudieron cargar los chats');
        }
    }

    renderChats() {
        const chatsList = document.querySelector('.contacts-list');
        chatsList.innerHTML = '';
        
        if (this.filteredChats.length === 0) {
            chatsList.innerHTML = '<div class="no-contacts">No se encontraron chats</div>';
            return;
        }
        
        this.filteredChats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'contact-item';
            if (this.currentChat && this.currentChat.id === chat.id) {
                chatItem.classList.add('active');
            }
            chatItem.dataset.id = chat.id;
            
            // Determinar el otro usuario en el chat
            const otherUser = chat.usuario1.id === this.currentUser.id ? chat.usuario2 : chat.usuario1;
            
            chatItem.innerHTML = `
                <div class="contact-avatar">${otherUser.nombre.charAt(0)}
                    ${otherUser.online ? '<div class="online-dot"></div>' : '<div class="offline-dot"></div>'}
                </div>
                <div class="contact-info">
                    <div class="contact-name">${otherUser.nombre}</div>
                    <div class="contact-preview">${chat.lastMessage || 'No hay mensajes'}</div>
                </div>
                <div class="contact-meta">
                    <div>${this.formatTime(chat.lastMessageTime)}</div>
                    ${chat.unreadCount > 0 ? `<div class="unread-badge">${chat.unreadCount}</div>` : ''}
                </div>
            `;
            
            chatItem.addEventListener('click', () => {
                this.selectChat(chat, otherUser);
            });
            
            chatsList.appendChild(chatItem);
        });
    }

    async selectChat(chat, otherUser) {
        try {
            // Aplicar animación de transición
            const messagesContainer = document.querySelector('.messages-container');
            messagesContainer.classList.add('chat-transition');
            
            // Actualizar chat actual
            this.currentChat = chat;
            this.currentOtherUser = otherUser;
            
            // Actualizar header del chat
            document.querySelector('.current-contact .user-avatar').textContent = otherUser.nombre.charAt(0);
            document.querySelector('.contact-name').textContent = otherUser.nombre;
            document.querySelector('.contact-status').textContent = otherUser.online ? 'En línea' : 'Desconectado';
            
            // Mostrar área de mensajes y input
            document.querySelector('.empty-chat').style.display = 'none';
            document.querySelector('.input-container').style.display = 'flex';
            
            // Resaltar chat seleccionado en la lista
            document.querySelectorAll('.contact-item').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector(`.contact-item[data-id="${chat.id}"]`).classList.add('active');
            
            // Cargar mensajes del chat
            await this.loadMessages(chat.id);
            
            // Remover la clase de animación después de que termine
            setTimeout(() => {
                messagesContainer.classList.remove('chat-transition');
            }, 300);
            
        } catch (error) {
            console.error('Error seleccionando chat:', error);
            this.showError('No se pudo cargar el chat');
        }
    }

    async loadMessages(chatId) {
        try {
            const messages = await apiService.getMessages(chatId);
            this.renderMessages(messages);
        } catch (error) {
            console.error('Error cargando mensajes:', error);
            this.showError('No se pudieron cargar los mensajes');
        }
    }

    renderMessages(messages) {
        const messagesContainer = document.querySelector('.messages-container');
        messagesContainer.innerHTML = '';
        
        if (messages.length === 0) {
            messagesContainer.innerHTML = `
                <div class="empty-chat">
                    <div class="empty-chat-icon"><i class="fas fa-comments"></i></div>
                    <p>No hay mensajes en este chat</p>
                    <p>Envía un mensaje para comenzar la conversación</p>
                </div>
            `;
            return;
        }
        
        messages.forEach(message => {
            const isOwn = message.remitente.id === this.currentUser.id;
            const messageElement = document.createElement('div');
            messageElement.className = `message ${isOwn ? 'my-message' : 'their-message'}`;
            messageElement.innerHTML = `
                <div class="message-text">${message.mensaje}</div>
                <div class="message-time">${this.formatTime(message.fechaHoraMensaje)}</div>
            `;
            messagesContainer.appendChild(messageElement);
        });
        
        // Scroll al final de los mensajes
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async sendMessage() {
        const messageInput = document.querySelector('.message-input');
        const messageText = messageInput.value.trim();
        
        if (messageText === '' || !this.currentChat) return;
        
        try {
            // Enviar mensaje a través de WebSockets
            const sent = websocketService.sendMessage(this.currentChat.id, messageText);
            
            if (sent) {
                // También enviar a la API para persistencia
                await apiService.sendMessage({
                    mensaje: messageText,
                    destinatario: this.currentOtherUser.userId,
                    estadoMensaje: 1,
                    chat: this.currentChat.id
                });
                
                // Añadir mensaje a la interfaz
                this.addMessageToUI(messageText, true);
                
                // Limpiar input
                messageInput.value = '';
            } else {
                this.showError('No se pudo enviar el mensaje. Verifica la conexión.');
            }
            
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            this.showError('No se pudo enviar el mensaje');
        }
    }

    addMessageToUI(text, isOwn = false) {
        const messagesContainer = document.querySelector('.messages-container');
        const now = new Date();
        const time = this.formatTime(now);
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isOwn ? 'my-message' : 'their-message'}`;
        messageElement.innerHTML = `
            <div class="message-text">${text}</div>
            <div class="message-time">${time}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    handleWebSocketMessage(messageData) {
        if (messageData.type === 'chat_message' && 
            this.currentChat && 
            messageData.chat_id === this.currentChat.id) {
            
            // Mostrar mensaje entrante
            this.addMessageToUI(messageData.content, false);
        }
    }

    setupEventListeners() {
        const searchInput = document.getElementById('search-input');
        const clearSearch = document.querySelector('.clear-search');
        const messageInput = document.querySelector('.message-input');
        const sendButton = document.querySelector('.send-button');
        
        // Búsqueda de chats
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }
        
        // Limpiar búsqueda
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                this.filteredChats = [...this.chats];
                this.renderChats();
                clearSearch.style.display = 'none';
            });
        }
        
        // Enviar mensaje
        if (sendButton) {
            sendButton.addEventListener('click', this.sendMessage.bind(this));
        }
        
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        const clearSearch = document.querySelector('.clear-search');
        
        if (searchTerm === '') {
            this.filteredChats = [...this.chats];
            if (clearSearch) clearSearch.style.display = 'none';
        } else {
            this.filteredChats = this.chats.filter(chat => {
                const otherUser = chat.usuario1.id === this.currentUser.id ? chat.usuario2 : chat.usuario1;
                return otherUser.nombre.toLowerCase().includes(searchTerm);
            });
            if (clearSearch) clearSearch.style.display = 'block';
        }
        
        this.renderChats();
    }

    formatTime(dateTime) {
        if (!dateTime) return '';
        
        const date = new Date(dateTime);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours} h`;
        if (diffDays < 7) return `Hace ${diffDays} d`;
        
        return date.toLocaleDateString();
    }

    showError(message) {
        // Implementar visualización de errores (puede ser un toast o alerta)
        console.error('Error:', message);
        alert(message); // En una app real, usarías un sistema de notificaciones mejor
    }
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.chatController = new ChatController();
});