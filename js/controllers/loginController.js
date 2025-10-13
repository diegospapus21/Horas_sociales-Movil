import { LogInAdministradores, LogInCoordinadores, LogInEstudiantes } from '../services/AuthService.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const correoInput = document.getElementById('Correo');
    const contrasenaInput = document.getElementById('Contraseña');
    const submitBtn = loginForm.querySelector('.btn');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Iniciando sesión...';

        const correo = correoInput.value.trim();
        const contrasena = contrasenaInput.value;

        try {
            console.log('🔐 Intentando login para:', correo);

            // Intentar login como Administrador
            console.log('🔄 Intentando como Administrador...');
            let response = await LogInAdministradores({ correo, contrasena });
            console.log('📥 Respuesta Admin - Status:', response.status);
            
            if (response.ok) {
                const responseData = await response.text();
                console.log('✅ Login Admin exitoso:', responseData);
                window.location.href = 'admin-dashboard.html';
                return;
            } else {
                const errorText = await response.text();
                console.log('❌ Error Admin:', errorText);
            }

            // Intentar login como Coordinador
            console.log('🔄 Intentando como Coordinador...');
            response = await LogInCoordinadores({ correo, contrasena });
            console.log('📥 Respuesta Coordinador - Status:', response.status);
            
            if (response.ok) {
                const responseData = await response.text();
                console.log('✅ Login Coordinador exitoso:', responseData);
                window.location.href = 'coordinator-dashboard.html';
                return;
            } else {
                const errorText = await response.text();
                console.log('❌ Error Coordinador:', errorText);
            }

            // Intentar login como Estudiante
            console.log('🔄 Intentando como Estudiante...');
            response = await LogInEstudiantes({ correo, contrasena });
            console.log('📥 Respuesta Estudiante - Status:', response.status);
            
            if (response.ok) {
                const responseData = await response.text();
                console.log('✅ Login Estudiante exitoso:', responseData);
                window.location.href = 'student-dashboard.html';
                return;
            } else {
                const errorText = await response.text();
                console.log('❌ Error Estudiante:', errorText);
            }

            mostrarError('Credenciales incorrectas. Por favor, verifique su correo y contraseña.');

        } catch (error) {
            console.error('❌ Error en el login:', error);
            
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                mostrarError('Error de conexión. Verifique su conexión a internet y que no haya bloqueos de CORS.');
            } else {
                mostrarError('Error de conexión. Intente nuevamente.');
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar Sesión';
        }
    });

    function mostrarError(mensaje) {
        const errorExistente = document.querySelector('.error-message');
        if (errorExistente) {
            errorExistente.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message alert alert-danger mt-3';
        errorDiv.textContent = mensaje;
        errorDiv.style.cssText = 'padding: 10px; border-radius: 5px; margin-top: 15px;';

        loginForm.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Validación en tiempo real
    correoInput.addEventListener('input', validarCorreo);
    contrasenaInput.addEventListener('input', validarFormulario);

    function validarCorreo() {
        const correo = correoInput.value.trim();
        const esCorreoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
        
        if (correo && !esCorreoValido) {
            correoInput.style.borderColor = 'var(--rojo-principal)';
        } else {
            correoInput.style.borderColor = '';
        }
        
        validarFormulario();
    }

    function validarFormulario() {
        const correo = correoInput.value.trim();
        const contrasena = contrasenaInput.value;
        const esCorreoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
        
        submitBtn.disabled = !(correo && contrasena && esCorreoValido);
    }

    validarFormulario();
});