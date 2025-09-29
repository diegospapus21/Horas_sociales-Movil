const API_URL_Especialidades = "https://shmsapi-9871bf53b299.herokuapp.com/apiEspecialidades";

export async function getAll(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Especialidades}/getEspecialidades?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function cargarEspecialidades() {
    const res = await fetch(`${API_URL_Especialidades}/cargarEspecialidades`, {
        credentials: "include"
    });
    return res.json();
}

export async function getById(id) {
    const res = await fetch(`${API_URL_Especialidades}/getbyIDEspecialidades/${id}`, {
        credentials: "include"
    });
    return res.json();
}

export async function createEspecidalidad(data) {
    return await fetch(`${API_URL_Especialidades}/postEspecialidades`, {
        credentials: "include",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}

export async function updateEspecialidad(id, data) {
    return await fetch(`${API_URL_Especialidades}/putEspecialidades/${id}`, {
        credentials: "include",
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}

export async function deleteEspecialidades(id) {
    return await fetch(`${API_URL_Especialidades}/deleteEspecialidades/${id}`, {
        credentials: "include",
        method: "DELETE"
    });
}