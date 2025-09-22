function setupEventListeners() {
      // Este archivo ahora solo inicializa el controlador
    document.addEventListener('DOMContentLoaded', () => {
    // El controlador se inicializa automáticamente
    console.log('Aplicación de chat inicializada');
    });
    // Botón de toggle para móviles
    const mobileToggle = document.querySelector('.mobile-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleContactsPanel);
    }
    
    // Cerrar panel de contactos al hacer clic en un chat (solo móviles)
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleContactsPanel();
            }
        });
    });
}

function toggleContactsPanel() {
    const contactsPanel = document.querySelector('.contacts-panel');
    contactsPanel.classList.toggle('active');
    
    const mobileToggle = document.querySelector('.mobile-toggle');
    if (contactsPanel.classList.contains('active')) {
        mobileToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        mobileToggle.innerHTML = '<i class="fas fa-comments"></i>';
    }
}

// Detectar cambios de tamaño de ventana
window.addEventListener('resize', handleResize);

function handleResize() {
    const contactsPanel = document.querySelector('.contacts-panel');
    const mobileToggle = document.querySelector('.mobile-toggle');
    
    if (window.innerWidth > 768) {
        contactsPanel.classList.remove('active');
        mobileToggle.style.display = 'none';
    } else {
        mobileToggle.style.display = 'flex';
    }
}

// Ejecutar al cargar
handleResize();