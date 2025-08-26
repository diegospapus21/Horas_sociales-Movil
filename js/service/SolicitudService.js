const API_URL_Solicitudes = "http://localhost:8080/apiSolicitudes";

export async function getAllSolicitudes(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Solicitudes}/getSolicitudes?page=${page}&size=${size}`);
    return res.json();
}

export async function getAllAproved(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Solicitudes}/getSolicitudesAproved?page=${page}&size=${size}`);
    return res.json();
}

export async function getAllPendient(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Solicitudes}/getSolicitudesPendient?page=${page}&size=${size}`);
    return res.json();
}

export async function getByIdSolicitud(id) {
    const res = await fetch(`${API_URL_Solicitudes}/getbyIdSolicitudes/${id}`);
    return res.json();
}

export async function getByCodigoEstudiante(codigo) {
    const res = await fetch(`${API_URL_Solicitudes}/getbyEstudiante/${codigo}`);
    return res.json();
}

export async function createSolicitud(data) {
    await fetch(`${API_URL_Solicitudes}/postSolicitud`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function updateSolicitud(id, data) {
    await fetch(`${API_URL_Solicitudes}/putSolicitud/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function deleteSolicitud(id) {
    await fetch(`${API_URL_Solicitudes}/deleteSolicitud/${id}`, { method: 'DELETE' });
}