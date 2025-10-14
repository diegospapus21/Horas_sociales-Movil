const API_URL_Prorrogas = "https://shmsapi-9871bf53b299.herokuapp.com/apiProrrogas";

export async function getAllProrrogas(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Prorrogas}/getAllProrrogas?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json()
}

export async function getAllProrrogasPendients(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Prorrogas}/getAllPendientes?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function findAllByProyecto(idProyecto, page = 0, size = 5) {
    const res = await fetch(`${API_URL_Prorrogas}/getByProyecto/${idProyecto}?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function buscarProrroga(id) {
    const res = await fetch(`${API_URL_Prorrogas}/getById/${id}`, {
        credentials: "include"
    });
    return res.json();
}

export async function agregarProrroga(data) {
    await fetch(`${API_URL_Prorrogas}/postProrroga`, {
        credentials: "include",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
}

export async function actualizarProrroga(id, data) {
    await fetch(`${API_URL_Prorrogas}/putProrroga/${id}`, {
        credentials: "include",
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
}

export async function eliminarProrroga(id) {
    await fetch(`${API_URL_Prorrogas}/deleteProrroga/${id}`, {
        credentials: "include",
        method: 'DELETE'
    });
}