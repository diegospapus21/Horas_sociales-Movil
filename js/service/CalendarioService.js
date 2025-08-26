const API_URL_Calendario = "http://localhost:8080/apiCalendario";

export async function getAllCalendario(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Calendario}/getAllCalendario?page=${page}&size=${size}`);
    return res.json();
}

export async function buscarCalendario(id) {
    const res = await fetch(`${API_URL_Calendario}/getById/${id}`);
    return res.json();
}

export async function buscarPorEstudiante(codigo, page = 0, size = 5) {
    const res = await fetch(`${API_URL_Calendario}/getByEstudiante/${codigo}?page=${page}&size=${size}`);
    return res.json();
}

export async function crearCalendario(data) {
    await fetch(`${API_URL_Calendario}/postCalendario`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function actualizarCalendario(id, data) {
    await fetch(`${API_URL_Calendario}/putCalendario/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function eliminarCalendario(id) {
    await fetch(`${API_URL_Calendario}/deleteCalendario/${id}`, { method: 'DELETE' });
}