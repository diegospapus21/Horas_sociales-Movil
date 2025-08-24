import { authService, chatService, usuariosService } from './services.js';
import { setupProtectedPage } from './authMiddleware.js';

let user = null;
let currentChatId = null;
let selectedUserId = null;

export async function initializeChat() {
    user = setupProtectedPage();
    if (!user) return;
    
    setupEventListeners();
    await loadCoordinadores();
}

function setupEventListeners() {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');
    
    if (sendButton) {
        sendButton.addEventListener('click', enviarMensaje);
    }
    
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                enviarMensaje();
            }
        });
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authService.logout();
        });
    }
}

async function loadCoordinadores() {
    try {
        const usuarios = await usuariosService.obtenerUsuarios();
        const coordinadores = usuarios.filter(u => u.id_rol === 2);
        
        displayCoordinadores(coordinadores);
    } catch (error) {
        console.error('Error loading coordinators:', error);
        showError('contactsList', 'Error al cargar coordinadores');
    }
}

function displayCoordinadores(coordinadores) {
    const contactsList = document.getElementById('contactsList');
    
    if (!coordinadores || coordinadores.length === 0) {
        contactsList.innerHTML = `
            <div class="text-center p-3 text-muted">
                <i class="bi bi-people" style="font-size: 2rem;"></i>
                <p class="mt-2">No hay coordinadores disponibles</p>
            </div>
        `;
        return;
    }
    
    contactsList.innerHTML = coordinadores.map(coordinador => `
        <div class="contact-item" onclick="seleccionarContacto('${coordinador.id}', '${coordinador.nombre} ${coordinador.apellido || ''}')">
            <div class="d-flex align-items-center">
                <div class="avatar me-3">
                    <img src="${coordinador.foto || 'img/default-avatar.png'}" alt="Avatar" class="rounded-circle" width="40" height="40">
                </div>
                <div>
                    <h6 class="mb-0">${coordinador.nombre} ${coordinador.apellido || ''}</h6>
                    <small class="text-muted">Coordinador</small>
                </div>
            </div>
        </div>
    `).join('');
}

window.seleccionarContacto = async function(usuarioId, usuarioNombre) {
    selectedUserId = usuarioId;
    
    const chatHeader = document.getElementById('chatHeader');
    chatHeader.innerHTML = `
        <div class="d-flex align-items-center">
            <img src="img/default-avatar.png" alt="Avatar" class="rounded-circle me-2" width="32" height="32">
            <div>
                <h6 class="mb-0">Chat con ${usuarioNombre}</h6>
                <small class="text-muted">En línea</small>
            </div>
        </div>
    `;
    
    // Habilitar chat
    document.getElementById('messageInput').disabled = false;
    document.getElementById('sendButton').disabled = false;
    
    // Buscar o crear chat
    const chat = await buscarChatExistente(user.id, usuarioId);
    
    if (chat) {
        currentChatId = chat.idChat || chat.id;
        await cargarMensajes(currentChatId);
    } else {
        // Crear nuevo chat si no existe
        const nuevoChat = await crearNuevoChat(user.id, usuarioId);
        if (nuevoChat) {
            currentChatId = nuevoChat.idChat || nuevoChat.id;
        }
    }
};

async function buscarChatExistente(usuario1, usuario2) {
    try {
        const chats = await chatService.obtenerChatsPorUsuario(usuario1);
        return chats.find(chat => 
            (chat.usuario1 === usuario1 && chat.usuario2 === usuario2) ||
            (chat.usuario1 === usuario2 && chat.usuario2 === usuario1)
        );
    } catch (error) {
        console.error('Error searching chat:', error);
        return null;
    }
}

async function crearNuevoChat(usuario1, usuario2) {
    try {
        return await chatService.crearChat({
            usuario1: usuario1,
            usuario2: usuario2,
            estadoChat: 1
        });
    } catch (error) {
        console.error('Error creating chat:', error);
        return null;
    }
}

async function cargarMensajes(chatId) {
    try {
        const mensajes = await chatService.obtenerMensajesPorChat(chatId);
        mostrarMensajes(mensajes);
    } catch (error) {
        console.error('Error loading messages:', error);
        showError('chatMessages', 'Error al cargar mensajes');
    }
}

function mostrarMensajes(mensajes) {
    const chatMessages = document.getElementById('chatMessages');
    
    if (!mensajes || mensajes.length === 0) {
        chatMessages.innerHTML = `
            <div class="text-center p-5 text-muted">
                <i class="bi bi-chat-dots" style="font-size: 2rem;"></i>
                <p class="mt-3">No hay mensajes. ¡Envía el primero!</p>
            </div>
        `;
        return;
    }
    
    chatMessages.innerHTML = mensajes.map(mensaje => {
        const isSent = mensaje.remitente === user.id;
        const fecha = new Date(mensaje.fechaHoraMensaje);
        
        return `
            <div class="message ${isSent ? 'message-sent' : 'message-received'}">
                <div class="message-content">${mensaje.mensaje}</div>
                <div class="message-time">
                    ${fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
            </div>
        `;
    }).join('');
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function enviarMensaje() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || !currentChatId || !selectedUserId) return;
    
    try {
        const mensajeData = {
            mensaje: message,
            remitente: user.id,
            destinatario: selectedUserId,
            estadoMensaje: 1,
            chat: currentChatId,
            fechaHoraMensaje: new Date().toISOString()
        };
        
        await chatService.enviarMensaje(mensajeData);
        
        messageInput.value = '';
        await cargarMensajes(currentChatId);
        
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Error al enviar mensaje');
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="text-center p-3 text-danger">
                <i class="bi bi-exclamation-triangle"></i>
                <p class="mt-2">${message}</p>
            </div>
        `;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeChat);
