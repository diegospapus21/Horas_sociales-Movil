import { getAllCalendario, crearCalendario, actualizarCalendario, eliminarCalendario } from '../services/CalendarioService.js';

let currentDate = new Date();
let events = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    setupEventListeners();
});

function initializeCalendar() {
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
    loadEvents();
}

async function loadEvents() {
    try {
        const eventsData = await getAllCalendario(0, 100); // Obtener todos los eventos
        events = eventsData.content || eventsData || [];
        markEventsOnCalendar();
        loadNextActivity(); // Cargar próxima actividad
    } catch (error) {
        console.error('Error loading events:', error);
        showNotification('Error al cargar eventos del calendario', 'error');
    }
}

function renderCalendar(year, month) {
    const monthYearElement = document.getElementById('monthYear');
    const calendarDays = document.getElementById('calendarDays');
    
    if (!monthYearElement || !calendarDays) return;

    // Configurar mes y año
    monthYearElement.textContent = `${getMonthName(month)} ${year}`;
    
    // Limpiar calendario
    calendarDays.innerHTML = '';
    
    // Obtener primer día del mes y último día
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Días vacíos al inicio
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'empty';
        calendarDays.appendChild(emptyDay);
    }
    
    // Días del mes
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = day;
        dayElement.setAttribute('data-date', `${year}-${month + 1}-${day}`);
        dayElement.addEventListener('click', () => selectDay(year, month, day));
        calendarDays.appendChild(dayElement);
    }
}

function markEventsOnCalendar() {
    // Limpiar marcas anteriores
    document.querySelectorAll('.day-event').forEach(day => {
        day.classList.remove('day-event');
    });

    // Marcar días con eventos
    events.forEach(event => {
        if (!event.fecha) return;
        
        const eventDate = new Date(event.fecha);
        const dayElement = findDayElement(eventDate.getDate());
        
        if (dayElement) {
            dayElement.classList.add('day-event');
            dayElement.title = event.nombre || event.descripcion || 'Evento';
        }
    });
}

function findDayElement(day) {
    const days = document.querySelectorAll('.day');
    return Array.from(days).find(dayEl => parseInt(dayEl.textContent) === day);
}

function setupEventListeners() {
    const prevButton = document.getElementById('prevMonth');
    const nextButton = document.getElementById('nextMonth');

    if (prevButton) {
        prevButton.addEventListener('click', () => navigateMonth(-1));
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => navigateMonth(1));
    }

    // Event listener para el formulario de eventos
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventSubmit);
    }
}

function navigateMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
    markEventsOnCalendar();
}

function selectDay(year, month, day) {
    const selectedDate = new Date(year, month, day);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    // Mostrar eventos del día seleccionado
    const dayEvents = events.filter(event => {
        if (!event.fecha) return false;
        const eventDate = new Date(event.fecha).toISOString().split('T')[0];
        return eventDate === formattedDate;
    });

    showDayEvents(dayEvents, formattedDate);
}

function showDayEvents(dayEvents, date) {
    const modal = new bootstrap.Modal(document.getElementById('eventModal'));
    const modalBody = document.querySelector('#eventModal .modal-body');
    
    if (!modalBody) return;

    if (dayEvents.length === 0) {
        modalBody.innerHTML = `
            <p>No hay eventos programados para esta fecha.</p>
            <button class="btn btn-primary" onclick="showAddEventForm('${date}')">
                Agregar Evento
            </button>
        `;
    } else {
        modalBody.innerHTML = `
            <h5>Eventos para ${formatDisplayDate(date)}</h5>
            ${dayEvents.map(event => `
                <div class="event-item mb-3 p-2 border rounded">
                    <h6>${event.nombre || 'Evento sin nombre'}</h6>
                    <p>${event.descripcion || 'Sin descripción'}</p>
                    <p><small>Hora: ${event.hora || 'Todo el día'}</small></p>
                    <p><small>Lugar: ${event.lugar || 'No especificado'}</small></p>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="editEvent('${event.id}')">
                            Editar
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteEvent('${event.id}')">
                            Eliminar
                        </button>
                    </div>
                </div>
            `).join('')}
            <button class="btn btn-primary mt-2" onclick="showAddEventForm('${date}')">
                Agregar otro evento
            </button>
        `;
    }
    
    modal.show();
}

window.showAddEventForm = function(date) {
    const modal = new bootstrap.Modal(document.getElementById('addEventModal'));
    const dateInput = document.getElementById('eventDate');
    
    if (dateInput && date) {
        dateInput.value = date;
    }
    
    modal.show();
};

async function handleEventSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const eventData = {
        nombre: formData.get('eventName'),
        descripcion: formData.get('eventDescription'),
        fecha: formData.get('eventDate'),
        hora: formData.get('eventTime'),
        lugar: formData.get('eventLocation'),
        tipo: formData.get('eventType') || 'general'
    };

    try {
        await crearCalendario(eventData);
        e.target.reset();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('addEventModal'));
        modal.hide();
        
        showNotification('Evento creado exitosamente', 'success');
        await loadEvents(); // Recargar eventos
    } catch (error) {
        console.error('Error creating event:', error);
        showNotification('Error al crear evento', 'error');
    }
}

window.editEvent = async function(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const modal = new bootstrap.Modal(document.getElementById('editEventModal'));
    const form = document.getElementById('editEventForm');
    
    // Llenar formulario con datos existentes
    document.getElementById('editEventId').value = event.id;
    document.getElementById('editEventName').value = event.nombre || '';
    document.getElementById('editEventDescription').value = event.descripcion || '';
    document.getElementById('editEventDate').value = event.fecha ? event.fecha.split('T')[0] : '';
    document.getElementById('editEventTime').value = event.hora || '';
    document.getElementById('editEventLocation').value = event.lugar || '';
    document.getElementById('editEventType').value = event.tipo || 'general';
    
    modal.show();
};

window.handleEditEvent = async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const eventId = formData.get('eventId');
    const eventData = {
        nombre: formData.get('eventName'),
        descripcion: formData.get('eventDescription'),
        fecha: formData.get('eventDate'),
        hora: formData.get('eventTime'),
        lugar: formData.get('eventLocation'),
        tipo: formData.get('eventType')
    };

    try {
        await actualizarCalendario(eventId, eventData);
        e.target.reset();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('editEventModal'));
        modal.hide();
        
        showNotification('Evento actualizado exitosamente', 'success');
        await loadEvents(); // Recargar eventos
    } catch (error) {
        console.error('Error updating event:', error);
        showNotification('Error al actualizar evento', 'error');
    }
};

window.deleteEvent = async function(eventId) {
    if (confirm('¿Está seguro de que desea eliminar este evento?')) {
        try {
            await eliminarCalendario(eventId);
            showNotification('Evento eliminado exitosamente', 'success');
            await loadEvents(); // Recargar eventos
        } catch (error) {
            console.error('Error deleting event:', error);
            showNotification('Error al eliminar evento', 'error');
        }
    }
};

function loadNextActivity() {
    const today = new Date();
    const upcomingEvents = events
        .filter(event => event.fecha && new Date(event.fecha) >= today)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    if (upcomingEvents.length > 0) {
        const nextEvent = upcomingEvents[0];
        const siguienteActividad = document.getElementById('siguienteActividad');
        
        if (siguienteActividad) {
            siguienteActividad.className = 'alert alert-info text-center mt-4';
            siguienteActividad.innerHTML = `
                <h5>Próxima Actividad</h5>
                <p><strong>${nextEvent.nombre}</strong></p>
                <p>${formatDisplayDate(nextEvent.fecha)} - ${nextEvent.hora || 'Todo el día'}</p>
                <p>${nextEvent.lugar ? `Lugar: ${nextEvent.lugar}` : ''}</p>
            `;
        }
    }
}

window.agregarEvento = function() {
    const modal = new bootstrap.Modal(document.getElementById('addEventModal'));
    modal.show();
};

// Funciones utilitarias
function getMonthName(month) {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month];
}

function formatDisplayDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showNotification(message, type) {
    // Puedes implementar notificaciones bonitas con Toastify o similar
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Exportar funciones para uso global
window.calendarController = {
    loadEvents,
    navigateMonth,
    agregarEvento
};