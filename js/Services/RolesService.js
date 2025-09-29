const API_URL_Roles = "https://shmsapi-9871bf53b299.herokuapp.com/apiRoles";

export async function listarRoles() {
    const res = await fetch(`${API_URL_Roles}/getAll`, {
        credentials: "include"
    });
    return res.json();
}

export async function obtenerRol(id) {
    const res = await fetch(`${API_URL_Roles}/getById/${id}`, {
        credentials: "include"
    });
    return res.json();
}

export async function crearRol(data) {
    await fetch(`${API_URL_Roles}/postRoles`, {
        credentials: "include",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
}

export async function actualizarRol(id, data) {
    await fetch(`${API_URL_Roles}/putRoles/${id}`, {
        credentials: "include",
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
}

export async function eliminarRol(id) {
    await fetch(`${API_URL_Roles}/deleteRoles/${id}`, {
        credentials: "include",
        method: 'DELETE'
    });
}