import { authService, eventosService } from './services.js';
import { setupProtectedPage } from './authMiddleware.js';

let user = null;

export async function initializeActividades() {
    user = setupProtectedPage();
    if (!user) return;
    
    setupEventListeners();
    await loadActividades();
}

function setupEventListeners() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authService.logout();
        });
    }
}

async function loadActividades() {
    try {
        const eventos = await eventosService.obtenerEventos();
        displayActividades(eventos);
    } catch (error) {
        console.error('Error loading activities:', error);
        showError('Error al cargar actividades');
    }
}

function displayActividades(eventos) {
    const container = document.getElementById('actividades-container');
    
    if (!eventos || eventos.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-calendar-x" style="font-size: 3rem;"></i>
                <p class="mt-3">No hay actividades programadas</p>
            </div>
        `;
        return;
    }
    
    // Ordenar eventos por fecha
    eventos.sort((a, b) => new Date(a.fecha_hora_actividad) - new Date(b.fecha_hora_actividad));
    
    container.innerHTML = eventos.map(evento => {
        const fechaEvento = new Date(evento.fecha_hora_actividad);
        const ahora = new Date();
        const esPasado = fechaEvento < ahora;
        
        return `
            <div class="actividad-card ${esPasado ? 'bg-light' : ''}">
                <div class="actividad-header" onclick="toggleActividad(this)">
                    <div class="flex-grow-1">
                        <h6 class="actividad-title">${evento.nombre_evento || 'Evento'}</h6>
                        <div class="actividad-fecha">
                            <i class="bi bi-calendar-event me-1"></i>
                            ${fechaEvento.toLocaleDateString()} 
                            <i class="bi bi-clock ms-2 me-1"></i>
                            ${fechaEvento.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        <small class="text-muted">
                            <i class="bi bi-geo-alt me-1"></i>${evento.lugar || 'Por definir'}
                        </small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarEvento('${evento.id}', event)">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div class="actividad-contenido">
                    <div class="actividad-descripcion">
                        <p>${evento.descripcion || 'Sin descripción'}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="bi bi-clock me-1"></i>
                                Duración: ${evento.horas_ganadas || 0} horas
                            </small>
                            <span class="badge ${esPasado ? 'bg-secondary' : 'bg-success'}">
                                ${esPasado ? 'Completado' : 'Pendiente'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.toggleActividad = function(element) {
    const card = element.closest('.actividad-card');
    card.classList.toggle('abierta');
};

window.eliminarEvento = async function(eventoId, event) {
    event.stopPropagation();
    
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) return;
    
    try {
        await eventosService.eliminarEvento(eventoId);
        showNotification('Evento eliminado correctamente', 'success');
        await loadActividades();
    } catch (error) {
        console.error('Error deleting event:', error);
        showNotification('Error al eliminar evento', 'error');
    }
};

function showError(message) {
    const container = document.getElementById('actividades-container');
    container.innerHTML = `
        <div class="text-center py-5 text-danger">
            <i class="bi bi-exclamation-triangle" style="font-size: 3rem;"></i>
            <p class="mt-3">${message}</p>
            <button class="btn btn-primary mt-2" onclick="location.reload()">
                <i class="bi bi-arrow-clockwise me-2"></i>Reintentar
            </button>
        </div>
    `;
}

function showNotification(message, type) {
    // Implementar sistema de notificaciones
    alert(message);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeActividades);
