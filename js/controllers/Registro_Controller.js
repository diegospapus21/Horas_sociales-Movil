async function Cargar_Especialidades(){
    try{
        const data = await cargarEspecialidades();
        return(data);
    }catch(err){
        console.error("Hubieron problemas cargando", err);
        AlertEsquina.fire({
            icon: "error",
            title: "¡ERROR AL CARGAR DATOS!",
            html: "Hubieron problemas intentando cargar las especialidades.",
        });
    }
}