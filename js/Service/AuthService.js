const API_URL_AUTH = "https://shmsapi-9871bf53b299.herokuapp.com/apiAuth";

export async function LogInAdministradores(data) {
    return await fetch(`${API_URL_AUTH}/LoginAdmin`, {
        credentials: "include",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function LogInEncargado(data) {
    return await fetch(`${API_URL_AUTH}/LoginEncargado`, {
        credentials: "include",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function LogInEstudiantes(data) {
    return await fetch(`${API_URL_AUTH}/LoginEstudiante`, {
        credentials: "include",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function admin() {
    return await fetch(`${API_URL_AUTH}/admin`, {
        credentials: "include"
    });
}

export async function student() {
    return await fetch(`${API_URL_AUTH}/student`, {
        credentials: "include"
    });
}

export async function LogOut() {
    return await fetch(`${API_URL_AUTH}/logout`, {
        method: "POST",
        credentials: "include"
    });
}

export async function RegistrarEstudiante(data) {
    console.log('📤 Enviando registro a:', `${API_URL_AUTH}/RegisterEstudiante`);
    console.log('📦 Datos a enviar:', {
        ...data,
        contrasenia: '***', // Ocultar contraseña en logs
        foto: data.foto ? `[Base64: ${data.foto.length} chars]` : 'No incluida'
    });
    
    return await fetch(`${API_URL_AUTH}/RegisterEstudiante`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}