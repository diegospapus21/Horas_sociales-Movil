const API_URL_Especialidades = "http://localhost:8080/apiEspecialidades";

export async function getAll(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Especialidades}/getEspecialidades?page=${page}&size=${size}`);
    return res.json();
}

export async function cargarEspecialidades() {
    const res = await fetch(`${API_URL_Especialidades}/cargarEspecialidades`);
    return res.json();
}

export async function getById(id) {
    const res = await fetch(`${API_URL_Especialidades}/getbyIDEspecialidades/${id}`);
    return res.json();
}

export async function createEspecidalidad(data) {
    await fetch(`${API_URL_Especialidades}/postEspecialidades`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}

export async function updateEspecialidad(id, data) {
    await fetch(`${API_URL_Especialidades}/putEspecialidades/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}

export async function deleteEspecialidades(id) {
    await fetch(`${API_URL_Especialidades}/deleteEspecialidades/${id}`, {
        method: "DELETE"
    });
}