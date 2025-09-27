// controllers/actividadController.js
import { getActividadesProximas } from "../services/actividadService.js";

export async function mostrarActividadesProximas() {
  try {
    const data = await getActividadesProximas();
    const lista = document.getElementById("listaActividades");
    lista.innerHTML = data.content
      .map(a => `<li>${a.nombre} - ${a.fechaInicio}</li>`)
      .join("");
  } catch (err) {
    console.error("Error mostrando actividades:", err);
  }
}
