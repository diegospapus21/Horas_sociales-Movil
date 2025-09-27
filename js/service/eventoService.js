// services/eventoService.js
const API_URL = "http://localhost:8080/apiEventos";

export async function getEventosTrabajados(page = 0, size = 10) {
  const res = await fetch(`${API_URL}/getEventos?page=${page}&size=${size}`);
  if (!res.ok) throw new Error("Error al obtener eventos trabajados");
  return res.json();
}
