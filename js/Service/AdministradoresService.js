const API_URL_Administradores = "https://shmsapi-9871bf53b299.herokuapp.com/apiAdministradores";

export async function getAllAdministradores(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Administradores}/getAllAdministradores?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function getAllAdministradoresActives(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Administradores}/getAllActives?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function getAllEncargados(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Administradores}/getEncargado?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function findAllByNombre(nombre, page = 0, size = 5) {
    const res = await fetch(`${API_URL_Administradores}/getByNombre/${nombre}?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function findAllByProyecto(id, page = 0, size = 5) {
    const res = await fetch(`${API_URL_Administradores}/getByProyecto/${id}?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function buscarAdministrador(id) {
    const res = await fetch(`${API_URL_Administradores}/getById/${id}`, {
        credentials: "include"
    });
    return res.json();
}

export async function agregarAdministrador(data) {
    return await fetch(`${API_URL_Administradores}/postAdmin`, {
        credentials: "include",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function actualizarAdministrador(id, data) {
    return await fetch(`${API_URL_Administradores}/putAdministrador/${id}`, {
        credentials: "include",
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function DeshabilitarAdmin(id) {
    return await fetch(`${API_URL_Administradores}/DeshabilitarAdmin/${id}`, {
        credentials: "include",
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'}
    });
}

export async function HabilitarAdmin(id) {
    return await fetch(`${API_URL_Administradores}/HabilitarAdmin/${id}`, {
        credentials: "include",
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'}
    });
}

export async function modificarProyecto(id, idProyecto) {
    return await fetch(`${API_URL_Administradores}/ModificarProyectoAdmin/${id}/${idProyecto}`, {
        credentials: "include",
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'}
    });
}

export async function eliminarAdministrador(id) {
    return await fetch(`${API_URL_Administradores}/deleteAdmin/${id}`, { 
        credentials: "include",
        method: 'DELETE'
    });
}