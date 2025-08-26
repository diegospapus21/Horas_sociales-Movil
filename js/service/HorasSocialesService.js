const API_URL_HorasSociales = "http://localhost:8080/apiHoras";

export async function buscarHoras(codigo) {
    const res = await fetch(`${API_URL_HorasSociales}/getByCodigo/${codigo}`);
    return res.json();
}

export async function crearHorasSociales(codigo) {
    await fetch(`${API_URL_HorasSociales}/postHoras/${codigo}`, { method: 'POST' });
}

export async function modificarHorasSociales(id, data) {
    await fetch(`${API_URL_HorasSociales}/putHoras/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    })
}

export async function eliminarHorasSociales(id) {
    await fetch(`${API_URL_HorasSociales}/deleteHoras/${id}`, { method: 'DELETE' });
}