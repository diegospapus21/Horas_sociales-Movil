const API_URL_Bitacora = "https://shmsapi-9871bf53b299.herokuapp.com/apiMovimientos";

export async function GetAllMovimientos(page = 0, size = 5) {
    const res = await fetch(`${API_URL_Bitacora}/getAllPage?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function buscarMovimiento(id) {
    const res = await fetch(`${API_URL_Bitacora}/getById/${id}`, {
        credentials: "include"
    });
    return res.json();
}

export async function agregarABitacora(data) {
    await fetch(`${API_URL_Bitacora}/postMovimiento`, {
        credentials: "include",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}