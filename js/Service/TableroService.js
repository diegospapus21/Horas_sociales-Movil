const API_URL_Tablero = "https://shmsapi-9871bf53b299.herokuapp.com/apiTablero";

export async function getAllPublicaciones(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Tablero}/getAllPublicaciones?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function obtenerPorId(id) {
    const res = await fetch(`${API_URL_Tablero}/getByID/${id}`, {
        credentials: "include"
    });
    return res.json();
}

export async function getAllByProyecto(idProyecto, page = 0, size = 5) {
    const res = await fetch(`${API_URL_Tablero}/getByProyecto/${idProyecto}?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function getAllByNombre(nombre, page = 0, size = 5) {
    const res = await fetch(`${API_URL_Tablero}/getByCoordi/${nombre}?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function crearPublicacion(data) {
    return await fetch(`${API_URL_Tablero}/postPublicacion`, {
        credentials: "include",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function actualizarPublicacion(id, data) {
    return await fetch(`${API_URL_Tablero}/putPublicacion/${id}`, {
        credentials: "include",
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function eliminarPublicacion(id) {
    return await fetch(`${API_URL_Tablero}/deletePublicacion/${id}`, { 
        credentials: "include",
        method: 'DELETE'
    });
}