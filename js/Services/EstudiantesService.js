const API_URL_Estudiantes = "https://shmsapi-9871bf53b299.herokuapp.com/apiEstudiantes";

export async function traerEstudiantes(page = 0, size = 10) {
    const res = await fetch(`${API_URL_Estudiantes}/getEstudiantes?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function buscarEstudiante(codigo) {
    const res = await fetch(`${API_URL_Estudiantes}/getIDEstudiantes/${codigo}`, {
        credentials: "include"
    });
    return res.json();
}

export async function getByEspecialidad(especialidad, page = 0, size = 3) {
    const res = await fetch(`${API_URL_Estudiantes}/getByEspecialidadEstudiantes/${especialidad}?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function getByNombre(nombre, page = 0, size = 3) {
    const res = await fetch(`${API_URL_Estudiantes}/getByNombreEstudiantes/${nombre}?page=${page}&size=${size}`, {
        credentials: "include"
    });
    return res.json();
}

export async function agregarEstudiante(data) {
    return await fetch(`${API_URL_Estudiantes}/postEstudiante`, {
        credentials: "include",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
}

export async function actualizarEstudiante(codigo, data) {
    return await fetch(`${API_URL_Estudiantes}/putEstudiantes/${codigo}`, {
        credentials: "include",        
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    })
}

export async function borrarEstudiante(codigo) {
    return await fetch(`${API_URL_Estudiantes}/deleteEstudiante/${codigo}`, {
        credentials: "include",
        method: "DELETE"
    });
}