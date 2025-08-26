const API_URL_Servicios = "http://localhost:8080/apiServiciosVigentes";

export async function traerServicios(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Servicios}/getServicios?page=${page}&size=${size}`);
    return res.json();
}

export async function EncontrarPorProyectos(proyecto, page = 0, size = 5) {
    const res = await fetch(`${API_URL_Servicios}/getServicioByProyecto/${proyecto}?page=${page}&size=${size}`);
    return res.json();
}

export async function EncontrarPorEstudiante(codigo) {
    const res = await fetch(`${API_URL_Servicios}/getServicioByNombre/${codigo}`);
    return res.json();
}

export async function buscarServicio(id) {
    const res = await fetch(`${API_URL_Servicios}/getByIDServicios/${id}`);
    return res.json();
}

export async function createServicio(data) {
    await fetch(`${API_URL_Servicios}/postServicios`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function updateServicio(id, data) {
    await fetch(`${API_URL_Servicios}/putServicios/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function deleteServicio(id) {
    await fetch(`${API_URL_Servicios}/deleteServicios/${id}`, { method: 'DELETE' });
}