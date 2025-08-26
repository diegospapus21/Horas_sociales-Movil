import { authService } from '../service/services.js';
import { setupProtectedPage } from './authMiddleware.js';

let user = null;

export async function initializeEspera() {
    user = setupProtectedPage();
    if (!user) return;
    
    setupEventListeners();
    simularProcesoEspera();
}

function setupEventListeners() {
    const recargarBtn = document.getElementById('recargarBtn');
    if (recargarBtn) {
        recargarBtn.addEventListener('click', verificarEstadoSolicitud);
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authService.logout();
        });
    }
}

function simularProcesoEspera() {
    // Simular un proceso de espera con animación
    const statusMessage = document.querySelector('.status-message');
    let dots = 0;
    
    const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        statusMessage.textContent = 'Solicitud enviada esperando aprobación' + '.'.repeat(dots);
    }, 500);
    
    // Simular verificación cada 5 segundos
    setInterval(verificarEstadoSolicitud, 5000);
}

async function verificarEstadoSolicitud() {
    try {
        // Simular verificación del estado
        const aprobado = Math.random() > 0.7; // 30% de probabilidad de aprobación
        
        if (aprobado) {
            mostrarResultadoAprobado();
        } else {
            // Continuar esperando
            showNotification('La solicitud sigue en proceso de revisión', 'info');
        }
    } catch (error) {
        console.error('Error verificando estado:', error);
        showNotification('Error al verificar el estado', 'error');
    }
}

function mostrarResultadoAprobado() {
    const statusCard = document.querySelector('.status-card');
    statusCard.innerHTML = `
        <div class="text-center">
            <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
            <h3 class="status-message mt-3">¡Solicitud Aprobada!</h3>
            <p class="mb-4">Tu solicitud ha sido aprobada exitosamente.</p>
            <a href="DashboardE.html" class="btn btn-success">
                <i class="bi bi-house me-2"></i>Volver al Dashboard
            </a>
        </div>
    `;
}

function showNotification(message, type) {
    // Implementación simple de notificación
    alert(message);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeEspera);
