const API_URL_AUTH = "https://shmsapi-9871bf53b299.herokuapp.com/apiAuth";

// Funciones de Login CORREGIDAS - usando contrasenia en lugar de contrasena
export async function LogInAdministradores(data) {
    return await fetch(`${API_URL_AUTH}/LoginAdmin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            correo: data.correo,
            contrasenia: data.contrasena // ← CORREGIDO: contrasena → contrasenia
        })
    });
}

export async function LogInCoordinadores(data) {
    return await fetch(`${API_URL_AUTH}/LoginEncargado`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            correo: data.correo,
            contrasenia: data.contrasena // ← CORREGIDO: contrasena → contrasenia
        })
    });
}

export async function LogInEstudiantes(data) {
    return await fetch(`${API_URL_AUTH}/LoginEstudiante`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            correo: data.correo,
            contrasenia: data.contrasena // ← CORREGIDO: contrasena → contrasenia
        })
    });
}

// Función para registrar Estudiantes
export async function RegistrarEstudiante(data) {
    console.log('📤 Enviando a RegisterEstudiante:', data);
    
    try {
        const response = await fetch(`${API_URL_AUTH}/RegisterEstudiante`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const responseText = await response.text();
        console.log('📥 Respuesta del servidor - Status:', response.status);
        console.log('📥 Respuesta del servidor - Texto:', responseText);
        
        return new Response(responseText, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });
        
    } catch (error) {
        console.error('❌ Error de conexión en RegistrarEstudiante:', error);
        throw error;
    }
}

// Funciones para obtener información del usuario autenticado
export async function getCurrentAdmin() {
    return await fetch(`${API_URL_AUTH}/admin`, {
        credentials: "include"
    });
}

export async function getCurrentStudent() {
    return await fetch(`${API_URL_AUTH}/student`, {
        credentials: "include"
    });
}

export async function me() {
    return await fetch(`${API_URL_AUTH}/me`, {
        credentials: "include"
    });
}

export async function LogOut() {
    return await fetch(`${API_URL_AUTH}/logout`, {
        method: "POST",
        credentials: "include"
    });
}

export function manejarErrorResponse(response) {
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.text();
}

export async function verificarAutenticacion() {
    try {
        const response = await me();
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        return null;
    }
}