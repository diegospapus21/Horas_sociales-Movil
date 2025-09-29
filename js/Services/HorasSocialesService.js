const API_URL_HorasSociales = "https://shmsapi-9871bf53b299.herokuapp.com/apiHoras";

export async function buscarHoras(codigo) {
    const res = await fetch(`${API_URL_HorasSociales}/getByCodigo/${codigo}`, {
        credentials: "include"
    });
    return res.json();
}

export async function crearHorasSociales(codigo) {
    return await fetch(`${API_URL_HorasSociales}/postHoras/${codigo}`, { 
        credentials: "include",
        method: 'POST'
    });
}

export async function modificarHorasSociales(id, data) {
    return await fetch(`${API_URL_HorasSociales}/putHoras/${id}`, {
        credentials: "include",
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
}

export async function eliminarHorasSociales(id) {
    return await fetch(`${API_URL_HorasSociales}/deleteHoras/${id}`, {
        credentials: "include",
        method: 'DELETE'
    });
}