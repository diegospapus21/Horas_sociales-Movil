// services.js - Todos los servicios de API
const API_BASE = "http://localhost:8080";

// Servicio de Autenticación
export const authService = {
    async login(correo, contrasenia) {
        try {
            // Intentar como estudiante
            try {
                const response = await fetch(`${API_BASE}/apiUsuarios/LogInEstudiantes/${encodeURIComponent(correo)}`);
                if (response.ok) {
                    const usuarios = await response.json();
                    const usuario = Array.isArray(usuarios) ? 
                        usuarios.find(u => u.correo === correo && u.contrasenia === contrasenia) : 
                        usuarios;
                    
                    if (usuario) {
                        localStorage.setItem('user', JSON.stringify(usuario));
                        return usuario;
                    }
                }
            } catch (e) {
                console.log('No es estudiante, intentando como coordinador');
            }
            
            // Intentar como coordinador
            const response = await fetch(`${API_BASE}/apiUsuarios/LogInCoordinadores/${encodeURIComponent(correo)}`);
            if (response.ok) {
                const usuarios = await response.json();
                const usuario = Array.isArray(usuarios) ? 
                    usuarios.find(u => u.correo === correo && u.contrasenia === contrasenia) : 
                    usuarios;
                
                if (usuario) {
                    localStorage.setItem('user', JSON.stringify(usuario));
                    return usuario;
                }
            }
            
            throw new Error('Credenciales incorrectas');
        } catch (error) {
            throw new Error('Error de conexión: ' + error.message);
        }
    },

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'index2.html';
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return localStorage.getItem('user') !== null;
    },

    isCoordinador() {
        const user = this.getCurrentUser();
        return user && user.id_rol === 2;
    },

    isEstudiante() {
        const user = this.getCurrentUser();
        return user && user.id_rol === 3;
    }
};

// Servicio de Horas Sociales
export const horasService = {
    async obtenerHorasPorEstudiante(codigoEstudiante) {
        try {
            const response = await fetch(`${API_BASE}/apiHoras/getByCodigo/${codigoEstudiante}`);
            if (!response.ok) return { horas: 0, porcentaje: 0 };
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en horasService:', error);
            return { horas: 0, porcentaje: 0 };
        }
    }
};

// Servicio de Eventos
export const eventosService = {
    async obtenerEventos(page = 0, size = 10) {
        try {
            const response = await fetch(`${API_BASE}/apiEventos/getEventos?page=${page}&size=${size}`);
            if (!response.ok) return [];
            const data = await response.json();
            return data.content || data;
        } catch (error) {
            console.error('Error en eventosService:', error);
            return [];
        }
    },

    async obtenerEventosPorProyecto(idProyecto, page = 0, size = 10) {
        try {
            const response = await fetch(`${API_BASE}/apiEventos/getAllEventosByProyecto/${idProyecto}?page=${page}&size=${size}`);
            if (!response.ok) return [];
            const data = await response.json();
            return data.content || data;
        } catch (error) {
            console.error('Error en eventosService:', error);
            return [];
        }
    },

    async crearEvento(eventoData) {
        try {
            const response = await fetch(`${API_BASE}/apiEventos/postEvento`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventoData)
            });
            if (!response.ok) throw new Error('Error al crear evento');
            return await response.json();
        } catch (error) {
            console.error('Error en eventosService:', error);
            throw error;
        }
    }
};

// Servicio de Calendario
export const calendarioService = {
    async obtenerActividadesPorEstudiante(codigoEstudiante, page = 0, size = 10) {
        try {
            const response = await fetch(`${API_BASE}/apiCalendario/getByEstudiante/${codigoEstudiante}?page=${page}&size=${size}`);
            if (!response.ok) return [];
            const data = await response.json();
            return data.content || data;
        } catch (error) {
            console.error('Error en calendarioService:', error);
            return [];
        }
    }
};

// Servicio de Proyectos
export const proyectosService = {
    async obtenerProyectosActivos(page = 0, size = 10) {
        try {
            const response = await fetch(`${API_BASE}/apiProyectos/getProyectosActivos?page=${page}&size=${size}`);
            if (!response.ok) return [];
            const data = await response.json();
            return data.content || data;
        } catch (error) {
            console.error('Error en proyectosService:', error);
            return [];
        }
    }
};

// Servicio de Chat
export const chatService = {
    async obtenerChatsPorUsuario(usuarioId) {
        try {
            const response = await fetch(`${API_BASE}/api/chats/usuario/${usuarioId}`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error('Error en chatService:', error);
            return [];
        }
    },

    async obtenerMensajesPorChat(chatId) {
        try {
            const response = await fetch(`${API_BASE}/api/mensajes/chat/${chatId}`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error('Error en chatService:', error);
            return [];
        }
    },

    async enviarMensaje(mensajeData) {
        try {
            const response = await fetch(`${API_BASE}/api/mensajes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mensajeData)
            });
            if (!response.ok) throw new Error('Error al enviar mensaje');
            return await response.json();
        } catch (error) {
            console.error('Error en chatService:', error);
            throw error;
        }
    }
};