import { LoginService } from '../services/AuthService.js';

export class LoginController {
    constructor() {
        this.loginService = new LoginService();
        this.loginForm = document.getElementById('login-form');
        this.init();
    }

    init() {
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Verificar si ya hay una sesión activa
        this.checkExistingSession();
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('Correo').value;
        const password = document.getElementById('Contraseña').value;

        // Validación básica
        if (!this.validateEmail(email)) {
            this.showError('Por favor ingresa un correo electrónico válido');
            return;
        }

        if (!password) {
            this.showError('Por favor ingresa tu contraseña');
            return;
        }

        try {
            // Mostrar loading
            const submitBtn = this.loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Iniciando sesión...';
            submitBtn.disabled = true;

            const credentials = {
                correo: email,
                contrasenia: password
            };

            const result = await this.loginService.login(credentials);
            
            // Redirigir según el rol del usuario
            this.redirectByRole(result.user);

        } catch (error) {
            this.showError('Credenciales incorrectas. Por favor verifica tus datos.');
            console.error('Login error:', error);
        } finally {
            // Restaurar botón
            const submitBtn = this.loginForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Iniciar Sesión';
            submitBtn.disabled = false;
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.includes('ricaldone.edu.sv');
    }

    showError(message) {
        // Remover errores previos
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Crear y mostrar nuevo error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message alert alert-danger mt-3';
        errorDiv.textContent = message;
        
        this.loginForm.insertBefore(errorDiv, this.loginForm.querySelector('.credits'));
    }

    redirectByRole(user) {
        const role = user.ID_Rol;
        
        switch(role) {
            case 1: // Administrador
                window.location.href = 'admin-dashboard.html';
                break;
            case 2: // Coordinador
                window.location.href = 'coordinator-dashboard.html';
                break;
            case 3: // Estudiante
                window.location.href = 'student-dashboard.html';
                break;
            default:
                window.location.href = 'dashboard.html';
        }
    }

    async checkExistingSession() {
        const isValid = await this.loginService.validateSession();
        if (isValid) {
            const user = this.loginService.getCurrentUser();
            if (user) {
                this.redirectByRole(user);
            }
        }
    }
}