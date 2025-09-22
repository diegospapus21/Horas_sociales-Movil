// js/dashboardCController.js
import { getTotalHorasSociales, getTotalHorasPracticas, getEstudiantesActivos, getEstudiantesInactivos } from '../services/DashboardService.js';

document.addEventListener('DOMContentLoaded', async function() {
    const horasSocialesElement = document.getElementById('horasSociales');
    const horasPracticasElement = document.getElementById('horasPracticas');
    const estudiantesActivosElement = document.getElementById('estudiantesActivos');
    const estudiantesInactivosElement = document.getElementById('estudiantesInactivos');

    // Parse seguro de userData
    let userData = {};
    try {
        userData = JSON.parse(localStorage.getItem('userData') || '{}') || {};
    } catch (err) {
        userData = {};
    }

    // Validación de rol
    if (!userData || (userData.tipo !== 'COORDINADOR' && userData.tipo !== 'ADMINISTRADOR')) {
        window.location.href = 'index2.html';
        return;
    }

    // Helper para mostrar valores en la UI
    function setValue(el, value, fallback = '0') {
        if (!el) return;
        el.textContent = value != null ? value : fallback;
    }

    // Mostrar loader inicial
    setValue(horasSocialesElement, '...');
    setValue(horasPracticasElement, '...');
    setValue(estudiantesActivosElement, '...');
    setValue(estudiantesInactivosElement, '...');

    try {
        // Llamadas en paralelo
        const [
            totalHorasSociales,
            totalHorasPracticas,
            totalEstudiantesActivos,
            totalEstudiantesInactivos
        ] = await Promise.all([
            getTotalHorasSociales(),
            getTotalHorasPracticas(),
            getEstudiantesActivos(),
            getEstudiantesInactivos()
        ]);

        // Actualizar UI
        setValue(horasSocialesElement, totalHorasSociales);
        setValue(horasPracticasElement, totalHorasPracticas);
        setValue(estudiantesActivosElement, totalEstudiantesActivos);
        setValue(estudiantesInactivosElement, totalEstudiantesInactivos);

    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        if (horasSocialesElement) horasSocialesElement.textContent = 'Error';
        if (horasPracticasElement) horasPracticasElement.textContent = 'Error';
        if (estudiantesActivosElement) estudiantesActivosElement.textContent = 'Error';
        if (estudiantesInactivosElement) estudiantesInactivosElement.textContent = 'Error';
    }
});