 // Simulación de carga de datos
        document.addEventListener('DOMContentLoaded', function() {
            // Simulamos una carga de datos después de 1 segundo
            setTimeout(function() {
                document.getElementById('total-estudiantes').textContent = '125';
                document.getElementById('total-eventos').textContent = '8';
                document.getElementById('solicitudes-pendientes').textContent = '12';
                document.getElementById('horas-totales').textContent = '1,250';
                
                // Simular carga del nombre de usuario
                document.getElementById('user-name').textContent = 'Juan Pérez';
            }, 1000);
            
            // Manejar el botón de cerrar sesión
            document.getElementById('logout-btn').addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    // Aquí iría la lógica para cerrar sesión
                    alert('Sesión cerrada');
                    // Redirigir a la página de login
                    window.location.href = 'login.html';
                }
            });
        });