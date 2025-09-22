// js/dashboardCController.js
import { traerEstudiantes } from '../services/EstudiantesService.js';
import { obtenerEventos } from '../services/EventosService.js';
import { traerProyectosActivos } from '../services/ProyectosService.js';
import { getAllPendient } from '../services/SolicitudService.js';
import { buscarHoras } from '../services/HorasSocialesService.js';

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const totalEstudiantesElement = document.getElementById('total-estudiantes');
    const totalEventosElement = document.getElementById('total-eventos');
    const solicitudesPendientesElement = document.getElementById('solicitudes-pendientes');
    const horasTotalesElement = document.getElementById('horas-totales');
    const proyectosContainer = document.getElementById('proyectos-container');
    const welcomeMessage = document.getElementById('welcome-message');
    const userNameElement = document.getElementById('user-name');
    const userRoleElement = document.getElementById('user-role');

    // Verificar autenticación
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData || !userData.tipo || (userData.tipo !== 'COORDINADOR' && userData.tipo !== 'ADMINISTRADOR')) {
        window.location.href = 'index2.html';
        return;
    }

    // Cargar datos del dashboard
    async function cargarDashboard() {
        try {
            userNameElement.textContent = userData.nombre || 'Usuario';
            userRoleElement.textContent = userData.tipo === 'ADMINISTRADOR' ? 'Administrador' : 'Coordinador';
            welcomeMessage.textContent = `Panel de Control - ${userData.nombre || 'Usuario'}`;

            // Cargar estadísticas
            await cargarEstadisticas();
            
            // Cargar proyectos activos
            await cargarProyectosActivos();
        } catch (error) {
            console.error('Error al cargar el dashboard:', error);
        }
    }

    // Cargar estadísticas
    async function cargarEstadisticas() {
        try {
            // Obtener total de estudiantes
            const estudiantesResponse = await traerEstudiantes(0, 1);
            totalEstudiantesElement.textContent = estudiantesResponse.totalElements || 0;

            // Obtener total de eventos
            const eventosResponse = await obtenerEventos(0, 1);
            totalEventosElement.textContent = eventosResponse.totalElements || 0;

            // Obtener solicitudes pendientes
            const solicitudesResponse = await getAllPendient(0, 1);
            solicitudesPendientesElement.textContent = solicitudesResponse.totalElements || 0;

            // Calcular horas totales
            horasTotalesElement.textContent = await calcularHorasTotales();
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
            totalEstudiantesElement.textContent = '0';
            totalEventosElement.textContent = '0';
            solicitudesPendientesElement.textContent = '0';
            horasTotalesElement.textContent = '0';
        }
    }

    // Función para calcular horas totales
    async function calcularHorasTotales() {
        try {
            const estudiantesResponse = await traerEstudiantes(0, 100);
            let totalHoras = 0;
            
            if (estudiantesResponse.content) {
                for (const estudiante of estudiantesResponse.content) {
                    try {
                        const horasResponse = await buscarHoras(estudiante.codigo);
                        if (horasResponse && horasResponse.horasActuales) {
                            totalHoras += horasResponse.horasActuales;
                        }
                    } catch (error) {
                        console.error(`Error al buscar horas para estudiante ${estudiante.codigo}:`, error);
                    }
                }
            }
            
            return totalHoras;
        } catch (error) {
            console.error('Error al calcular horas totales:', error);
            return 0;
        }
    }

    // Cargar proyectos activos
    async function cargarProyectosActivos() {
        try {
            const response = await traerProyectosActivos(0, 5);
            
            if (response.content && response.content.length > 0) {
                proyectosContainer.innerHTML = '';
                
                response.content.forEach(proyecto => {
                    const proyectoElement = document.createElement('div');
                    proyectoElement.className = 'card mb-3';
                    proyectoElement.innerHTML = `
                        <div class="card-body">
                            <h5 class="card-title">${proyecto.nombre}</h5>
                            <p class="card-text">${proyecto.descripcion || 'Sin descripción'}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">Estado: ${proyecto.estado || 'Activo'}</small>
                                <span class="badge bg-primary">${proyecto.horasRequeridas || 0} horas</span>
                            </div>
                        </div>
                    `;
                    
                    proyectosContainer.appendChild(proyectoElement);
                });
            } else {
                proyectosContainer.innerHTML = `
                    <div class="text-center py-4 text-muted">
                        <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                        <p class="mt-2">No hay proyectos activos</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error al cargar proyectos:', error);
            proyectosContainer.innerHTML = `
                <div class="text-center py-4 text-danger">
                    <p>Error al cargar proyectos. Intente nuevamente.</p>
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