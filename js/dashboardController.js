// dashboardController.js - Controlador del Dashboard
import { authService, horasService, eventosService, calendarioService } from './services.js';

// Elementos DOM
let user = null;

// Inicializar dashboard
export async function initializeDashboard() {
    // Verificar autenticación
    if (!authService.isAuthenticated()) {
        window.location.href = 'index2.html';
        return;
    }

    user = authService.getCurrentUser();
    setupUserInfo();
    setupEventListeners();
    
    // Cargar datos
    await Promise.all([
        loadHorasSociales(),
        loadProximaActividad(),
        loadProximosEventos()
    ]);
}

// Configurar información del usuario
function setupUserInfo() {
    if (user) {
        document.getElementById('user-name').textContent = `${user.nombre || 'Usuario'} ${user.apellido || ''}`;
        document.getElementById('user-role').textContent = user.id_rol === 2 ? 'Coordinador' : 'Estudiante';
        document.getElementById('welcome-message').textContent = `Bienvenido${user.nombre ? ', ' + user.nombre : ''} al Sistema de Horas Sociales`;
        
        if (user.foto) {
            document.getElementById('user-avatar').src = user.foto;
        }
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authService.logout();
        });
    }
}

// Cargar horas sociales
async function loadHorasSociales() {
    try {
        if (!user.codigo) return;

        const horasData = await horasService.obtenerHorasPorEstudiante(user.codigo);
        const horas = horasData.horas || 0;
        const porcentaje = horasData.porcentaje || 0;
        const horasFaltantes = 150 - horas;

        // Actualizar UI
        document.getElementById('horas-completadas').textContent = horas;
        document.getElementById('horas-faltantes').textContent = horasFaltantes;
        document.getElementById('percentage-text').textContent = `${porcentaje.toFixed(1)}%`;
        
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = `${porcentaje}%`;
        progressBar.setAttribute('aria-valuenow', porcentaje);
        progressBar.textContent = `${porcentaje.toFixed(1)}%`;
        
        document.getElementById('progress-pie').style.setProperty('--percentage', `${porcentaje}%`);

    } catch (error) {
        console.error('Error al cargar horas sociales:', error);
        showError('horas-completadas', 'Error al cargar horas');
    }
}

// Cargar próxima actividad
async function loadProximaActividad() {
    try {
        const actividades = await calendarioService.obtenerActividadesPorEstudiante(user.codigo);
        const container = document.getElementById('proxima-actividad-content');
        
        if (actividades && actividades.length > 0) {
            actividades.sort((a, b) => new Date(a.fecha_hora_actividad) - new Date(b.fecha_hora_actividad));
            const proximaActividad = actividades[0];
            const fechaEvento = new Date(proximaActividad.fecha_hora_actividad);
            
            container.innerHTML = `
                <div class="inner-card">
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="evento-text text-start">
                            <h6 class="mb-1 fw-bold">${proximaActividad.nombre_evento || 'Actividad'}</h6>
                            <p class="mb-1">${proximaActividad.lugar || 'Por definir'}</p>
                            <small class="text-muted">
                                <i class="bi bi-calendar me-1"></i>
                                ${fechaEvento.toLocaleDateString()} 
                                <i class="bi bi-clock ms-2 me-1"></i>
                                ${fechaEvento.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </small>
                        </div>
                        <div class="divider-line"></div>
                        <div class="time-text text-center">
                            <div class="fw-bold text-primary">${fechaEvento.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            <small>Hora</small>
                        </div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="text-center py-3">
                    <i class="bi bi-calendar-x text-muted" style="font-size: 2rem;"></i>
                    <p class="mt-2 text-muted">No hay actividades próximas</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error al cargar próxima actividad:', error);
        showError('proxima-actividad-content', 'Error al cargar actividades');
    }
}

// Cargar próximos eventos
async function loadProximosEventos() {
    try {
        let eventos = [];
        
        if (user.proyectoId) {
            eventos = await eventosService.obtenerEventosPorProyecto(user.proyectoId);
        } else {
            eventos = await eventosService.obtenerEventos();
        }

        const ahora = new Date();
        const eventosFuturos = eventos
            .filter(evento => new Date(evento.fecha_hora_actividad) > ahora)
            .sort((a, b) => new Date(a.fecha_hora_actividad) - new Date(b.fecha_hora_actividad))
            .slice(0, 5);

        const container = document.getElementById('proximos-eventos-content');
        
        if (eventosFuturos.length > 0) {
            container.innerHTML = eventosFuturos.map(evento => {
                const fechaEvento = new Date(evento.fecha_hora_actividad);
                return `
                    <div class="evento-card card mb-2">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="flex-grow-1">
                                    <h6 class="card-title mb-1">${evento.nombre_evento || 'Evento'}</h6>
                                    <p class="card-text mb-1 small">${evento.descripcion ? evento.descripcion.substring(0, 100) + '...' : 'Sin descripción'}</p>
                                    <div class="d-flex align-items-center text-muted small">
                                        <i class="bi bi-geo-alt me-1"></i>
                                        <span class="me-3">${evento.lugar || 'Por definir'}</span>
                                        <i class="bi bi-clock me-1"></i>
                                        <span>${fechaEvento.toLocaleDateString()} ${fechaEvento.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </div>
                                <span class="badge bg-primary ms-2">${evento.horas_ganadas || 0}h</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            container.innerHTML = `
                <div class="text-center py-3">
                    <i class="bi bi-calendar-event text-muted" style="font-size: 2rem;"></i>
                    <p class="mt-2 text-muted">No hay eventos próximos</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        showError('proximos-eventos-content', 'Error al cargar eventos');
    }
}

// Mostrar error
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="text-center py-3 text-danger">
                <i class="bi bi-exclamation-triangle"></i>
                <p class="mt-2">${message}</p>
            </div>
        `;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeDashboard);