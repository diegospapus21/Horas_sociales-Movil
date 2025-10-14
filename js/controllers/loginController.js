import {
    LogInEncargado,
    LogInEstudiantes
} from '../Service/AuthService.js';

import{
    AlertEsquina
}from "../Service/Alerts.js"

import{
    obtenerIcono
}from "../Service/GeneralidadesService.js"

window.addEventListener('DOMContentLoaded', () => {
    
    localStorage.clear();
    sessionStorage.clear();
    
    const loginForm = document.getElementById('loginForm');
    const email_Box = document.getElementById('email');
    const password_Box = document.getElementById('password');
    const login_btn = document.getElementById("login-btn");
    const Icono_Rical = document.getElementById("Icono_Rical");

    async function Buscar_Encargado(json) {
        try{
            const res = await LogInEncargado(json);
            console.log(res);
            if(res.ok || res.status == 403){
                const textResponse = await res.json();
                console.log(textResponse);
                if(textResponse.result == "Inicio de sesion exitoso"){
                    return true;
                }else{
                    AlertEsquina.fire({
                        icon: "error",
                        title: "¡CREDENCIALES INCORRECTAS!",
                        html: "No se encontro ningun usuario. Intentalo con otra información.",
                        willClose: () => {
                            return false;   
                        }
                    });
                }
            }
        } catch(err){
            console.error('Hubo problemas buscando el usuario', err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡NO SE PUDO CARGAR!",
                html: "Hubo un problema con la conexion, no se pudieron corroborar los datos.",
            });
            throw err;
        }
    }
    async function Buscar_Estudiante(json) {
        try{
            const res = await LogInEstudiantes(json);
            const textResponse = await res.json();
            if(textResponse.result == "Inicio de sesion exitoso"){
                return true;
            }else{
                return false;
            }
        } catch(err){
            console.error('Hubo problemas buscando el usuario', err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡NO SE PUDO CARGAR!",
                html: "Hubo un problema con la conexion, no se pudieron corroborar los datos.",
            });
            throw err;
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

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        login_btn.disabled = true;

        const email = email_Box.value;
        const password = password_Box.value;

        const json = {
            "correo": email,
            "contrasenia": password,
            "id_rol": 2
        }

        const Encargado = await Buscar_Encargado(json);
        
        if (Encargado) {
            AlertEsquina.fire({
                icon: "success",
                title: "¡USUARIO CORRECTO!",
                html: "Bienvenido! Abriendo Dashboard!",
                willClose: () => {
                    location.replace("Dashboard - Coordinadores.html");
                }
            });
        }else{
            const json = {
                "correo": email,
                "contrasenia": password,
                "id_rol": 3
            }

            const Estudiante = await Buscar_Estudiante(json);
            
            if (Estudiante) {
                AlertEsquina.fire({
                    icon: "success",
                    title: "¡USUARIO CORRECTO!",
                    html: "¡Bienvenido! ¡Abriendo Dashboard!",
                    willClose: () => {
                        location.replace("Dashboard - Estudiantes.html");
                    }
                });
            }else{
                email_Box.value = '';
                password_Box.value = '';
                login_btn.disabled = false;   
            }
        }
    });
    async function CargarIcono() {
        const res = await ObtenerIcono();
        Icono_Rical.src = res;
    
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }
        link.href = res;
    }

    CargarIcono();
});