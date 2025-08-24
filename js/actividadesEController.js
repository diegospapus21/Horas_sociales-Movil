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
        let eventos = [];
        
        if (user.proyectoId) {
            eventos = await eventosService.obtenerEventosPorProyecto(user.proyectoId);
        } else {
            eventos = await eventosService.obtenerEventos();
        }
        
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
    
    // Filtrar y ordenar eventos futuros
    const ahora = new Date();
    const eventosFuturos = eventos
        .filter(evento => new Date(evento.fecha_hora_actividad) > ahora)
        .sort((a, b) => new Date(a.fecha_hora_actividad) - new Date(b.fecha_hora_actividad));
    
    if (eventosFuturos.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-calendar-check" style="font-size: 3rem;"></i>
                <p class="mt-3">No hay actividades próximas</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = eventosFuturos.map(evento => {
        const fechaEvento = new Date(evento.fecha_hora_actividad);
        
        return `
            <div class="actividad-card">
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
                    <i class="bi bi-chevron-down"></i>
                </div>
                <div class="actividad-contenido">
                    <div class="actividad-descripcion">
                        <p>${evento.descripcion || 'Sin descripción'}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="bi bi-clock me-1"></i>
                                Duración: ${evento.horas_ganadas || 0} horas
                            </small>
                            <span class="badge bg-primary">
                                <i class="bi bi-award me-1"></i>+${evento.horas_ganadas || 0}h
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeActividades);