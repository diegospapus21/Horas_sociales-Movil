const API_URL_AUTH = "https://shmsapi-9871bf53b299.herokuapp.com/apiAuth";

export async function LogInAdministradores(data) {
    return await fetch(`${API_URL_AUTH}/LoginAdmin`, {
        credentials: "include",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function LogInCoordinadores(data) {
    return await fetch(`${API_URL_AUTH}/LoginCoordi`, {
        credentials: "include",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function LogInEstudiantes(data) {
    return await fetch(`${API_URL_AUTH}/LoginEstudiante`, {
        credentials: "include",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function me() {
    return await fetch(`${API_URL_AUTH}/me`, {
        credentials: "include"
    });
}

export async function LogOut() {
    return await fetch(`${API_URL_AUTH}/logout`, {
        method: "POST",
        credentials: "include"
    });
}

export async function RegistrarEstudiante(data) {
    return await fetch(`${API_URL_AUTH}/RegisterEstudiante`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
}