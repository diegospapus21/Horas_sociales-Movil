// script.js - Controlador de Login
import { authService } from './services.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const correo = document.getElementById('Correo').value;
            const contraseña = document.getElementById('Contraseña').value;
            
            try {
                const usuario = await authService.login(correo, contraseña);
                
                if (usuario.id_rol === 2) {
                    window.location.href = 'DashboardC.html';
                } else if (usuario.id_rol === 3) {
                    window.location.href = 'DashboardE.html';
                } else {
                    alert('Rol no reconocido');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }
});