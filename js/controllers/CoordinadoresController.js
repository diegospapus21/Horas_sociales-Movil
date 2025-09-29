        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                document.getElementById('total-estudiantes').textContent = '125';
                document.getElementById('total-eventos').textContent = '8';
                document.getElementById('solicitudes-pendientes').textContent = '12';
                document.getElementById('horas-totales').textContent = '1,250';
                
                document.getElementById('user-name').textContent = 'Juan Pérez';
            }, 1000);
            
            document.getElementById('logout-btn').addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    alert('Sesión cerrada');
                    window.location.href = 'login.html';
                }
            });
            
        });