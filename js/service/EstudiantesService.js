const API_URL_Estudiantes = "http://localhost:8080/apiEstudiantes";

export async function traerEstudiantes(page = 0, size = 10) {
    const res = await fetch(`${API_URL_Estudiantes}/getEstudiantes?page=${page}&size=${size}`);
    return res.json();
}

export async function buscarEstudiante(codigo) {
    const res = await fetch(`${API_URL_Estudiantes}/getIDEstudiantes/${codigo}`);
    return res.json();
}

export async function getByEspecialidad(especialidad, page = 0, size = 3) {
    const res = await fetch(`${API_URL_Estudiantes}/getByEspecialidadEstudiantes/${especialidad}?page=${page}&size=${size}`);
    return res.json();
}

export async function getByNombre(nombre, page = 0, size = 3) {
    const res = await fetch(`${API_URL_Estudiantes}/getByNombreEstudiantes/${nombre}?page=${page}&size=${size}`);
    return res.json();
}

export async function agregarEstudiante(data) {
    await fetch(`${API_URL_Estudiantes}/postEstudiante`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
}

export async function actualizarEstudiante(codigo, data) {
    await fetch(`${API_URL_Estudiantes}/putEstudiantes/${codigo}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    })
}

export async function borrarEstudiante(codigo) {
    await fetch(`${API_URL_Estudiantes}/deleteEstudiante/${codigo}`, {method: "DELETE"});
}