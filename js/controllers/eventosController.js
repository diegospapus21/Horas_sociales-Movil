// js/eventosController.js
import { agregarEvento } from '../services/EventosService.js';
import { traerProyectosActivos } from '../services/ProyectosService.js';

document.addEventListener('DOMContentLoaded', function() {
    const eventForm = document.getElementById('event-form');
    const proyectoSelect = document.getElementById('proyecto');
    const submitBtn = document.getElementById('submit-btn');

    // Verificar autenticación (solo coordinadores/administradores)
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData || (userData.tipo !== 'COORDINADOR' && userData.tipo !== 'ADMINISTRADOR')) {
        window.location.href = 'index2.html';
        return;
    }

    // Cargar proyectos en el select
    async function cargarProyectos() {
        try {
            const response = await traerProyectosActivos(0, 50);
            
            if (response.content && response.content.length > 0) {
                proyectoSelect.innerHTML = '<option value="">Seleccione un proyecto</option>';
                
                response.content.forEach(proyecto => {
                    const option = document.createElement('option');
                    option.value = proyecto.id;
                    option.textContent = proyecto.nombre;
                    proyectoSelect.appendChild(option);
                });
            } else {
                proyectoSelect.innerHTML = '<option value="">No hay proyectos disponibles</option>';
            }
        } catch (error) {
            console.error('Error al cargar proyectos:', error);
            proyectoSelect.innerHTML = '<option value="">Error al cargar proyectos</option>';
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
        const eventoData = {
            nombre: formData.get('nombre'),
            proyecto: { id: parseInt(formData.get('proyecto')) },
            fecha: formData.get('fecha'),
            hora: formData.get('hora'),
            lugar: formData.get('lugar'),
            horasGanadas: parseInt(formData.get('horas_ganadas')),
            descripcion: formData.get('descripcion'),
            creadoPor: userData.id // Agregar ID del usuario que crea el evento
        };
        
        // Deshabilitar botón durante el envío
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-hourglass me-2"></i>Agregando...';
        
        try {
            // Enviar datos a la API
            await agregarEvento(eventoData);
            
            // Mostrar mensaje de éxito
            alert('Evento agregado correctamente');
            
            // Limpiar formulario
            eventForm.reset();
        } catch (error) {
            console.error('Error al agregar evento:', error);
            alert('Error al agregar evento. Por favor, intente nuevamente.');
        } finally {
            // Rehabilitar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Agregar evento';
        }
    });

    // Cargar proyectos al iniciar
    cargarProyectos();
});