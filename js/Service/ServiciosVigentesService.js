const API_URL_Servicios = "https://shmsapi-9871bf53b299.herokuapp.com/apiServiciosVigentes";

export async function traerServicios(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Servicios}/getServicios?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function EncontrarPorProyectos(idProyecto, page = 0, size = 5) {
    const res = await fetch(`${API_URL_Servicios}/getServicioByProyecto/${idProyecto}?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function EncontrarPorEstudiante(codigo) {
    const res = await fetch(`${API_URL_Servicios}/getServicioByNombre/${codigo}`, {
        credentials: "include"
    });
    return res.json();
}

export async function buscarServicio(id) {
    const res = await fetch(`${API_URL_Servicios}/getByIDServicios/${id}`, {
        credentials: "include"
    });
    return res.json();
}

export async function ContarServicios(idProyecto) {
    const res = await fetch(`${API_URL_Servicios}/ContarServicios/${idProyecto}`, {
        credentials: "include"
    });
    return res.json();
}

export async function createServicio(data) {
    return await fetch(`${API_URL_Servicios}/postServicios`, {
        credentials: "include",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function updateServicio(id, data) {
    return await fetch(`${API_URL_Servicios}/putServicios/${id}`, {
        credentials: "include",
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function deleteServicio(id) {
    return await fetch(`${API_URL_Servicios}/deleteServicios/${id}`, {
        credentials: "include",
        method: 'DELETE'
    });
}