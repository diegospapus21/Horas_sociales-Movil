// js/dashboardController.js
import { buscarHoras } from '../services/HorasSocialesService.js';
import { getByCodigoEstudiante } from '../services/SolicitudService.js';
import { obtenerEventos } from '../services/EventosService.js';

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const progressPie = document.getElementById('progress-pie');
    const percentageText = document.getElementById('percentage-text');
    const progressBar = document.getElementById('progress-bar');
    const horasCompletadas = document.getElementById('horas-completadas');
    const horasFaltantes = document.getElementById('horas-faltantes');
    const proximaActividadContent = document.getElementById('proxima-actividad-content');
    const proximosEventosContent = document.getElementById('proximos-eventos-content');
    const welcomeMessage = document.getElementById('welcome-message');
    const userNameElement = document.getElementById('user-name');
    const userRoleElement = document.getElementById('user-role');

    // Verificar autenticación
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData || userData.tipo !== 'ESTUDIANTE') {
        window.location.href = 'index2.html';
        return;
    }

    // Cargar dashboard del estudiante
    async function cargarDashboard() {
        try {
            userNameElement.textContent = userData.nombre || 'Estudiante';
            userRoleElement.textContent = 'Estudiante';
            welcomeMessage.textContent = `Bienvenido ${userData.nombre || 'Estudiante'} al sistema de horas sociales`;

            // Cargar progreso de horas sociales
            await cargarProgresoHoras(userData.codigo);
            
            // Cargar próxima actividad
            await cargarProximaActividad(userData.codigo);
            
            // Cargar próximos eventos
            await cargarProximosEventos();
        } catch (error) {
            console.error('Error al cargar el dashboard:', error);
        }
    }

    // Cargar progreso de horas sociales
    async function cargarProgresoHoras(codigoEstudiante) {
        try {
            const response = await buscarHoras(codigoEstudiante);
            
            if (response) {
                const horasActuales = response.horasActuales || 0;
                const horasRequeridas = 150;
                const porcentaje = Math.min(100, Math.round((horasActuales / horasRequeridas) * 100));
                
                // Actualizar UI
                progressPie.style.setProperty('--percentage', `${porcentaje}%`);
                percentageText.textContent = `${porcentaje}%`;
                progressBar.style.width = `${porcentaje}%`;
                progressBar.setAttribute('aria-valuenow', porcentaje);
                horasCompletadas.textContent = horasActuales;
                horasFaltantes.textContent = Math.max(0, horasRequeridas - horasActuales);
            } else {
                // Si no hay registro de horas, crear uno
                horasCompletadas.textContent = '0';
                horasFaltantes.textContent = '150';
                percentageText.textContent = '0%';
                progressBar.style.width = '0%';
            }
        } catch (error) {
            console.error('Error al cargar progreso de horas:', error);
        }
    }

    // Cargar próxima actividad
    async function cargarProximaActividad(codigoEstudiante) {
        try {
            const response = await getByCodigoEstudiante(codigoEstudiante);
            
            if (response && response.length > 0) {
                // Encontrar la solicitud más reciente
                const solicitud = response[0];
                
                proximaActividadContent.innerHTML = `
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h5>${solicitud.nombreActividad || 'Actividad sin nombre'}</h5>
                            <p class="mb-1">${solicitud.descripcion || 'Sin descripción'}</p>
                            <small class="text-muted">Estado: ${solicitud.estado || 'Pendiente'}</small>
                        </div>
                        <span class="badge bg-primary">${solicitud.horasGanadas || 0} horas</span>
                    </div>
                `;
            } else {
                proximaActividadContent.innerHTML = `
                    <div class="text-center text-muted">
                        <i class="bi bi-calendar-x" style="font-size: 2rem;"></i>
                        <p class="mt-2">No tienes actividades próximas</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error al cargar próxima actividad:', error);
            proximaActividadContent.innerHTML = `
                <div class="text-center text-danger">
                    <p>Error al cargar actividades. Intente nuevamente.</p>
                </div>
            `;
        }
    }

    // Cargar próximos eventos
    async function cargarProximosEventos() {
        try {
            const response = await obtenerEventos(0, 3);
            
            if (response.content && response.content.length > 0) {
                proximosEventosContent.innerHTML = '';
                
                response.content.forEach(evento => {
                    const eventoElement = document.createElement('div');
                    eventoElement.className = 'card mb-2';
                    eventoElement.innerHTML = `
                        <div class="card-body">
                            <h6 class="card-title">${evento.nombre}</h6>
                            <p class="card-text mb-1">${evento.descripcion || 'Sin descripción'}</p>
                            <div class="d-flex justify-content-between">
                                <small class="text-muted">${new Date(evento.fecha).toLocaleDateString()}</small>
                                <span class="badge bg-info">${evento.horasGanadas || 0} horas</span>
                            </div>
                        </div>
                    `;
                    
                    proximosEventosContent.appendChild(eventoElement);
                });
            } else {
                proximosEventosContent.innerHTML = `
                    <div class="text-center text-muted">
                        <i class="bi bi-calendar-event" style="font-size: 2rem;"></i>
                        <p class="mt-2">No hay eventos próximos</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error al cargar eventos:', error);
            proximosEventosContent.innerHTML = `
                <div class="text-center text-danger">
                    <p>Error al cargar eventos. Intente nuevamente.</p>
                </div>
            `;
        }
    }

    // Manejar cierre de sesión
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('userData');
        window.location.href = 'index2.html';
    });

    // Inicializar dashboard
    cargarDashboard();
});