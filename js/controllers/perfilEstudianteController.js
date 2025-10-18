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
import{
    buscarEstudiante
}from "../Service/EstudiantesService.js"
import{
    buscarServicio,
    EncontrarPorEstudiante
}from "../Service/ServiciosVigentesService.js"

const img_Profile = document.getElementById("img_Profile");
const student_name = document.getElementById("student_name");
const student_code = document.getElementById("student_code");
const anioAcademico = document.getElementById("anioAcademico");
const Horas_Sociales = document.getElementById("Horas_Sociales");
const Porcentaje = document.getElementById("Porcentaje");
const progress_bar = document.getElementById("progress-bar");
const sectionComision = document.getElementById("sectionComision");

function goBack() {
    if (document.referrer && document.referrer !== window.location.href) {
        window.history.back();
    } else {
        window.location.href = "Dashboard - Estudiantes.html";
    }
}

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

async function Buscar_Estudiante(CodigoEstudiante) {
    try{
        const data = await buscarEstudiante(CodigoEstudiante);
        return data;
    }catch(err){
        console.error("No se pudo cargar datos", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡NO SE PUDO CARGAR!",
            html: "Hubo un problema con la conexion, no se pudieron obtener los datos del estudiante.",
        });
    }
}

async function BuscarServicioVigente(CodigoEstudiante) {
    try{
        const data = EncontrarPorEstudiante(CodigoEstudiante);
        return data;
    }catch(err){
        console.error("Hubieron problemas buscando", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡NO SE PUDO CARGAR!",
            html: "Hubo un problema con la conexion, no se pudieron obtener el servicio vigente del estudiante.",
        });
    }
}

async function LlenarInfo() {
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

    const Estudiante = await Buscar_Estudiante(estudianteId);
    console.log(Estudiante);
    const Horas = await ObtenerHoras(estudianteId);
    const servicio = await BuscarServicioVigente(estudianteId)
    const limiteHoras = await ObtenerLimitHoras();

    img_Profile.src = Estudiante.foto;
    student_name.textContent = `${Estudiante.nombre} ${Estudiante.apellido}`;
    student_code.textContent = Estudiante.codigo;
    anioAcademico.textContent = Estudiante.año_academico;

    const horas = Horas.horas || 0;
    const porcentaje = (horas / limiteHoras) * 100.00 || 0;
    Horas_Sociales.textContent = `${horas}/${limiteHoras}`;
    Porcentaje.textContent = porcentaje.toFixed(1);
    progress_bar.style.width = `${porcentaje}%`;
    progress_bar.setAttribute('aria-valuenow', porcentaje);

    if(Estudiante.estado === true){
        const ServicioData = servicio[0];
    console.log(ServicioData);
    if(servicio.lenght == 0 || !ServicioData){
        sectionComision.innerHTML = `
                <h2 class="section-title">Comisión</h2>
                <div class="comision-card">
                    <h3 class="comision-name">Sin proyecto asignado</h3>
                </div>
        `;
    }else{
        sectionComision.innerHTML = `
                <h2 class="section-title">Comisión</h2>
                <div class="comision-card">
                    <h3 class="comision-name">${ServicioData.proyecto_nombre}</h3>
                    <span class="comision-status">Activo</span>
                </div>
        `;
    }
    }else{
        sectionComision.innerHTML += `
                <h2 class="section-title">Comisión</h2>
                <div class="comision-card">
                    <h3 class="comision-name">Servicio Social Completado</h3>
                </div>
        `;
    }
}

window.goBack = goBack;
window.addEventListener('DOMContentLoaded', LlenarInfo);