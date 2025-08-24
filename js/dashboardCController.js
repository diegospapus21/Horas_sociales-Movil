// dashboardCController.js - Dashboard Coordinador
import { authService, proyectosService, estudiantesService, eventosService } from './services.js';
import { setupProtectedPage } from './authMiddleware.js';

let user = null;

export async function initializeDashboard() {
    user = setupProtectedPage();
    if (!user) return;
    
    setupEventListeners();
    await loadDashboardData();
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

async function loadDashboardData() {
    try {
        await Promise.all([
            loadProyectos(),
            loadEstadisticas()
        ]);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Error al cargar el dashboard');
    }
}

async function loadProyectos() {
    try {
        const proyectos = await proyectosService.obtenerProyectosActivos();
        displayProyectos(proyectos);
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('proyectos-container').innerHTML = `
            <div class="text-center text-danger py-4">
                <i class="bi bi-exclamation-triangle"></i>
                <p>Error al cargar proyectos</p>
            </div>
        `;
    }
}

function displayProyectos(proyectos) {
    const container = document.getElementById('proyectos-container');
    
    if (!proyectos || proyectos.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="bi bi-inbox"></i>
                <p>No hay proyectos activos</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = proyectos.map(proyecto => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="card-title">${proyecto.nombre_Proyecto}</h5>
                        <p class="card-text">${proyecto.concepto_Proyecto}</p>
                        <div class="d-flex gap-3 text-muted small">
                            <span><i class="bi bi-people"></i> ${proyecto.cupos_Proyectos} cupos</span>
                            <span><i class="bi ${proyecto.vigencia_Proyecto ? 'bi-check-circle text-success' : 'bi-x-circle text-danger'}"></i> 
                                ${proyecto.vigencia_Proyecto ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-eye"></i> Ver
                        </button>
                        <button class="btn btn-outline-secondary btn-sm">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

async function loadEstadisticas() {
    // Datos de ejemplo - deberías implementar endpoints reales
    document.getElementById('total-estudiantes').textContent = '45';
    document.getElementById('total-eventos').textContent = '12';
    document.getElementById('solicitudes-pendientes').textContent = '8';
    document.getElementById('horas-totales').textContent = '1,250';
}

function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        <i class="bi bi-exclamation-triangle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container').prepend(alertDiv);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeDashboard);