// js/chatCController.js
import { traerEstudiantes, getByNombre } from '../services/EstudiantesService.js';

document.addEventListener('DOMContentLoaded', function() {
    const contactsList = document.getElementById('contactsList');
    const searchInput = document.querySelector('.search-input');
    const chatHeader = document.getElementById('chatHeader');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    // Verificar autenticación (solo coordinadores/administradores)
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData || (userData.tipo !== 'COORDINADOR' && userData.tipo !== 'ADMINISTRADOR')) {
        window.location.href = 'index2.html';
        return;
    }
    
    let estudiantes = [];
    let estudianteSeleccionado = null;

    // Cargar lista de estudiantes
    async function cargarEstudiantes() {
        try {
            const response = await traerEstudiantes(0, 50);
            estudiantes = response.content || [];
            mostrarEstudiantes(estudiantes);
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
            contactsList.innerHTML = `
                <div class="text-center p-3 text-danger">
                    <p>Error al cargar estudiantes. Intente nuevamente.</p>
                </div>
            `;
        }
    }

    // Mostrar estudiantes en la lista
    function mostrarEstudiantes(listaEstudiantes) {
        if (listaEstudiantes.length === 0) {
            contactsList.innerHTML = `
                <div class="text-center p-3 text-muted">
                    <p>No se encontraron estudiantes.</p>
                </div>
            `;
            return;
        }

        contactsList.innerHTML = '';
        listaEstudiantes.forEach(estudiante => {
            const estudianteElement = document.createElement('div');
            estudianteElement.className = 'contact-item';
            estudianteElement.innerHTML = `
                <div class="d-flex align-items-center p-3">
                    <div class="flex-shrink-0">
                        <img src="img/default-avatar.png" alt="Avatar" class="avatar-sm rounded-circle">
                    </div>
                    <div class="flex-grow-1 ms-3">
                        <h6 class="mb-0">${estudiante.nombre} ${estudiante.apellido}</h6>
                        <small class="text-muted">${estudiante.codigo}</small>
                    </div>
                </div>
            `;
            
            estudianteElement.addEventListener('click', () => {
                seleccionarEstudiante(estudiante);
            });
            
            contactsList.appendChild(estudianteElement);
        });
    }

    // Seleccionar estudiante para chatear
    function seleccionarEstudiante(estudiante) {
        estudianteSeleccionado = estudiante;
        chatHeader.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="img/default-avatar.png" alt="Avatar" class="avatar-sm rounded-circle me-2">
                <div>
                    <h5 class="mb-0">${estudiante.nombre} ${estudiante.apellido}</h5>
                    <small class="text-muted">${estudiante.codigo}</small>
                </div>
            </div>
        `;
        
        messageInput.disabled = false;
        sendButton.disabled = false;
        
        // Cargar historial de mensajes
        cargarMensajes(estudiante.codigo);
    }

    // Buscar estudiantes
    searchInput.addEventListener('input', async (e) => {
        const searchTerm = e.target.value.trim();
        
        if (searchTerm.length === 0) {
            mostrarEstudiantes(estudiantes);
            return;
        }
        
        try {
            const response = await getByNombre(searchTerm, 0, 20);
            mostrarEstudiantes(response.content || []);
        } catch (error) {
            console.error('Error al buscar estudiantes:', error);
        }
    });

    // Enviar mensaje
    sendButton.addEventListener('click', enviarMensaje);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje();
        }
    });

    function enviarMensaje() {
        const mensaje = messageInput.value.trim();
        if (!mensaje || !estudianteSeleccionado) return;
        
        // Aquí implementarías el envío del mensaje a tu API
        console.log(`Enviando mensaje a ${estudianteSeleccionado.codigo}: ${mensaje}`);
        
        // Limpiar campo de entrada
        messageInput.value = '';
    }

    // Cargar mensajes del chat
    function cargarMensajes(codigoEstudiante) {
        // Implementar según tu API de mensajes
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="text-center p-5 text-muted">
                <i class="bi bi-chat-dots" style="font-size: 3rem;"></i>
                <p class="mt-3">No hay mensajes aún. Inicia una conversación.</p>
            </div>
        `;
    }

    // Inicializar
    cargarEstudiantes();
});