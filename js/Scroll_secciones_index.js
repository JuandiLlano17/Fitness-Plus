
        // Cuando la página cargue, verifica si hay un hash y desplázate a la sección
        window.addEventListener('load', function() {
            const hash = window.location.hash;
            if (hash) {
              const targetSection = document.querySelector(hash);
              if (targetSection) {
                // Desplazarse a la sección
                targetSection.scrollIntoView({ behavior: 'smooth' });
              }
            }
          });