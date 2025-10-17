const API_URL_AUTH = "https://shmsapi-9871bf53b299.herokuapp.com/apiAuth";

export async function LogInAdministradores(data) {
    return await fetch(`${API_URL_AUTH}/LoginAdmin`, {
        credentials: "include",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function LogInEncargado(data) {
    return await fetch(`${API_URL_AUTH}/LoginEncargado`, {
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

export async function admin() {
    return await fetch(`${API_URL_AUTH}/admin`, {
        credentials: "include"
    });
}

export async function student() {
    return await fetch(`${API_URL_AUTH}/student`, {
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
        credentials: "include",
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
}