const API_URL_Proyectos = "https://shmsapi-9871bf53b299.herokuapp.com/apiProyectos";

export async function traerProyectosCompletos(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Proyectos}/getAllProyectos?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function cargarProyectos() {
    const res = await fetch(`${API_URL_Proyectos}/cargarProyectos`, {
        credentials: "include"
    });
    return res.json();
}

export async function buscarProyectoPorNombre(nombre, page = 0, size = 5) {
    const res = await fetch(`${API_URL_Proyectos}/getByNombre/${nombre}?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function buscarProyecto(id) {
    const res = await fetch(`${API_URL_Proyectos}/getIDProyectos/${id}`, {
        credentials: "include"
    });
    return res.json();
}

export async function nuevoProyecto(data) {
    return await fetch(`${API_URL_Proyectos}/postProyectos`, {
        credentials: "include",
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function actualizarProyecto(id, data) {
    return await fetch(`${API_URL_Proyectos}/putProyectos/${id}`, {
        credentials: "include",
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function HabilitarProyecto(id) {
    return await fetch(`${API_URL_Administradores}/ActivarProyecto/${id}`, {
        credentials: "include",
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'}
    });
}

export async function DeshabilitarProyecto(id) {
    return await fetch(`${API_URL_Administradores}/DesactivarProyecto/${id}`, {
        credentials: "include",
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'}
    });
}

export async function eliminarProyecto(id) {
    return await fetch(`${API_URL_Proyectos}/deleteProyectos/${id}`, {
        credentials: "include",
        method: "DELETE"
    });
}