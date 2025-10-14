const API_URL_AreasProyectos = "https://shmsapi-9871bf53b299.herokuapp.com/apiAreasProyectos";

export async function getAll(page = 0, size = 5) {
    const res = await fetch(`${API_URL_AreasProyectos}/getAreasProyectos?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function cargarAreasProyectos() {
    const res = await fetch(`${API_URL_AreasProyectos}/cargarAreasProyectos`, {
        credentials: "include"
    });
    return res.json();
}

export async function getByIdAreasProyectos(id) {
    const res = await fetch(`${API_URL_AreasProyectos}/getbyIDAreasProyectos/${id}`, {
        credentials: "include"
    });
    return res.json();
}

export async function createAreasProyectos(data) {
    return await fetch(`${API_URL_AreasProyectos}/postAreasProyectos`, {
        credentials: "include",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}

export async function updateAreasProyectos(id, data) {
    return await fetch(`${API_URL_AreasProyectos}/putAreasProyectos/${id}`, {
        credentials: "include",
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}

export async function deleteAreasProyectos(id) {
    return await fetch(`${API_URL_AreasProyectos}/deleteAreasProyectos/${id}`, {
        credentials: "include",
        method: "DELETE"
    });
}