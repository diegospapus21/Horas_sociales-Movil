const API_URL_Eventos = "https://shmsapi-9871bf53b299.herokuapp.com/apiEventos";

export async function obtenerEventos(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Eventos}/getEventos?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function obtenerEventosporProyecto(id) {
    const res = await fetch(`${API_URL_Eventos}/getAllEventosByProyecto/${id}?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function obtenerEventosporMes(month, year) {
    return await fetch(`${API_URL_Eventos}/EventosByMonth/${year}/${month}`, {
        credentials: "include"
    });
}

export async function obtenerRecientes(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Eventos}/getRecients?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function buscarEvento(id) {
    const res = await fetch(`${API_URL_Eventos}/getbyIdEventos/${id}`, {
        credentials: "include"
    });
    return res.json();
}

export async function agregarEvento(data) {
    await fetch(`${API_URL_Eventos}/postEvento`, {
        credentials: "include",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
}

export async function actualizarEvento(id, data) {
    await fetch(`${API_URL_Eventos}/putEventos/${id}`, {
        credentials: "include",
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),  
    });
}

export async function borrarUsuario(id) {
    await fetch(`${API_URL_Eventos}/deleteEventos/${id}`, { 
        credentials: "include",
        method: 'DELETE'
    });
}