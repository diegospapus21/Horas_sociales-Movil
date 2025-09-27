// controllers/comunicadoController.js
import { getComunicados } from "../services/comunicadoService.js";

export async function mostrarComunicados() {
  try {
    const data = await getComunicados();
    const lista = document.getElementById("listaComunicados");
    lista.innerHTML = data.content
      .map(c => `<li><b>${c.titulo}</b>: ${c.descripcion}</li>`)
      .join("");
  } catch (err) {
    console.error("Error mostrando comunicados:", err);
  }
}
