import {
    RegistrarEstudiante
} from '../Service/AuthService.js';
import{
    obtenerIcono
}from "../Service/GeneralidadesService.js"
import{
    cargarEspecialidades
}from "../Service/EspecialidadService.js"
import{
    uploadImage
}from "../Service/CloudinaryService.js"
import{
    AlertEsquina
}from "../Service/Alerts.js"

const registerForm = document.getElementById("registerForm");
const codigoInput = document.getElementById("codigo");
const nombreInput = document.getElementById("nombre")
const apellidoInput = document.getElementById("apellido");
const anio_academicoSelect = document.getElementById("anio_academico");
const especialidadSelect = document.getElementById("especialidad");
const seccion_academicaInput = document.getElementById("seccion_academica");
const FotoInput = document.getElementById("Foto");
const ImagePreview = document.getElementById("ImagePreview");
const correo_electronicoInput = document.getElementById("correo_electronico");
const contraseniaInput = document.getElementById("contrasenia");
const confirmContrasenia = document.getElementById("confirmContrasenia");
const btnSubmit = document.getElementById("btnSubmit");

//Funciones Service
async function cargar_Especialidades() {
    try{
        const data = await cargarEspecialidades();
        return data;
    }catch(err){
        console.error("Hubo problemas cargando", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL CARGAR DATOS!",
            html: "Hubo problemas intentando cargar la caja de proyectos.",
        });
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
async function NuevoRegistro(data) {
    try {
        const res = await RegistrarEstudiante(data);
        const textResponse = await res.text();
    
        let responseData;
        try {
            responseData = textResponse ? JSON.parse(textResponse) : {};
        } catch (parseError) {
            responseData = { message: textResponse || 'Error desconocido' };
        }
        
        if (res.ok) {
            return true;
        } else {
            const errorMessage = responseData.message || 
                                responseData.status || 
                                `Error ${res.status}: ${res.statusText}`;
            
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL REGISTRAR!",
                html: errorMessage,
                willClose: () => {
                    return false;
                }
            });
        }
    }catch(err){
        console.error("Hubo problemas registrando", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL REGISTRAR!",
            html: "Hubo problemas intentando registrar el nuevo estudiante.",
            willClose: () => {
                return false;
            }
        });
    }
}

//Funciones de Relleno
async function Llenar_Box(){
    const proyectos = await cargar_Especialidades();

    especialidadSelect.innerHTML = '';
    const opt = document.createElement("option");
    opt.value = "";
    opt.disabled = true;
    opt.selected = true;
    opt.hidden = true;
    opt.textContent = "Seleccione...";
    especialidadSelect.appendChild(opt);

    proyectos.forEach(proyecto => {

        const opt = document.createElement("option");
        opt.value = proyecto.id;
        opt.textContent = `${proyecto.nombre}`;
        opt.title = `${proyecto.concepto}`
        especialidadSelect.appendChild(opt);
    });

}
FotoInput.addEventListener("change", () => {
    const file = FotoInput.files?.[0];
    if(file){
        const reader = new FileReader();
        reader.onload = () => (ImagePreview.src = reader.result);
        reader.readAsDataURL(file);
    } else {
        FotoInput.value = "";
    }
});
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

//Validaciones
function validarCampos(){
    if(codigoInput.value == '' || nombreInput.value == '' || apellidoInput.value == '' || seccion_academicaInput.value == '' || correo_electronicoInput.value == '' || contraseniaInput.value == '' || confirmContrasenia.value == '' || FotoInput.value == '' || ImagePreview.src == ''){
        return "No puedes dejar campos vacios";
    }else if(contraseniaInput.value !== confirmContrasenia.value){
        return "La contraseña y la confirmación no coinciden";
    }else if(anio_academicoSelect.value !== "Primer Año" && anio_academicoSelect.value !== "Segundo Año"){
        return "Codigo alterado, no puede permitir valores que no sean Primer Año o Segundo Año"
    }else{
        return "success"
    }
}
function LimpiarFormulario() {
    codigoInput.value = '';
    nombreInput.value = '';
    apellidoInput.value = '';
    seccion_academicaInput.value = '';
    correo_electronicoInput.value = '';
    contraseniaInput.value = '';
    confirmContrasenia.value = '';
    FotoInput.value = '';
    ImagePreview.src = '';
    btnSubmit.disabled = false;
}

//Funcion principal
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    btnSubmit.disabled = true;
    
    const validar = validarCampos();
    if(validar !== "success"){
        AlertEsquina.fire({
            icon: "error",
            title: "¡PROCESO CANCELADO!",
            html: validar,
            willClose: () => {
                btnSubmit.disabled = false;
            }
        });
        return;
    }

    const codigo = codigoInput.value.trim();
    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const anioacademico = anio_academicoSelect.value;
    const especialidad = especialidadSelect.value;
    const seccionacademica = seccion_academicaInput.value.trim();
    const correo = correo_electronicoInput.value.trim();
    const constrasena = contraseniaInput.value.trim();
    let UpdatedFoto;
    const file = FotoInput?.files?.[0];
    if(file){
        try{
            const response = await uploadImage(file);
            if(response && response.data) {
                UpdatedFoto = response.data;
            } else {
                AlertEsquina.fire({
                    icon: "error",
                    title: "¡ERROR AL SUBIR LA FOTO!",
                    html: "Hubo problemas intentando subir la foto de perfil a la nube.",
                    willClose: () => {
                        btnSubmit.disabled = false;
                    }
                });
                return;
            }
        }catch(err){
            console.error("Error al subir imagen", err);
            AlertEsquina.fire({
                icon: "error",
                title: "¡ERROR AL SUBIR LA FOTO!",
                html: "Hubo problemas intentando subir la foto de perfil a la nube.",
                willClose: () => {
                    btnSubmit.disabled = false;
                }
            });
            return;
        }
    }

    const json = {
        "codigo": codigo,
        "nombre": nombre,
        "apellido": apellido,
        "año_academico": anioacademico,
        "especialidad": parseInt(especialidad),
        "seccion_academica": seccionacademica,
        "correo_electronico": correo,
        "contrasenia": constrasena,
        "estado": true,
        "foto": UpdatedFoto
    };

    const res = await NuevoRegistro(json);

    if(res){
        AlertEsquina.fire({
            icon: "success",
            title: "¡USUARIO REGISTRADO!",
            html: "No hubo problemas creando el usuario, regresando al LogIn.",
            willClose: () => {
                location.replace("index.html");
            }
        });
    }else{
        LimpiarFormulario();
    }
});

//Funcion de inicio
async function CargaRegistro() {
    await CargarIcono();
    await Llenar_Box();
}

window.addEventListener('DOMContentLoaded', CargaRegistro);