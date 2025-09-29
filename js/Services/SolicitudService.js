const API_URL_Solicitudes = "https://shmsapi-9871bf53b299.herokuapp.com/apiSolicitudes";

export async function getAllSolicitudes(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Solicitudes}/getSolicitudes?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function getAllAproved(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Solicitudes}/getSolicitudesAproved?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function getAllPendient(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Solicitudes}/getSolicitudesPendient?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function getByIdSolicitud(id) {
    const res = await fetch(`${API_URL_Solicitudes}/getbyIdSolicitudes/${id}`, {
        credentials: "include"
    });
    return res.json();
}

export async function getByCodigoEstudiante(codigo) {
    const res = await fetch(`${API_URL_Solicitudes}/getbyEstudiante/${codigo}`, {
        credentials: "include"
    });
    return res.json();
}

export async function createSolicitud(data) {
    await fetch(`${API_URL_Solicitudes}/postSolicitud`, {
        credentials: "include",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function updateSolicitud(id, data) {
    await fetch(`${API_URL_Solicitudes}/putSolicitud/${id}`, {
        credentials: "include",
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function deleteSolicitud(id) {
    await fetch(`${API_URL_Solicitudes}/deleteSolicitud/${id}`, {
        credentials: "include",
        method: 'DELETE'
    });
}