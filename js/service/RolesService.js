const API_URL_Roles = "http://localhost:8080/apiRoles";

export async function listarRoles() {
    const res = await fetch(`${API_URL_Roles}/getAll`);
    return res.json();
}

export async function obtenerRol(id) {
    const res = await fetch(`${API_URL_Roles}/getById/${id}`);
    return res.json();
}

export async function crearRol(data) {
    await fetch(`${API_URL_Roles}/postRoles`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
}

export async function actualizarRol(id, data) {
    await fetch(`${API_URL_Roles}/putRoles/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
}

export async function eliminarRol(id) {
    await fetch(`${API_URL_Roles}/deleteRoles/${id}`, { method: 'DELETE' });
}