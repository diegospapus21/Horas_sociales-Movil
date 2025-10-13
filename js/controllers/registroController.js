// REEMPLAZA completamente el archivo registroController.js con este código:

import { RegistrarEstudiante } from '../Services/AuthService.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Controlador de registro cargado');
    
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) {
        console.error('❌ No se encontró el formulario con id registerForm');
        return;
    }

    const submitBtn = registerForm.querySelector('.btn-primary');
    if (!submitBtn) {
        console.error('❌ No se encontró el botón de submit');
        return;
    }

    console.log('✅ Formulario y botón encontrados correctamente');

    // Validación del correo institucional
    function validarCorreoInstitucional(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@ricaldone\.edu\.sv$/;
        return regex.test(email);
    }

    // Validar código de estudiante (8 dígitos)
    function validarCodigoEstudiante(codigo) {
        return /^\d{8}$/.test(codigo);
    }

    // Validar nombre/apellido (mínimo 4 letras)
    function validarNombreApellido(texto) {
        return texto.length >= 4 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(texto);
    }

    // Validar sección académica (2 letras)
    function validarSeccionAcademica(seccion) {
        return /^[A-Za-z]{2}$/.test(seccion);
    }

    // Validar archivo de foto
    function validarFoto(file) {
        if (!file) return false;
        
        const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
        const tamanoMaximo = 2 * 1024 * 1024; // 2MB
        
        const tipoValido = tiposPermitidos.includes(file.type);
        const tamanoValido = file.size <= tamanoMaximo;
        
        return tipoValido && tamanoValido;
    }

    // Convertir archivo a Base64 (solo la parte de datos)
    function archivoABase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Extraer solo la parte de datos Base64 (sin el prefijo data:image/...)
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }

    // Función de validación en tiempo real
    function validarFormulario() {
        const codigo = document.getElementById('codigo').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const añoAcademico = document.getElementById('año_academico').value;
        const especialidad = document.getElementById('especialidad').value;
        const seccionAcademica = document.getElementById('seccion_academica').value.trim().toUpperCase();
        const foto = document.getElementById('foto').files[0];
        const correoElectronico = document.getElementById('correo_electronico').value.trim();
        const contrasenia = document.getElementById('contrasenia').value;
        const confirmContrasenia = document.getElementById('confirmContrasenia').value;
        
        // Validaciones individuales
        const esCorreoValido = validarCorreoInstitucional(correoElectronico);
        const esCodigoValido = validarCodigoEstudiante(codigo);
        const esNombreValido = validarNombreApellido(nombre);
        const esApellidoValido = validarNombreApellido(apellido);
        const esSeccionValida = validarSeccionAcademica(seccionAcademica);
        const esFotoValida = !foto || validarFoto(foto); // Foto opcional
        
        // Validaciones combinadas
        const todosCamposLlenos = codigo && nombre && apellido && añoAcademico && 
                                  especialidad && seccionAcademica && 
                                  correoElectronico && contrasenia && confirmContrasenia;
        const contraseniasCoinciden = contrasenia === confirmContrasenia;
        const contraseniaValida = contrasenia.length >= 4;
        const correoValido = esCorreoValido;
        const codigoValido = esCodigoValido;
        const nombreValido = esNombreValido;
        const apellidoValido = esApellidoValido;
        const seccionValida = esSeccionValida;
        const fotoValida = esFotoValida;
        
        const formularioValido = todosCamposLlenos && contraseniasCoinciden && 
                               contraseniaValida && correoValido && codigoValido && 
                               nombreValido && apellidoValido && seccionValida && fotoValida;
        
        submitBtn.disabled = !formularioValido;
        
        return formularioValido;
    }

    // Manejo del formulario de registro - CORREGIDO
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('🔄 Formulario enviado - Iniciando registro...');
        
        if (!validarFormularioCompleto()) {
            console.log('❌ Validación fallida - formulario incompleto o inválido');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Creando cuenta...';
        submitBtn.classList.add('btn-loading');

        try {
            const codigo = parseInt(document.getElementById('codigo').value.trim());
            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const añoAcademico = document.getElementById('año_academico').value;
            const especialidad = parseInt(document.getElementById('especialidad').value);
            const seccionAcademica = document.getElementById('seccion_academica').value.trim().toUpperCase();
            const fotoFile = document.getElementById('foto').files[0];
            const correoElectronico = document.getElementById('correo_electronico').value.trim();
            const contrasenia = document.getElementById('contrasenia').value;

            console.log('📝 Datos capturados:', {
                codigo, nombre, apellido, añoAcademico, especialidad, seccionAcademica, correoElectronico
            });

            // Preparar foto (opcional)
            let fotoBase64 = "";
            if (fotoFile && validarFoto(fotoFile)) {
                console.log('🖼️ Convirtiendo foto a Base64...');
                fotoBase64 = await archivoABase64(fotoFile);
            }

            // ESTRUCTURA CORREGIDA - Nombres exactos que espera la API
            const formData = {
                codigo: codigo,
                nombre: nombre,
                apellido: apellido,
                año_academico: parseInt(añoAcademico, 10), // Sin tilde en "academico"
                especialidad: especialidad,
                seccion_academica: seccionAcademica,       // Sin tilde
                foto: fotoBase64 || "default.jpg",         // Valor por defecto si no hay foto
                correo_electronico: correoElectronico,
                contrasenia: contrasenia,
                estado: true                               // Campo REQUERIDO
            };

            console.log('📤 Enviando datos CORREGIDOS al servidor:', {
                ...formData,
                foto: fotoBase64 ? '(Base64 datos)' : 'default.jpg'
            });

            const response = await RegistrarEstudiante(formData);
            
            console.log('📥 Respuesta recibida - Status:', response.status);
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Registro exitoso:', result);
                
                if (result.status === "success" || result.status === "Registro Exitoso") {
                    mostrarExito('¡Cuenta de estudiante creada exitosamente! Redirigiendo al login...');
                    
                    setTimeout(() => {
                        window.location.href = 'Login.html';
                    }, 2000);
                } else {
                    mostrarError(result.message || 'Error en el registro');
                }
            } else {
                let errorData;
                try {
                    errorData = await response.json();
                    console.error('❌ Error del servidor (JSON):', errorData);
                    
                    // Manejar diferentes formatos de error
                    if (errorData.message) {
                        manejarErrorRegistro(errorData.message, response.status);
                    } else if (errorData.errorType) {
                        manejarErrorRegistro(`${errorData.errorType}: ${errorData.message}`, response.status);
                    } else {
                        mostrarError('Error en el registro: ' + JSON.stringify(errorData));
                    }
                } catch (jsonError) {
                    try {
                        const errorText = await response.text();
                        console.error('❌ Error del servidor (texto):', errorText);
                        manejarErrorRegistro(errorText, response.status);
                    } catch (textError) {
                        console.error('❌ No se pudo obtener error:', textError);
                        mostrarError('Error interno del servidor');
                    }
                }
            }

        } catch (error) {
            console.error('💥 Error en el registro:', error);
            mostrarError('Error de conexión. Intente nuevamente.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Registrarse como Estudiante';
            submitBtn.classList.remove('btn-loading');
        }
    });

    function validarFormularioCompleto() {
        let esValido = true;

        const codigo = document.getElementById('codigo').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const añoAcademico = document.getElementById('año_academico').value;
        const especialidad = document.getElementById('especialidad').value;
        const seccionAcademica = document.getElementById('seccion_academica').value.trim().toUpperCase();
        const foto = document.getElementById('foto').files[0];
        const correoElectronico = document.getElementById('correo_electronico').value.trim();
        const contrasenia = document.getElementById('contrasenia').value;
        const confirmContrasenia = document.getElementById('confirmContrasenia').value;

        // Validar código
        if (!codigo) {
            mostrarErrorCampo('codigo', 'Por favor ingresa tu código de estudiante');
            esValido = false;
        } else if (!validarCodigoEstudiante(codigo)) {
            mostrarErrorCampo('codigo', 'El código debe tener 8 dígitos');
            esValido = false;
        } else {
            limpiarErrorCampo('codigo');
        }

        // Validar nombre
        if (!nombre) {
            mostrarErrorCampo('nombre', 'Por favor ingresa tu nombre');
            esValido = false;
        } else if (!validarNombreApellido(nombre)) {
            mostrarErrorCampo('nombre', 'El nombre debe tener al menos 4 letras y solo caracteres alfabéticos');
            esValido = false;
        } else {
            limpiarErrorCampo('nombre');
        }

        // Validar apellido
        if (!apellido) {
            mostrarErrorCampo('apellido', 'Por favor ingresa tu apellido');
            esValido = false;
        } else if (!validarNombreApellido(apellido)) {
            mostrarErrorCampo('apellido', 'El apellido debe tener al menos 4 letras y solo caracteres alfabéticos');
            esValido = false;
        } else {
            limpiarErrorCampo('apellido');
        }

        // Validar año académico
        if (!añoAcademico) {
            mostrarErrorCampo('año_academico', 'Por favor selecciona el año académico');
            esValido = false;
        } else {
            limpiarErrorCampo('año_academico');
        }

        // Validar especialidad
        if (!especialidad) {
            mostrarErrorCampo('especialidad', 'Por favor selecciona tu especialidad');
            esValido = false;
        } else {
            limpiarErrorCampo('especialidad');
        }

        // Validar sección académica
        if (!seccionAcademica) {
            mostrarErrorCampo('seccion_academica', 'Por favor ingresa la sección académica');
            esValido = false;
        } else if (!validarSeccionAcademica(seccionAcademica)) {
            mostrarErrorCampo('seccion_academica', 'La sección debe tener exactamente 2 letras');
            esValido = false;
        } else {
            limpiarErrorCampo('seccion_academica');
        }

        // Validar foto (opcional)
        if (foto && !validarFoto(foto)) {
            mostrarErrorCampo('foto', 'La foto debe ser JPG, PNG o JPEG y menor a 2MB');
            esValido = false;
        } else {
            limpiarErrorCampo('foto');
        }

        // Validar correo institucional
        if (!correoElectronico) {
            mostrarErrorCampo('correo_electronico', 'Por favor ingresa tu correo institucional');
            esValido = false;
        } else if (!validarCorreoInstitucional(correoElectronico)) {
            mostrarErrorCampo('correo_electronico', 'El correo debe ser @ricaldone.edu.sv');
            esValido = false;
        } else {
            limpiarErrorCampo('correo_electronico');
        }

        // Validar contraseña
        if (!contrasenia) {
            mostrarErrorCampo('contrasenia', 'Por favor ingresa tu contraseña');
            esValido = false;
        } else if (contrasenia.length < 4) {
            mostrarErrorCampo('contrasenia', 'La contraseña debe tener al menos 4 caracteres');
            esValido = false;
        } else {
            limpiarErrorCampo('contrasenia');
        }

        // Validar confirmación de contraseña
        if (!confirmContrasenia) {
            mostrarErrorCampo('confirmContrasenia', 'Por favor confirma tu contraseña');
            esValido = false;
        } else if (contrasenia !== confirmContrasenia) {
            mostrarErrorCampo('confirmContrasenia', 'Las contraseñas no coinciden');
            esValido = false;
        } else {
            limpiarErrorCampo('confirmContrasenia');
        }

        return esValido;
    }

    function mostrarErrorCampo(campoId, mensaje) {
        const campo = document.getElementById(campoId);
        const errorElement = document.getElementById(campoId + 'Error');
        
        if (campo && errorElement) {
            campo.classList.add('error');
            errorElement.textContent = mensaje;
            errorElement.style.display = 'block';
        }
    }

    function limpiarErrorCampo(campoId) {
        const campo = document.getElementById(campoId);
        const errorElement = document.getElementById(campoId + 'Error');
        
        if (campo && errorElement) {
            campo.classList.remove('error');
            errorElement.style.display = 'none';
        }
    }

    function mostrarError(mensaje) {
        const errorExistente = document.querySelector('.error-general');
        if (errorExistente) {
            errorExistente.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.textContent = mensaje;

        registerForm.insertBefore(errorDiv, submitBtn);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    function mostrarExito(mensaje) {
        const errorExistente = document.querySelector('.error-general');
        if (errorExistente) {
            errorExistente.remove();
        }

        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success mt-3';
        successDiv.textContent = mensaje;

        registerForm.insertBefore(successDiv, submitBtn);

        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }

    function manejarErrorRegistro(errorText, statusCode) {
        console.log('🔧 ManejarErrorRegistro - Texto:', errorText, 'Status:', statusCode);
        
        if (statusCode === 400) {
            if (errorText.includes('correo') || errorText.includes('ya está') || errorText.includes('email')) {
                mostrarErrorCampo('correo_electronico', 'Este correo electrónico ya está registrado');
            } else if (errorText.includes('código') || errorText.includes('codigo')) {
                mostrarErrorCampo('codigo', 'Este código de estudiante ya está registrado');
            } else if (errorText.includes('VALIDATION_ERROR')) {
                mostrarError('Error de validación: ' + errorText);
            } else {
                mostrarError('Error en los datos: ' + errorText);
            }
        } else if (statusCode === 409) {
            mostrarError('El estudiante ya existe en el sistema');
        } else if (statusCode === 500) {
            mostrarError('Error interno del servidor. Por favor, contacta al administrador.');
        } else {
            mostrarError('Error del servidor: ' + errorText);
        }
    }

    // Event listeners para validación en tiempo real
    const campos = [
        'codigo', 'nombre', 'apellido', 'año_academico', 'especialidad', 
        'seccion_academica', 'foto', 'correo_electronico', 'contrasenia', 'confirmContrasenia'
    ];

    campos.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', validarFormulario);
            campo.addEventListener('change', validarFormulario);
        }
    });

    // Validación inicial
    validarFormulario();
    
    console.log('🎉 Controlador de registro completamente inicializado');
});