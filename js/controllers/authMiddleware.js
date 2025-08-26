// authMiddleware.js - Middleware de autenticación
import { authService } from './services.js';

export function initializeAuth() {
    if (!authService.isAuthenticated()) {
        window.location.href = 'index2.html';
        return null;
    }
    
    const user = authService.getCurrentUser();
    
    // Verificar permisos según la página
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'DashboardC.html' && !authService.isCoordinador()) {
        alert('Acceso denegado. Solo para coordinadores.');
        authService.logout();
        return null;
    }
    
    if (currentPage === 'DashboardE.html' && !authService.isEstudiante()) {
        alert('Acceso denegado. Solo para estudiantes.');
        authService.logout();
        return null;
    }
    
    return user;
}

export function loadUserNavbar() {
    const user = authService.getCurrentUser();
    if (!user) return;
    
    // Actualizar elementos de la UI con información del usuario
    const userElements = document.querySelectorAll('[data-user]');
    userElements.forEach(element => {
        const property = element.getAttribute('data-user');
        if (user[property]) {
            element.textContent = user[property];
        }
    });
    
    // Actualizar avatar
    const avatarElement = document.getElementById('user-avatar');
    if (avatarElement && user.foto) {
        avatarElement.src = user.foto;
    }
    
    // Configurar logout
    const logoutButtons = document.querySelectorAll('[data-logout]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            authService.logout();
        });
    });
}

export function setupProtectedPage() {
    const user = initializeAuth();
    if (user) {
        loadUserNavbar();
    }
    return user;
}