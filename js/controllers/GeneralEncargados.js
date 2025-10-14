import{
    buscarAdministrador
}from "../Service/AdministradoresService.js"

import{
    obtenerLogo,
    obtenerIcono
}from "../Service/GeneralidadesService.js"

import{
    admin,
    LogOut
}from "../Service/AuthService.js"

import{
    AlertEsquina
}from "../Service/Alerts.js"

window.appState = {
    isBlocked: false,
    allowedOperations: true
};

    const img_Logo = document.getElementById("img_Logo");
    const btnLogOut = document.getElementById("logout-btn");

    //Metodos del Service
    async function ObtenerLogo(){
        try{
            const Logo = await obtenerLogo();
            return Logo.LogoRical;
        }catch(err){
            console.error("Hubieron problemas cargando el logo del colegio");
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL CARGAR DATOS!",
                html: "Hubieron problemas al cargar la imagen del logo.",
            });
            return null;
        }
    }
    async function ObtenerIcono(){
        try{
            const Logo = await obtenerIcono();
            return Logo.IconoRical;
        }catch(err){
            console.error("Hubieron problemas cargando el icono del colegio");
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL CARGAR DATOS!",
                html: "Hubieron problemas al cargar la imagen del icono.",
            });
            return null;
        }
    }
    async function CargarProfile(id) {
        try{
            const data = await buscarAdministrador(id);
            document.getElementById('user-name').textContent = `${data.nombre} ${data.apellido}`;
            document.getElementById('user-role').textContent = data.rol;
        } catch(err){
            console.error('Error al cargar datos' , err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL CARGAR DATOS!",
                html: "Hubieron problemas al cargar la informacion del perfil.",
            });
        }
    }

    //Metodo para comprobar autenticacion
    async function Guardar_Admin() {
        try{
            const res = await admin();
            const auth = await res.json();

            if(auth.authenticated && auth.user.rol == 'Encargado'){
                CargarProfile(auth.user.id);
            }else if(auth.authenticated && auth.user.rol != 'Encargado'){
                window.appState.isBlocked = true;
                window.appState.allowedOperations = false;
                AlertEsquina.fire({
                    icon: "error",
                    title: "¡NO ES UN ENCARGADO!",
                    html: "La sesion iniciada no pertenece a un Encargado. Regresando al Login",
                    willClose: async() => {
                        await LogOut;
                        location.replace("Login.html");
                    }
                });
            }else{
                window.appState.isBlocked = true;
                window.appState.allowedOperations = false;
                AlertEsquina.fire({
                    icon: "error",
                    title: "¡SESION CERRADA!",
                    html: "Sesion cerrada. Regresando al LogIn.",
                    willClose: () => {
                        location.replace("Login.html");
                    }
                });
            }
        }catch(err){
            console.error("Error en la conexion", err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR CON LA CONEXION!",
                html: "Hubieron problemas al intentar comprobar la sesion iniciada. Regresando al LogIn",
                willClose: () => {
                    location.replace("Login.html");
                }
            });
        }
    }
    btnLogOut.addEventListener('click', async () => {
        const res = await LogOut();
        if(res.ok){
            location.replace("Login.html");
        }else{
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR CON LA COOKIE!",
                html: "Hubieron problemas al intentar eliminar el token de autenticacion."
            });
        }
    });

    //Metodos para cargar las imagenes
    async function CargarLogo(){
        if(!img_Logo){
            return;
        }
        const VarLogoRicaldone = localStorage.getItem("LogoRicaldone");
        if(!VarLogoRicaldone){ 
            const Logo = await ObtenerLogo();
            localStorage.setItem("LogoRicaldone", Logo);
            img_Logo.src = Logo;
        }else{
            img_Logo.src = VarLogoRicaldone;
        }
    }
    async function CargarIcono() {
        const res = await ObtenerIcono();
    
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }
        link.href = res;
    }

    async function CargaInicialGeneral(){
        await Guardar_Admin();
        CargarLogo();
        CargarIcono();
    }

window.addEventListener("DOMContentLoaded", CargaInicialGeneral);
