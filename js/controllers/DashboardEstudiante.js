import{
    buscarHoras
}from "../Service/HorasSocialesService.js"
import{
    student
}from "../Service/AuthService.js"
import{
    AlertEsquina
}from "../Service/Alerts.js"
import{
    obtenerLimiteHoras
}from "../Service/GeneralidadesService.js"

async function ObtenerLimitHoras() {
        try{
            const Limite = await obtenerLimiteHoras();
            return Limite.limiteHoras;
        }catch(err){
            console.error("Hubieron problemas cargando el limite de Horas Sociales");
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL CARGAR DATOS!",
                html: "Hubieron problemas al cargar el valor del limite de horas sociales.",
            });
        }
    }
async function ObtenerHoras(CodigoEstudiante) {
    try{
        const data = await buscarHoras(CodigoEstudiante);
        return data;
    }catch(err){
        console.error("No se pudo cargar datos", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡NO SE PUDO CARGAR!",
            html: "Hubo un problema con la conexion, no se pudieron obtener las horas sociales del estudiante.",
        });
    }
}

async function HorasSociales() {
    const res = await student();
    const auth = await res.json();
    let estudianteId;

    if(auth.authenticated && auth.user){
        estudianteId = auth.user.id;
    }else{
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR CON LA CONEXION!",
            html: "Hubieron problemas al intentar conseguir la informacion de perdil del administrador",
            willClose: () => {
                return;
            }
        });
    }

    const Horas = await ObtenerHoras(estudianteId);
    const limiteHoras = await ObtenerLimitHoras();

    const horas = Horas.horas || 0;
    let horasFaltantes;
    let porcentaje;
    let Horasrequeridas;

    porcentaje = (horas / limiteHoras) * 100.00 || 0;
    Horasrequeridas = limiteHoras;
    horasFaltantes = limiteHoras - horas;

    document.getElementById('horas-completadas').textContent = horas;
    document.getElementById('horas-faltantes').textContent = horasFaltantes;
    document.getElementById('Horasrequeridas').textContent = Horasrequeridas;
    document.getElementById("percentage-text").textContent = `${porcentaje.toFixed(1)}%`;

    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${porcentaje}%`;
    progressBar.setAttribute('aria-valuenow', porcentaje);
    progressBar.textContent = `${porcentaje.toFixed(1)}%`;

    const progress_pie = document.getElementById("progress-pie");
    progress_pie.style = `--percentage: ${porcentaje}%`;

}

function CargaInicialDashEstudiantes() {
    HorasSociales();
}

window.addEventListener("DOMContentLoaded", CargaInicialDashEstudiantes)