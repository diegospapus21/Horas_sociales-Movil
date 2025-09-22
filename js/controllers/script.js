// js/script.js
import { LogInCoordinadores, LogInAdministradores, LogInEstudiantes } from '../services/UsuariosService.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('Correo').value;
        const password = document.getElementById('Contraseña').value;
        
        // Validar campos
        if (!email || !password) {
            alert('Por favor, complete todos los campos');
            return;
        }
        
        // Mostrar estado de carga
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading-spinner"></div> Iniciando sesión...';
        
        try {
            // Intentar login según el tipo de usuario
            let user = null;
            let userType = '';
            
            // Intentar como coordinador
            try {
                const coordinadores = await LogInCoordinadores(correo);
                if (coordinadores && coordinadores.length > 0) {
                    user = coordinadores.find(u => u.contrasena === password);
                    if (user) userType = 'COORDINADOR';
                }
            } catch (error) {
                console.log('No es coordinador o error al buscar:', error);
            }
            
            // Si no es coordinador, intentar como administrador
            if (!user) {
                try {
                    const administradores = await LogInAdministradores(correo);
                    if (administradores && administradores.length > 0) {
                        user = administradores.find(u => u.contrasena === password);
                        if (user) userType = 'ADMINISTRADOR';
                    }
                } catch (error) {
                    console.log('No es administrador o error al buscar:', error);
                }
            }
            
            // Si no es administrador, intentar como estudiante
            if (!user) {
                try {
                    const estudiantes = await LogInEstudiantes(email);
                    if (estudiantes && estudiantes.length > 0) {
                        user = estudiantes.find(u => u.contrasena === password);
                        if (user) userType = 'ESTUDIANTE';
                    }
                } catch (error) {
                    console.log('No es estudiante o error al buscar:', error);
                }
            }
            
            if (user && userType) {
                // Guardar datos de usuario en localStorage
                localStorage.setItem('userData', JSON.stringify({
                    id: user.id,
                    nombre: user.nombre,
                    correo: user.correo,
                    codigo: user.codigo || user.id,
                    tipo: userType
                }));
                
                // Redirigir según el tipo de usuario
                switch (userType) {
                    case 'COORDINADOR':
                    case 'ADMINISTRADOR':
                        window.location.href = 'DashboardC.html';
                        break;
                    case 'ESTUDIANTE':
                        window.location.href = 'DashboardE.html';
                        break;
                    default:
                        alert('Tipo de usuario no reconocido');
                }
            } else {
                alert('Credenciales incorrectas o usuario no encontrado');
            }
        } catch (error) {
            console.error('Error en inicio de sesión:', error);
            alert('Error al iniciar sesión. Por favor, intente nuevamente.');
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
    
    // Estilo para el spinner de carga
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});