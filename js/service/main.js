// main.js - Configuración principal
import { authService } from './services.js';
import { setupProtectedPage } from './authMiddleware.js';

// Configuración global
window.addEventListener('DOMContentLoaded', function() {
    // Configurar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Configurar popovers de Bootstrap
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Inicializar autenticación en páginas protegidas
    if (!window.location.pathname.includes('index2.html') && 
        !window.location.pathname.includes('index.html')) {
        setupProtectedPage();
    }
});

// Utilidades globales
window.formatDate = function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

window.formatTime = function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

window.showNotification = function(message, type = 'success') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.display = 'block';
    
    // Agregar al documento
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
};

window.showLoading = function(element) {
    element.classList.add('loading');
};

window.hideLoading = function(element) {
    element.classList.remove('loading');
};