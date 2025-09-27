// controllers/eventoController.js
import { getEventosTrabajados } from "../services/eventoService.js";

export async function mostrarEventosTrabajados() {
  try {
    const data = await getEventosTrabajados();
    const lista = document.getElementById("listaEventos");
    lista.innerHTML = data.content
      .map(e => `<li>${e.titulo} - ${e.fecha}</li>`)
      .join("");
  } catch (err) {
    console.error("Error mostrando eventos:", err);
  }
}
