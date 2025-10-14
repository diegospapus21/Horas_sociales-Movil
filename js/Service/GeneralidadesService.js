const API_URL_Generalidades = "https://shmsapi-9871bf53b299.herokuapp.com/apiGeneralidades";

export async function obtenerLimiteHoras() {
    const res = await fetch(`${API_URL_Generalidades}/getLimiteHoras`, {
        credentials: "include"
    });
    return res.json();
}

export async function obtenerLogo() {
    const res = await fetch(`${API_URL_Generalidades}/getLogo`, {
        credentials: "include"
    });
    return res.json();
}

export async function obtenerIcono() {
    const res = await fetch(`${API_URL_Generalidades}/getIcono`, {
        credentials: "include"
    });
    return res.json();
}

export async function CargarGeneralidades() {
    const res = await fetch(`${API_URL_Generalidades}/getAllGeneralidades`, {
        credentials: "include"
    });
    return res.json();
}

export async function ActualizarValores(json) {
    return await fetch(`${API_URL_Generalidades}/ActualizarValor`, {
        credentials: "include",
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(json)
    });
}