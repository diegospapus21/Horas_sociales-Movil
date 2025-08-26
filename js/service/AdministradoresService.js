const API_URL_Administradores = "http://localhost:8080/getAllAdministradores";

export async function getAllAdministradores(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Administradores}/getAllAdministradores?page=${page}&size=${size}`);
    return res.json();
}

export async function getAllAdministradoresActives(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Administradores}/getAllActives?page=${page}&size=${size}`);
    return res.json();
}

export async function getAllCoordinadores(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Administradores}/getCoordinadores?page=${page}&size=${size}`);
    return res.json();
}

export async function findAllAdministradores(nombre, page = 0, size = 5) {
    const res = await fetch(`${API_URL_Administradores}/getByNombre/${nombre}?page=${page}&size=${size}`);
    return res.json();
}

export async function buscarAdministrador(id) {
    const res =await fetch(`${API_URL_Administradores}/getById/${id}`);
    return res.json();
}

export async function agregarAdministrador(data) {
    await fetch(`${API_URL_Administradores}/postAdmin`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function actualizarAdministrador(id, data) {
    await fetch(`${API_URL_Administradores}/putAdministrador/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function eliminarAdministrador(id) {
    await fetch(`${API_URL_Administradores}/deleteAdmin/${id}`, { method: 'DELETE' });
}