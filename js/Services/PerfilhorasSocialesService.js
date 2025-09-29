class HorasSocialesService {
    constructor() {
        this.baseUrl = 'https://66f9b6cbfb6ce6b35153e90f.mockapi.io/api/v1';
        this.endpoints = {
            estudiantes: '/estudiantes',
            horas: '/horas-sociales',
            actividades: '/actividades',
            comisiones: '/comisiones'
        };
    }

 
    async obtenerDatosCompletosEstudiante(estudianteId) {
        try {
            console.log(' Obteniendo datos para estudiante:', estudianteId);
            
            const [estudiante, horas, actividades, comisiones] = await Promise.all([
                this.obtenerEstudiante(estudianteId),
                this.obtenerHorasSociales(estudianteId),
                this.obtenerActividades(estudianteId),
                this.obtenerComisiones(estudianteId)
            ]);

            console.log(' Datos obtenidos exitosamente:', {
                perfil: estudiante,
                horas: horas,
                actividades: actividades.length,
                comisiones: comisiones.length
            });

            return {
                perfil: estudiante,
                horasSociales: horas,
                actividades: actividades,
                comisiones: comisiones,
                resumen: {
                    totalActividades: actividades.length,
                    totalComisiones: comisiones.length,
                    actividadesPorComision: this.agruparActividadesPorComision(actividades, comisiones)
                }
            };
        } catch (error) {
            console.error(' Error en obtenerDatosCompletosEstudiante:', error);
            throw error;
        }
    }

    /**
     * Obtener información del estudiante
     */
    async obtenerEstudiante(estudianteId) {
        try {
            console.log(' Buscando estudiante:', estudianteId);
            
            // Intenta buscar por código
            const response = await fetch(`${this.baseUrl}${this.endpoints.estudiantes}?codigo=${estudianteId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(' Respuesta estudiante:', data);
            
            if (data.length > 0) {
                return data[0];
            }
            
            // Si no encuentra, busca por ID
            const responseById = await fetch(`${this.baseUrl}${this.endpoints.estudiantes}/${estudianteId}`);
            if (responseById.ok) {
                const estudiante = await responseById.json();
                console.log('📋 Estudiante encontrado por ID:', estudiante);
                return estudiante;
            }
            
            // Si no hay datos, usar ejemplo
            console.warn(' Usando datos de ejemplo para estudiante');
            return this.crearEstudianteEjemplo(estudianteId);
            
        } catch (error) {
            console.error(' Error al obtener estudiante:', error);
            console.warn(' Usando datos de ejemplo debido a error');
            return this.crearEstudianteEjemplo(estudianteId);
        }
    }

    /**
     * Obtener horas sociales
     */
    async obtenerHorasSociales(estudianteId) {
        try {
            console.log(' Buscando horas sociales para:', estudianteId);
            
            const response = await fetch(`${this.baseUrl}${this.endpoints.horas}?estudianteId=${estudianteId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(' Respuesta horas sociales:', data);
            
            if (data.length > 0) {
                return data[0];
            }
            
            // Buscar por ID directo
            const responseById = await fetch(`${this.baseUrl}${this.endpoints.horas}/${estudianteId}`);
            if (responseById.ok) {
                const horas = await responseById.json();
                console.log(' Horas encontradas por ID:', horas);
                return horas;
            }
            
            console.warn(' Usando datos de ejemplo para horas sociales');
            return this.crearHorasSocialesEjemplo(estudianteId);
            
        } catch (error) {
            console.error(' Error al obtener horas sociales:', error);
            console.warn(' Usando datos de ejemplo debido a error');
            return this.crearHorasSocialesEjemplo(estudianteId);
        }
    }

    /**
     * Obtener actividades
     */
    async obtenerActividades(estudianteId) {
        try {
            console.log(' Buscando actividades para:', estudianteId);
            
            const response = await fetch(`${this.baseUrl}${this.endpoints.actividades}?estudianteId=${estudianteId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(' Actividades encontradas:', data);
            
            return data || [];
            
        } catch (error) {
            console.error(' Error al obtener actividades:', error);
            return this.crearActividadesEjemplo();
        }
    }

    /**
     * Obtener comisiones
     */
    async obtenerComisiones(estudianteId) {
        try {
            console.log(' Buscando comisiones para:', estudianteId);
            
            const response = await fetch(`${this.baseUrl}${this.endpoints.comisiones}?estudianteId=${estudianteId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(' Comisiones encontradas:', data);
            
            return data || [];
            
        } catch (error) {
            console.error(' Error al obtener comisiones:', error);
            return this.crearComisionesEjemplo();
        }
    }

    /**
     * Datos de ejemplo para desarrollo
     */
    crearEstudianteEjemplo(estudianteId) {
        return {
            id: estudianteId,
            nombreCompleto: "María González Pérez",
            codigo: estudianteId,
            añoBachillerato: "4to Año",
            especialidad: "Ingeniería de Software",
            areaTecnologica: "Tecnología",
            fechaIngreso: "15 de Agosto, 2023",
            promedio: 4.2,
            cursoActual: "Matemáticas Avanzadas",
            añoAcademico: "2024 - 2025",
            email: "maria.gonzalez@instituto.edu",
            telefono: "+1234567890"
        };
    }

    crearHorasSocialesEjemplo(estudianteId) {
        return {
            id: estudianteId,
            estudianteId: estudianteId,
            horasTotales: 80,
            horasRealizadas: 45,
            horasPendientes: 35,
            porcentajeCompletado: 56,
            estado: 'En progreso',
            fechaActualizacion: new Date().toISOString()
        };
    }

    crearActividadesEjemplo() {
        return [
            {
                id: 1,
                nombre: "Limpieza de Playa",
                descripcion: "Jornada de limpieza en playa local",
                fecha: "2024-01-15",
                horas: 8,
                comisionId: 1,
                estado: "completado"
            },
            {
                id: 2,
                nombre: "Tutoría Estudiantil",
                descripcion: "Apoyo académico a estudiantes de primeros años",
                fecha: "2024-02-20",
                horas: 12,
                comisionId: 2,
                estado: "en-progreso"
            },
            {
                id: 3,
                nombre: "Recolección de Alimentos",
                descripcion: "Campaña de recolección para banco de alimentos",
                fecha: "2024-03-10",
                horas: 6,
                comisionId: 1,
                estado: "completado"
            }
        ];
    }

    crearComisionesEjemplo() {
        return [
            {
                id: 1,
                nombre: "Comisión Ambiental",
                descripcion: "Encargada de proyectos de sostenibilidad y cuidado del medio ambiente",
                responsable: "Prof. Carlos Rodríguez",
                horasAsignadas: 40,
                estado: "Activo",
                fechaInicio: "2024-01-01",
                fechaFin: "2024-12-31"
            },
            {
                id: 2,
                nombre: "Comisión de Apoyo Académico",
                descripcion: "Brinda apoyo y tutorías a estudiantes con dificultades académicas",
                responsable: "Prof. Ana Martínez",
                horasAsignadas: 30,
                estado: "Activo",
                fechaInicio: "2024-02-01",
                fechaFin: "2024-11-30"
            }
        ];
    }

    agruparActividadesPorComision(actividades, comisiones) {
        const agrupadas = {};
        
        comisiones.forEach(comision => {
            agrupadas[comision.nombre] = actividades.filter(actividad => 
                actividad.comisionId === comision.id
            );
        });

        return agrupadas;
    }
}