// js/eventosController.js
import { agregarEvento } from '../services/EventosService.js';
import { traerProyectosActivos } from '../services/ProyectosService.js';

document.addEventListener('DOMContentLoaded', function() {
    const eventForm = document.getElementById('event-form');
    const proyectoSelect = document.getElementById('proyecto');
    const submitBtn = document.getElementById('submit-btn');

    // Verificar autenticación (solo coordinadores/administradores)
    let userData = {};
    try {
        userData = JSON.parse(localStorage.getItem('userData') || '{}') || {};
    } catch (err) {
        userData = {};
    }

    if (!userData || (userData.tipo !== 'COORDINADOR' && userData.tipo !== 'ADMINISTRADOR')) {
        window.location.href = 'index2.html';
        return;
    }

    // Cargar proyectos en el select
    async function cargarProyectos() {
        try {
            const response = await traerProyectosActivos(0, 50);
            const proyectos = response?.content ?? response ?? [];

            if (Array.isArray(proyectos) && proyectos.length > 0) {
                proyectoSelect.innerHTML = '<option value="">Seleccione un proyecto</option>';
                proyectos.forEach(proyecto => {
                    const option = document.createElement('option');
                    option.value = proyecto.id;
                    option.textContent = proyecto.nombre;
                    proyectoSelect.appendChild(option);
                });
                proyectoSelect.disabled = false;
            } else {
                proyectoSelect.innerHTML = '<option value="">No hay proyectos disponibles</option>';
                proyectoSelect.disabled = true;
            }
        } catch (error) {
            console.error('Error al cargar proyectos:', error);
            proyectoSelect.innerHTML = '<option value="">Error al cargar proyectos</option>';
            proyectoSelect.disabled = true;
        }
    }

    // Manejar envío del formulario
    eventForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar formulario
        if (!eventForm.checkValidity()) {
            eventForm.reportValidity();
            return;
        }

        // Recoger datos del formulario
        const formData = new FormData(eventForm);
        const proyectoId = parseInt(formData.get('proyecto'), 10);
        const horasGanadas = parseInt(formData.get('horas_ganadas'), 10);

        const eventoData = {
            nombre: formData.get('nombre')?.trim(),
            proyecto: proyectoId ? { id: proyectoId } : null,
            fecha: formData.get('fecha'),
            hora: formData.get('hora'),
            lugar: formData.get('lugar')?.trim(),
            horasGanadas: isNaN(horasGanadas) ? 0 : horasGanadas,
            descripcion: formData.get('descripcion')?.trim(),
            creadoPorId: userData.id // ID del usuario creador
        };

        if (!eventoData.proyecto) {
            alert('Debe seleccionar un proyecto válido');
            return;
        }

        // Deshabilitar botón durante el envío
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Guardando...';

        try {
            await agregarEvento(eventoData);

            // Mostrar mensaje de éxito
            alert(' Evento agregado correctamente');

            // Limpiar formulario
            eventForm.reset();
            proyectoSelect.selectedIndex = 0;
        } catch (error) {
            console.error('Error al agregar evento:', error);
            alert(' Error al agregar evento. Por favor, intente nuevamente.');
        } finally {
            // Rehabilitar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Agregar evento';
        }
    });

    // Cargar proyectos al iniciar
    cargarProyectos();
});