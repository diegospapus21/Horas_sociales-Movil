import { authService, eventosService, proyectosService } from './services.js';
import { setupProtectedPage } from './authMiddleware.js';

let user = null;

export async function initializeEventos() {
    user = setupProtectedPage();
    if (!user || !authService.isCoordinador()) {
        alert('Solo los coordinadores pueden crear eventos');
        window.location.href = 'DashboardE.html';
        return;
    }
    
    setupEventListeners();
    await loadProyectos();
}

function setupEventListeners() {
    const eventForm = document.getElementById('event-form');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventSubmit);
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authService.logout();
        });
    }
}

async function loadProyectos() {
    try {
        const proyectos = await proyectosService.obtenerProyectosActivos();
        const select = document.getElementById('proyecto');
        
        if (proyectos && proyectos.length > 0) {
            select.innerHTML = proyectos.map(proyecto => 
                `<option value="${proyecto.id_Proyecto}">${proyecto.nombre_Proyecto}</option>`
            ).join('');
        } else {
            select.innerHTML = '<option value="">No hay proyectos disponibles</option>';
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('proyecto').innerHTML = '<option value="">Error al cargar proyectos</option>';
    }
}

async function handleEventSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Creando evento...';
        submitBtn.disabled = true;
        
        const formData = new FormData(e.target);
        const eventoData = {
            nombre_evento: formData.get('nombre'),
            descripcion: formData.get('descripcion'),
            id_proyecto: formData.get('proyecto'),
            lugar: formData.get('lugar'),
            horas_ganadas: parseInt(formData.get('horas_ganadas')),
            fecha_hora_actividad: `${formData.get('fecha')}T${formData.get('hora')}:00`,
            id_coordinador: user.id,
            fecha_creacion: new Date().toISOString().split('T')[0],
            estado: true
        };
        
        await eventosService.crearEvento(eventoData);
        
        showNotification('Evento creado exitosamente', 'success');
        e.target.reset();
        
    } catch (error) {
        console.error('Error creating event:', error);
        showNotification('Error al crear evento: ' + error.message, 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function showNotification(message, type) {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    notification.innerHTML = `
        <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insertar después del formulario
    const formSection = document.querySelector('.form-section');
    formSection.insertBefore(notification, formSection.firstChild);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.parentNode.removeChild(notification), 500);
        }
    }, 5000);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeEventos);