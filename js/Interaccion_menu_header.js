
function toggleMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    // Verificar si el menú está abierto o cerrado
    if (mobileMenu.style.display === 'block') {
      mobileMenu.style.display = 'none';
      menuToggle.classList.remove('open'); // Remover clase "open" si estaba activada
    } else {
      mobileMenu.style.display = 'block';
      menuToggle.classList.add('open'); // Agregar clase "open" si el menú se abre
    }
  }

  // Cerrar el menú desplegable si se hace clic fuera de él
  document.addEventListener('click', function(event) {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      mobileMenu.style.display = 'none'; // Cierra el menú si haces clic fuera de él
      menuToggle.classList.remove('open'); // Remover clase "open" cuando se cierra el menú
    }
  });

  document.addEventListener('DOMContentLoaded', function() {

    // Cerrar el menú cuando se hace clic en una opción del menú
    document.querySelectorAll('.mobile-menu a').forEach(function(link) {
      link.addEventListener('click', function() {
        document.querySelector('.mobile-menu').style.display = 'none';
        document.querySelector('.menu-toggle').classList.remove('open'); // Asegurar que se cierre
      });
    });

    function navigateToSection(sectionId) {
      const currentPage = window.location.pathname.split('/').pop();
      if (currentPage === 'index.html' || currentPage === '') {
        scrollToSection(sectionId);
      } else {
        window.location.href = `index.html#${sectionId.substring(1)}`;
      }
    }

    document.querySelector('.menu a[href="#gym"]').addEventListener('click', function(event) {
      event.preventDefault();
      navigateToSection('#why-us');
    });

    document.querySelector('.menu a[href="#trainers"]').addEventListener('click', function(event) {
      event.preventDefault();
      navigateToSection('#trainers');
    });

    document.querySelector('.menu a[href="#about"]').addEventListener('click', function(event) {
      event.preventDefault();
      navigateToSection('#join-us');
    });
  });
