let segundos = 60;
let intervalo;

$(document).ready(function () {
    // Mostrar el modal del cronómetro cuando se hace clic en el botón de apertura (puedes ajustarlo según el botón que quieras usar)
    $('#boton-cronometro').on('click', function () {
        $('#modalCronometro').css('display', 'block');
        iniciarCuentaRegresiva();
    });

    // Botón de regresar (cierra el cronómetro)
    $('#boton-regresar').on('click', function () {
        $('#modalCronometro').css('display', 'none');
        clearInterval(intervalo); // Detener la cuenta regresiva cuando se cierra la ventana
    });

    // Botón de reiniciar la cuenta regresiva
    $('#boton-reiniciar').on('click', function () {
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
            $('#segundos').text(segundos.toString().padStart(2, '0'));
        } else {
            clearInterval(intervalo); // Detener la cuenta regresiva cuando llega a 0
        }
    }

    // Función para reiniciar la cuenta regresiva
    function reiniciarCuentaRegresiva() {
        clearInterval(intervalo);
        segundos = 60;
        $('#segundos').text('60');
        iniciarCuentaRegresiva(); // Reiniciar la cuenta regresiva desde 60
    }
});

// Evento para cambiar ejercicio
$(".button-change-exercise").on("click", function () {
    // Cambiar el contenido de la sección exercise con nuevo contenido
    $(".exercise1").html(`
        <div class="video-container">
            <video controls>
                <source src="Video/20240823_152007000_iOS.MOV" type="video/mp4">
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
});