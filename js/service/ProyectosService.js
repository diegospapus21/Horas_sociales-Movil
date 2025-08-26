const API_URL_Proyectos = "http://localhost:8080/apiProyectos";

export async function traerProyectosActivos(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Proyectos}/getProyectosActivos?page=${page}&size=${size}`);
    return res.json();
}

export async function traerProyectosCompletos(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Proyectos}/getAllProyectos?page=${page}&size=${size}`);
    return res.json();
}

export async function buscarProyecto(id) {
    const res = await fetch(`${API_URL_Proyectos}/getIDProyectos/${id}`);
    return res.json();
}

export async function nuevoProyecto(data) {
    await fetch(`${API_URL_Proyectos}/postProyectos`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function actualizarProyecto(id, data) {
    await fetch(`${API_URL_Proyectos}/putProyectos/${id}`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function eliminarProyecto(id) {
    await fetch(`${API_URL_Proyectos}/deleteProyectos/${id}`, {method: "DELETE"});
}