const API_URL_Eventos = "http://localhost:8080/apiEventos";

export async function obtenerEventos(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Eventos}/getEventos?page=${page}&size=${size}`);
    return res.json();
}

export async function obtenerEventosporProyecto(id) {
    const res = await fetch(`${API_URL_Eventos}/getAllEventosByProyecto/${id}?page=${page}&size=${size}`);
    return res.json();
}

export async function buscarEvento(id) {
    const res = await fetch(`${API_URL_Eventos}/getbyIdEventos/${id}`);
    return res.json();
}

export async function agregarEvento(data) {
    await fetch(`${API_URL_Eventos}/postEvento`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
}

export async function actualizarEvento(id, data) {
    await fetch(`${API_URL_Eventos}/putEventos/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),  
    });
}

export async function borrarUsuario(id) {
    await fetch(`${API_URL_Eventos}/deleteEventos/${id}`, { method: 'DELETE' });
}