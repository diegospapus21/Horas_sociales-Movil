const API_URL_Tablero = "http://localhost:8080/apiTablero";

export async function getAllPublicaciones(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Tablero}/getAllPublicaciones?page=${page}&size=${size}`);
    return res.json();
}

export async function obtenerPorId(id) {
    const res = await fetch(`${API_URL_Tablero}/getByID/${id}`);
    return res.json();
}

export async function getAllByProyecto(idProyecto, page = 0, size = 5) {
    const res = await fetch(`${API_URL_Tablero}/getByProyecto/${idProyecto}?page=${page}&size=${size}`);
    return res.json();
}

export async function crearPublicacion(data) {
    await fetch(`${API_URL_Tablero}/postPublicacion`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function actualizarPublicacion(id, data) {
    await fetch(`${API_URL_Tablero}/putPublicacion/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function eliminarPublicacion(id) {
    await fetch(`${API_URL_Tablero}/deletePublicacion/${id}`, { method: 'DELETE' });
}