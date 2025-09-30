import { RegisterController } from './registerController.js';

// Inicializar el controlador de registro cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    new RegisterController();
});

// Funciones globales para el dropdown (para mantener compatibilidad con tu HTML)
let registerController;

document.addEventListener('DOMContentLoaded', function() {
    registerController = new RegisterController();
});

function toggleDropdown() {
    if (registerController) {
        registerController.toggleDropdown();
    }
}

function selectOption(value, display) {
    // Esta función se mantiene por compatibilidad, pero usa el controlador
    console.log('Opción seleccionada:', value, display);
}