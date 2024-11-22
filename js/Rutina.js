let segundos = 60;
let intervalo;
let ejercicioAnterior = ""; // Variable global para almacenar el ejercicio anterior

$(document).ready(function () {
  // Mostrar el modal del cronómetro cuando se hace clic en el botón de apertura
  $(document).on("click", ".button-cronometro", function () {
    $("#modalCronometro").css("display", "block");
    iniciarCuentaRegresiva(); // Iniciar la cuenta regresiva cuando se abre el cronómetro
  });

  // Botón de regresar (cierra el cronómetro)
  $("#boton-regresar").on("click", function () {
    $("#modalCronometro").css("display", "none");
    clearInterval(intervalo); // Detener la cuenta regresiva cuando se cierra la ventana
  });

  // Botón de reiniciar la cuenta regresiva
  $("#boton-reiniciar").on("click", function () {
    reiniciarCuentaRegresiva();
  });

  // Función para iniciar la cuenta regresiva
  function iniciarCuentaRegresiva() {
    segundos = 60; // Restablecer a 60 segundos
    clearInterval(intervalo); // Asegurarse de no tener múltiples intervalos
    intervalo = setInterval(actualizarCuentaRegresiva, 1000);
  }

  // Función para actualizar los segundos
  function actualizarCuentaRegresiva() {
    if (segundos > 0) {
      segundos--;
      $("#segundos").text(segundos.toString().padStart(2, "0"));
    } else {
      clearInterval(intervalo); // Detener la cuenta regresiva cuando llega a 0
    }
  }

  // Función para reiniciar la cuenta regresiva
  function reiniciarCuentaRegresiva() {
    clearInterval(intervalo);
    segundos = 60;
    $("#segundos").text("60");
    iniciarCuentaRegresiva(); // Reiniciar la cuenta regresiva desde 60
  }

  // Evento para cambiar ejercicio
  $(document).on("click", ".button-change-exercise", function () {
    // Si hay un ejercicio anterior guardado, se restaura
    if (ejercicioAnterior !== "") {
      $(".exercise1").html(ejercicioAnterior);
      ejercicioAnterior = ""; // Reseteamos el valor una vez restaurado
    } else {
      // Guardar el contenido actual del ejercicio antes de cambiar
      ejercicioAnterior = $(".exercise1").html();

      // Cambiar el contenido del ejercicio
      $(".exercise1").html(`
        <div class="video-container">
            <video controls>
                <source src="Video\Press Militar.mov" type="video/mp4">
                Tu navegador no soporta el elemento de video.
            </video>
        </div>

        <article class="exercise-details">
            <h2>Pectoral</h2>
            <h1>Press en máquina</h1>
            <ul class="exercise-tips">
                <li>Toma un peso que puedas cargar sin mucho problema</li>
                <li>Mantén la barra estable en tu espalda</li>
                <li>Mantén la espalda recta</li>
                <li>Baja de forma controlada hasta los 90 grados</li>
            </ul>
            <div class="exercise-actions">
                <button class="button button-cronometro">Cronómetro</button>
                <button class="button button-change-exercise">Cambiar Ejercicio</button>
            </div>
        </article>
      `);
    }
  });

  $(document).ready(function () {
    // Mostrar modal al hacer clic en el botón de finalizado
    $("#boton-finalizado").on("click", function () {
      $("#modalSatisfaccion").fadeIn();
    });
  
    // Redirigir a la página principal al hacer clic en el botón de salir
    $("#boton-salir").on("click", function () {
      window.location.href = "index.html";  // Redirige a la página iden.html
    });
  });
});

 // Evento para abrir el modal del cronómetro
 $(".button-cronometro").on("click", function () {
  $("#modalCronometro").fadeIn();
});

// Evento para cerrar el modal del cronómetro
$(".close").on("click", function () {
  $("#modalCronometro").fadeOut();
});
