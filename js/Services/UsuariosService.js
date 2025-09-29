const API_URL_Usuarios = "https://shmsapi-9871bf53b299.herokuapp.com/apiUsuarios";

export async function traerUsuarios(page = 0, size = 10) {
    const res = await fetch(`${API_URL_Usuarios}/getUsuarios?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function buscarUsuario(id) {
    const res = await fetch(`${API_URL_Usuarios}/getIdUsuarios/${id}`, {
        credentials: "include"
    });
    return res.json();
}

export async function comprobarUsuario(correo) {
    const res = await fetch(`${API_URL_Usuarios}/comprobarUsuario/${correo}`, {
        credentials: "include"
    });
    return res.json();
}

export async function agregarUsuario(data) {
    return await fetch(`${API_URL_Usuarios}/postUsuario`, {
        credentials: "include",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function actualizarUsuarios(id, data) {
    return await fetch(`${API_URL_Usuarios}/putUsuarios/${id}`, {
        credentials: "include",
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function borrarUsuario(id) {
    return await fetch(`${API_URL_Usuarios}/deleteEstudiante/${id}`, {
        credentials: "include",
        method: 'DELETE'
    });
}