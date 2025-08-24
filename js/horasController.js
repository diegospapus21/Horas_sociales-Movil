import { authService, horasService, calendarioService } from './services.js';
import { setupProtectedPage } from './authMiddleware.js';

let user = null;

export async function initializeHoras() {
    user = setupProtectedPage();
    if (!user) return;
    
    setupEventListeners();
    await loadHorasSociales();
    await loadActividadesCompletadas();
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

async function loadHorasSociales() {
    try {
        if (!user.codigo) {
            throw new Error('Código de estudiante no disponible');
        }

        const horasData = await horasService.obtenerHorasPorEstudiante(user.codigo);
        const horas = horasData.horas || 0;
        const porcentaje = horasData.porcentaje || 0;
        const horasFaltantes = 150 - horas;

        // Actualizar UI
        document.getElementById('total-horas').textContent = horas;
        document.getElementById('horas-faltantes').textContent = horasFaltantes;
        document.getElementById('porcentaje-completado').textContent = `${porcentaje.toFixed(1)}%`;
        document.getElementById('texto-progreso').textContent = `${horas}/150 horas`;
        
        const progressBar = document.getElementById('barra-progreso');
        progressBar.style.width = `${porcentaje}%`;
        progressBar.textContent = `${porcentaje.toFixed(1)}%`;

    } catch (error) {
        console.error('Error al cargar horas sociales:', error);
        showError('Error al cargar horas sociales');
    }
}

async function loadActividadesCompletadas() {
    try {
        const actividades = await calendarioService.obtenerActividadesPorEstudiante(user.codigo);
        const actividadesCompletadas = actividades.filter(act => act.asistenciaActividad);
        
        displayActividadesCompletadas(actividadesCompletadas);
    } catch (error) {
        console.error('Error al cargar actividades:', error);
        showError('Error al cargar actividades completadas');
    }
}

function displayActividadesCompletadas(actividades) {
    const container = document.getElementById('lista-actividades');
    
    if (!actividades || actividades.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                <p class="mt-2">No hay actividades completadas</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = actividades.map(actividad => {
        const fecha = new Date(actividad.fecha_hora_actividad);
        
        return `
            <div class="actividad-expirada">
                <div class="actividad-header">
                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                    ${actividad.nombre_Proyecto || 'Actividad'}
                </div>
                <div class="actividad-detalle">
                    <span>${fecha.toLocaleDateString()}</span>
                    <span class="badge bg-success">+${actividad.horas_ganadas || 0}h</span>
                </div>
            </div>
        `;
    }).join('');
}

function showError(message) {
    // Puedes implementar un sistema de notificaciones más elegante
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        <i class="bi bi-exclamation-triangle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('main').prepend(alertDiv);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeHoras);