// js/chatCController.js
import { traerEstudiantes, getByNombre } from '../services/EstudiantesService.js';
import { enviarMensaje as enviarMensajeAPI, obtenerMensajes as obtenerMensajesAPI } from '../services/MensajesService.js';

document.addEventListener('DOMContentLoaded', function() {
    const contactsList = document.getElementById('contactsList');
    const searchInput = document.querySelector('.search-input');
    const chatHeader = document.getElementById('chatHeader');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');

    // Parse seguro de userData
    let userData = {};
    try {
        userData = JSON.parse(localStorage.getItem('userData') || '{}') || {};
    } catch (err) {
        userData = {};
    }

    // Validación de rol
    if (!userData || (userData.tipo !== 'COORDINADOR' && userData.tipo !== 'ADMINISTRADOR')) {
        window.location.href = 'index2.html';
        return;
    }

    let estudiantes = [];
    let estudianteSeleccionado = null;

    // ---- Debounce helper ----
    function debounce(fn, wait = 300) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), wait);
        };
    }

    // ---- Cargar estudiantes ----
    async function cargarEstudiantes() {
        contactsList.innerHTML = <div class="text-center p-3">Cargando...</div>;
        try {
            const response = await traerEstudiantes(0, 50);
            estudiantes = response?.content || [];
            mostrarEstudiantes(estudiantes);
        } catch (error) {
            contactsList.innerHTML = <div class="text-center p-3 text-danger">Error al cargar estudiantes</div>;
        }
    }

    function mostrarEstudiantes(lista = []) {
        if (lista.length === 0) {
            contactsList.innerHTML = <div class="text-center p-3">No se encontraron estudiantes</div>;
            return;
        }
        contactsList.innerHTML = '';
        lista.forEach(estudiante => {
            const item = document.createElement('div');
            item.className = 'contact-item';
            item.innerHTML = `
                <div class="d-flex align-items-center p-3">
                    <img src="img/default-avatar.png" class="avatar-sm rounded-circle">
                    <div class="ms-3">
                        <h6 class="mb-0">${estudiante.nombre || ''} ${estudiante.apellido || ''}</h6>
                        <small class="text-muted">${estudiante.codigo || ''}</small>
                    </div>
                </div>
            `;
            item.addEventListener('click', () => seleccionarEstudiante(estudiante));
            contactsList.appendChild(item);
        });
    }

    // ---- Seleccionar estudiante ----
    async function seleccionarEstudiante(estudiante) {
        estudianteSeleccionado = estudiante;
        chatHeader.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="img/default-avatar.png" class="avatar-sm rounded-circle me-2">
                <div>
                    <h5 class="mb-0">${estudiante.nombre || ''} ${estudiante.apellido || ''}</h5>
                    <small class="text-muted">${estudiante.codigo || ''}</small>
                </div>
            </div>
        `;
        messageInput.disabled = false;
        sendButton.disabled = false;
        await cargarMensajes(estudiante.codigo);
    }

    // ---- Buscar estudiante ----
    const buscarDebounced = debounce(async (term) => {
        if (!term) {
            mostrarEstudiantes(estudiantes);
            return;
        }
        try {
            const response = await getByNombre(term, 0, 20);
            mostrarEstudiantes(response?.content || []);
        } catch (error) {
            console.error('Error en búsqueda:', error);
        }
    }, 250);

    searchInput.addEventListener('input', (e) => {
        buscarDebounced(e.target.value.trim());
    });

    // ---- Enviar mensaje ----
    async function enviarMensaje() {
        if (!estudianteSeleccionado) return;
        const texto = messageInput.value.trim();
        if (!texto) return;

        sendButton.disabled = true;
        try {
            await enviarMensajeAPI({
                destinoCodigo: estudianteSeleccionado.codigo,
                texto,
                enviadoPorId: userData.id
            });
            messageInput.value = '';
            await cargarMensajes(estudianteSeleccionado.codigo);
        } catch (error) {
            alert('No se pudo enviar el mensaje');
        } finally {
            sendButton.disabled = false;
            messageInput.focus();
        }
    }

    sendButton.addEventListener('click', enviarMensaje);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje();
        }
    });

    // ---- Cargar mensajes ----
    async function cargarMensajes(codigoEstudiante) {
        chatMessages.innerHTML = <div class="text-center p-3">Cargando mensajes...</div>;
        try {
            const mensajes = await obtenerMensajesAPI(codigoEstudiante);
            if (!Array.isArray(mensajes) || mensajes.length === 0) {
                chatMessages.innerHTML = <div class="text-center p-3">No hay mensajes aún</div>;
                return;
            }
            chatMessages.innerHTML = mensajes.map(msg => {
                const esMio = String(msg.enviadoPorId) === String(userData.id);
                return `
                    <div class="message ${esMio ? 'sent' : 'received'}">
                        <div class="card ${esMio ? 'bg-primary text-white' : ''}">
                            <div class="card-body p-2">
                                <p class="mb-1 small">${escapeHtml(msg.texto || '')}</p>
                                <small>${msg.fecha ? new Date(msg.fecha).toLocaleString() : ''}</small>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            chatMessages.innerHTML = <div class="text-center p-3 text-danger">Error al cargar mensajes</div>;
        }
    }

    function escapeHtml(text = '') {
        return text.replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;',
            '"': '&quot;', "'": '&#039;'
        }[m]));
    }

    // Inicializar
    cargarEstudiantes();
});