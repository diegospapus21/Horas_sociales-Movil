function mostrarTarjeta(comision) {
            // Oculta todas las tarjetas primero
            document.querySelectorAll('.comision-card').forEach(card => {
                card.classList.remove('active-card');
            });
            
            // Muestra solo la tarjeta seleccionada
            document.getElementById(`${comision}-card`).classList.add('active-card');
        }