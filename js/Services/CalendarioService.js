const API_URL_Calendario = "https://shmsapi-9871bf53b299.herokuapp.com/apiCalendario";

export async function getAllCalendario(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Calendario}/getAllCalendario?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function buscarCalendario(id) {
    const res = await fetch(`${API_URL_Calendario}/getById/${id}`, {
        credentials: "include"
    });
    return res.json();
}

export async function buscarPorEstudiante(codigo, page = 0, size = 5) {
    const res = await fetch(`${API_URL_Calendario}/getByEstudiante/${codigo}?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function crearCalendario(data) {
    return await fetch(`${API_URL_Calendario}/postCalendario`, {
        credentials: "include",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function actualizarCalendario(id, data) {
    return await fetch(`${API_URL_Calendario}/putCalendario/${id}`, {
        credentials: "include",
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function eliminarCalendario(id) {
    return await fetch(`${API_URL_Calendario}/deleteCalendario/${id}`, { 
        credentials: "include",
        method: 'DELETE' 
    });
}