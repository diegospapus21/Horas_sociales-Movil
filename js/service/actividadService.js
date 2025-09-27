// services/actividadService.js
const API_URL = "http://localhost:8080/apiCalendario"; // ajusta puerto si es diferente

export async function getActividadesProximas(page = 0, size = 10) {
  const res = await fetch(`${API_URL}/getActividades?page=${page}&size=${size}`);
  if (!res.ok) throw new Error("Error al obtener actividades próximas");
  return res.json();
}
