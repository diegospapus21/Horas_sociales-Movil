// services/comunicadoService.js
const API_URL = "http://localhost:8080/apiTablero"; // o Generalidades/Mensaje según tu API real

export async function getComunicados(page = 0, size = 10) {
  const res = await fetch(`${API_URL}/getComunicados?page=${page}&size=${size}`);
  if (!res.ok) throw new Error("Error al obtener comunicados");
  return res.json();
}
