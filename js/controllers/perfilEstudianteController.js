class PerfilEstudianteController {
    constructor() {
        this.horasSocialesService = new HorasSocialesService();
        this.estudianteId = this.obtenerIdEstudiante();
        this.init();
    }

    async init() {
        try {
            console.log(' Inicializando controlador para:', this.estudianteId);
            await this.cargarPerfilCompleto();
        } catch (error) {
            console.error(' Error al inicializar:', error);
            this.mostrarError('No se pudieron cargar los datos del perfil. Verifica la conexión.');
        }
    }

    obtenerIdEstudiante() {
        // Intenta obtener del código en la página
        const codigoElement = document.querySelector('.student-code');
        if (codigoElement) {
            const codigo = codigoElement.textContent.replace('Código: ', '').trim();
            console.log(' ID estudiante detectado:', codigo);
            return codigo;
        }
        
        // Intenta obtener de localStorage
        const storedId = localStorage.getItem('estudianteId');
        if (storedId) {
            console.log(' ID estudiante desde localStorage:', storedId);
            return storedId;
        }
        
        // Default
        console.warn(' Usando ID estudiante por defecto');
        return 'EST-2025-0456';
    }

    async cargarPerfilCompleto() {
        try {
            console.log(' Cargando perfil completo...');
            this.mostrarLoading(true);
            
            const datos = await this.horasSocialesService.obtenerDatosCompletosEstudiante(this.estudianteId);
            
            this.actualizarPerfil(datos.perfil);
            this.actualizarHorasSociales(datos.horasSociales);
            this.actualizarComisiones(datos.comisiones);
            this.actualizarActividades(datos.actividades);
            this.actualizarInformacionAdicional(datos.perfil);
            
            console.log(' Perfil cargado exitosamente');
            this.mostrarLoading(false);
            
        } catch (error) {
            this.mostrarLoading(false);
            throw error;
        }
    }

    actualizarPerfil(perfil) {
        console.log(' Actualizando perfil:', perfil);
        
        // Actualizar información básica
        document.querySelector('.student-name').textContent = perfil.nombreCompleto;
        document.querySelector('.student-code').textContent = `Código: ${perfil.codigo}`;

        // Actualizar información académica
        const infoGrid = document.querySelector('.info-grid');
        infoGrid.innerHTML = `
            <div class="info-card">
                <span class="info-label">Curso Actual</span>
                <div class="info-value">${perfil.cursoActual}</div>
            </div>
            
            <div class="info-card">
                <span class="info-label">Año Académico</span>
                <div class="info-value">${perfil.añoAcademico}</div>
            </div>
            
            <div class="info-card">
                <span class="info-label">Año de Bachillerato</span>
                <div class="info-value">${perfil.añoBachillerato}</div>
            </div>
            
            <div class="info-card">
                <span class="info-label">Especialidad</span>
                <div class="info-value">${perfil.especialidad}</div>
                <span class="info-subvalue">${perfil.areaTecnologica}</span>
                <span class="specialty-badge">Especialidad</span>
            </div>
        `;
    }

    actualizarHorasSociales(horas) {
        console.log(' Actualizando horas sociales:', horas);
        
        const horasSection = document.querySelector('.horas-sociales-section');
        horasSection.innerHTML = `
            <h2 class="section-title">Horas Sociales</h2>
            <div class="info-grid">
                <div class="info-card">
                    <span class="info-label">Horas Totales Requeridas</span>
                    <div class="info-value">${horas.horasTotales}</div>
                    <span class="info-subvalue">horas</span>
                </div>
                
                <div class="info-card">
                    <span class="info-label">Horas Realizadas</span>
                    <div class="info-value">${horas.horasRealizadas}</div>
                    <span class="info-subvalue">horas</span>
                </div>
                
                <div class="info-card">
                    <span class="info-label">Horas Pendientes</span>
                    <div class="info-value">${horas.horasPendientes}</div>
                    <span class="info-subvalue">horas</span>
                </div>
                
                <div class="info-card grade-card">
                    <span class="info-label">Progreso</span>
                    <div class="info-value">${horas.porcentajeCompletado}%</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${horas.porcentajeCompletado}%"></div>
                    </div>
                    <span class="info-subvalue">${horas.estado}</span>
                </div>
            </div>
        `;
    }

    actualizarComisiones(comisiones) {
        console.log(' Actualizando comisiones:', comisiones);
        
        const comisionesSection = document.querySelector('.comisiones-section');

        if (comisiones.length === 0) {
            comisionesSection.innerHTML = `
                <h2 class="section-title">Comisiones</h2>
                <div class="empty-state">
                    <i class="bi bi-people"></i>
                    <p>No está asignado a ninguna comisión</p>
                </div>
            `;
            return;
        }

        let comisionesHTML = `
            <h2 class="section-title">Comisiones</h2>
            <div class="comisiones-grid">
        `;

        comisiones.forEach(comision => {
            comisionesHTML += `
                <div class="comision-card">
                    <div class="comision-header">
                        <h3 class="comision-name">${comision.nombre}</h3>
                        <span class="comision-status ${comision.estado.toLowerCase()}">${comision.estado}</span>
                    </div>
                    <div class="comision-details">
                        <p class="comision-description">${comision.descripcion}</p>
                        <div class="comision-meta">
                            <span class="comision-responsable">
                                <i class="bi bi-person"></i>
                                ${comision.responsable}
                            </span>
                            <span class="comision-horas">
                                <i class="bi bi-clock"></i>
                                ${comision.horasAsignadas} hrs asignadas
                            </span>
                        </div>
                    </div>
                </div>
            `;
        });

        comisionesHTML += `</div>`;
        comisionesSection.innerHTML = comisionesHTML;
    }

    actualizarActividades(actividades) {
        console.log(' Actualizando actividades:', actividades);
        
        const actividadesSection = document.querySelector('.actividades-section');
        const actividadesRecientes = actividades.slice(0, 3);

        if (actividadesRecientes.length === 0) {
            actividadesSection.innerHTML = `
                <h2 class="section-title">Actividades Recientes</h2>
                <div class="empty-state">
                    <i class="bi bi-list-task"></i>
                    <p>No hay actividades registradas</p>
                </div>
            `;
            return;
        }

        let actividadesHTML = `
            <h2 class="section-title">Actividades Recientes</h2>
            <div class="actividades-list">
        `;

        actividadesRecientes.forEach(actividad => {
            actividadesHTML += `
                <div class="actividad-item">
                    <div class="actividad-info">
                        <h4 class="actividad-titulo">${actividad.nombre}</h4>
                        <p class="actividad-descripcion">${actividad.descripcion}</p>
                        <div class="actividad-meta">
                            <span class="actividad-fecha">
                                <i class="bi bi-calendar"></i>
                                ${new Date(actividad.fecha).toLocaleDateString('es-ES')}
                            </span>
                            <span class="actividad-horas">
                                <i class="bi bi-clock"></i>
                                ${actividad.horas} horas
                            </span>
                        </div>
                    </div>
                    <div class="actividad-estado ${actividad.estado}">
                        ${this.formatearEstado(actividad.estado)}
                    </div>
                </div>
            `;
        });

        actividadesHTML += `</div>`;
        actividadesSection.innerHTML = actividadesHTML;
    }

    actualizarInformacionAdicional(perfil) {
        console.log(' Actualizando información adicional:', perfil);
        
        const infoAdicionalSection = document.querySelector('.section:last-child .info-grid');
        infoAdicionalSection.innerHTML = `
            <div class="info-card">
                <span class="info-label">Fecha de Ingreso</span>
                <div class="info-value">${perfil.fechaIngreso}</div>
            </div>
            
            <div class="info-card grade-card">
                <span class="info-label">Promedio Académico</span>
                <div class="info-value">${perfil.promedio}</div>
                <span class="info-subvalue">/ 5.0</span>
            </div>
            
            ${perfil.email ? `
            <div class="info-card">
                <span class="info-label">Email</span>
                <div class="info-value">${perfil.email}</div>
            </div>
            ` : ''}
            
            ${perfil.telefono ? `
            <div class="info-card">
                <span class="info-label">Teléfono</span>
                <div class="info-value">${perfil.telefono}</div>
            </div>
            ` : ''}
        `;
    }

    formatearEstado(estado) {
        const estados = {
            'completado': 'Completado',
            'en-progreso': 'En Progreso',
            'pendiente': 'Pendiente',
            'aprobado': 'Aprobado'
        };
        return estados[estado] || estado;
    }

    mostrarLoading(mostrar) {
        const container = document.querySelector('.profile-container');
        if (mostrar) {
            container.classList.add('loading');
        } else {
            container.classList.remove('loading');
        }
    }

    mostrarError(mensaje) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="bi bi-exclamation-triangle"></i>
            <span>${mensaje}</span>
        `;
        document.querySelector('.profile-content').prepend(errorDiv);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log(' DOM cargado, iniciando aplicación...');
    new PerfilEstudianteController();
});