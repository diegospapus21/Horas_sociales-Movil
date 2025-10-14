import { LogInAdministradores, LogInCoordinadores, LogInEstudiantes } from '../Services/AuthService.js';

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
            console.log(' Intentando login para:', correo);

            // Intentar login como Coordinador
            const coordi = {
                'correo': correo,
            'contrasenia': contrasena, 
            'id_rol': 2
            }
            console.log(' Intentando como Coordinador...');
            const response = await LogInCoordinadores(coordi);
            
            if (response.ok) {
                const responseData = await response.json();
                console.log(' Login Coordinador exitoso:', responseData.result);
                window.location.href = 'coordinator-dashboard.html';
                return;
            } else {
                const errorText = await response.json();
                console.log(' Error Coordinador:', errorText.result);
            }

             const Estudiante = {
                'correo': correo,
            'contrasenia': contrasena, 
            'id_rol': 3
            }
            console.log(' Intentando como Estudiante...');
            const response2 = await LogInEstudiantes(Estudiante);
            
            if (response2.ok) {
                const responseData = await response2.json();
                console.log(' Login Estudiante exitoso:', responseData.result);
                window.location.href = 'student-dashboard.html';
                return;
            } else {
                const errorText = await response2.json();
                console.log(' Error Estudiante:', errorText.result);
            }

            mostrarError('Credenciales incorrectas. Por favor, verifique su correo y contraseña.');

        } catch (error) {
            console.error(' Error en el login:', error);
            
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