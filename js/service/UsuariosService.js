const API_URL_Usuarios = "http://localhost:8080/apiUsuarios";

export async function traerUsuarios(page = 0, size = 10) {
    const res = await fetch(`${API_URL_Usuarios}/getUsuarios?page=${page}&size=${size}`);
    return res.json();
}

export async function buscarUsuario(id) {
    const res = await fetch(`${API_URL_Usuarios}/getIdUsuarios/${id}`);
    return res.json();
}

export async function LoginCoordinadores(correo) {
    const res = await fetch(`${API_URL_Usuarios}/LogInCoordinadores/${correo}`);
    return res.json();
}

export async function LoginAdministradores(correo) {
    const res = await fetch(`${API_URL_Usuarios}/LogInAdministradores/${correo}`);
    return res.json();
}

export async function LogInEstudiantes(correo) {
    const res = await fetch(`${API_URL_Usuarios}/LogInEstudiantes/${correo}`);
    return res.json();
}

export async function agregarUsuario(data) {
    await fetch(`${API_URL_Usuarios}/postUsuario`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function actualizarUsuarios(id, data) {
    await fetch(`${API_URL_Usuarios}/putUsuarios/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function borrarUsuario(id) {
    await fetch(`${API_URL_Usuarios}/deleteEstudiante/${id}`, { method: 'DELETE' });
}