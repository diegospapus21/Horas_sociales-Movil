const eventos = [
    { fecha: '2025-07-20', titulo: 'Tarea de Matemática' },
    { fecha: '2025-07-22', titulo: 'Exposición de Historia' }
];

const monthYearDisplay = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const calendarGrid = document.querySelector('.calendar-grid');
const siguienteActividad = document.getElementById('siguienteActividad');

let currentDate = new Date();

function renderCalendar() {
    calendarGrid.querySelectorAll('.day, .empty').forEach(day => day.remove());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYearDisplay.textContent = new Date(year, month).toLocaleString('es-ES', { month: 'long', year: 'numeric' });

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('empty');
        calendarGrid.appendChild(emptyDay);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = i;

        const fechaActual = new Date(year, month, i).toISOString().split('T')[0];
        const eventoDelDia = eventos.find(e => e.fecha === fechaActual);

        if (eventoDelDia) {
            dayDiv.classList.add('day-event');
            dayDiv.title = eventoDelDia.titulo;
        }

        if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            dayDiv.classList.add('current-day');
        }

        dayDiv.addEventListener('click', () => {
            const evento = eventos.find(e => e.fecha === fechaActual);
            if (evento) {
                alert(`Evento: ${evento.titulo}\nFecha: ${fechaActual}`);
            } else {
                const titulo = prompt("¿Quieres agregar un evento para este día?\nIngresa el nombre del evento:");
                if (titulo) {
                    eventos.push({ fecha: fechaActual, titulo });
                    renderCalendar();
                    mostrarSiguienteActividad();
                }
            }
        });

        calendarGrid.appendChild(dayDiv);
    }
}

function mostrarSiguienteActividad() {
    const hoy = new Date();
    const eventosFuturos = eventos.filter(e => new Date(e.fecha) >= hoy);
    eventosFuturos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const siguiente = eventosFuturos[0];
    const contenedor = document.getElementById('siguienteActividad');

    if (siguiente) {
        const fecha = new Date(siguiente.fecha);
        const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
        contenedor.textContent = `Siguiente Actividad - ${fecha.toLocaleDateString('es-ES', opciones)}: ${siguiente.titulo}`;
    } else {
        contenedor.textContent = 'No hay actividades próximas.';
    }
}

prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    mostrarSiguienteActividad();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    mostrarSiguienteActividad();
});

function agregarEvento(fecha = null) {
    const fechaEvento = fecha || prompt("Ingrese la fecha del evento (YYYY-MM-DD):");
    if (!fechaEvento) return;

    const titulo = prompt("¿Qué evento quieres agregar?");
    if (!titulo) return;

    const hora = prompt("¿A qué hora es el evento? (formato HH:mm)");
    if (!hora) return;

    eventos.push({ fecha: fechaEvento, titulo, hora });
    renderCalendar();
    mostrarSiguienteActividad();
}

function actualizarProximaActividad() {
    if (eventos.length === 0) {
        siguienteActividad.classList.add("d-none");
        return;
    }

    const ahora = new Date();
    const proximos = eventos
        .map(e => ({
            ...e,
            fechaCompleta: new Date(`${e.fecha}T${e.hora}:00`)
        }))
        .filter(e => e.fechaCompleta > ahora)
        .sort((a, b) => a.fechaCompleta - b.fechaCompleta);

    if (proximos.length === 0) {
        siguienteActividad.classList.add("d-none");
        return;
    }

    const prox = proximos[0];
    siguienteActividad.classList.remove("d-none");
    siguienteActividad.innerHTML = `<strong>Próximo evento:</strong> ${prox.titulo} el ${prox.fecha} a las ${prox.hora}`;
}

// Inicializar el calendario
renderCalendar();
mostrarSiguienteActividad();