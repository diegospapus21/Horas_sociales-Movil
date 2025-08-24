// calendarioController.js - Controlador de Calendario
import { authService, calendarioService, eventosService } from './services.js';
import { setupProtectedPage } from './authMiddleware.js';

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let eventos = [];

export async function initializeCalendario() {
    const user = setupProtectedPage();
    if (!user) return;
    
    await loadEventos(user);
    setupEventListeners();
    renderCalendar(currentMonth, currentYear);
}

async function loadEventos(user) {
    try {
        if (authService.isEstudiante()) {
            eventos = await calendarioService.obtenerActividadesPorEstudiante(user.codigo);
        } else {
            eventos = await eventosService.obtenerEventos();
        }
    } catch (error) {
        console.error('Error loading events:', error);
        eventos = [];
    }
}

function setupEventListeners() {
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });
}

function renderCalendar(month, year) {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                       "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    document.getElementById('monthYear').textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    // Días de la semana
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-grid empty';
        calendarDays.appendChild(emptyDay);
    }
    
    // Días del mes
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-grid day';
        dayElement.textContent = day;
        
        // Verificar si es hoy
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayElement.classList.add('current-day');
        }
        
        // Verificar si hay eventos en este día
        const hasEvent = eventos.some(evento => {
            const eventDate = new Date(evento.fecha_hora_actividad);
            return eventDate.getDate() === day && 
                   eventDate.getMonth() === month && 
                   eventDate.getFullYear() === year;
        });
        
        if (hasEvent) {
            dayElement.classList.add('day-event');
            dayElement.title = 'Eventos programados';
            
            // Agregar tooltip con información del evento
            const eventInfo = eventos.filter(evento => {
                const eventDate = new Date(evento.fecha_hora_actividad);
                return eventDate.getDate() === day && 
                       eventDate.getMonth() === month && 
                       eventDate.getFullYear() === year;
            }).map(evento => evento.nombre_evento).join(', ');
            
            dayElement.setAttribute('data-bs-toggle', 'tooltip');
            dayElement.setAttribute('title', eventInfo);
        }
        
        calendarDays.appendChild(dayElement);
    }
    
    // Inicializar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

window.agregarEvento = function() {
    if (!authService.isCoordinador()) {
        alert('Solo los coordinadores pueden agregar eventos');
        return;
    }
    window.location.href = 'eventos.html';
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeCalendario);