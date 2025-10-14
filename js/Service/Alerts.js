export const AlertEsquina = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    theme: "dark",
    timer: 3000,
    padding: "15px",
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

export const alert_confirm = Swal.mixin({
    showCancelButton: true,
    theme: "dark",
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    allowOutsideClick: () => !Swal.isLoading(),
    inputAttributes: {
        autocapitalize: "off",
        autocomplete: "new-password"
    }
});