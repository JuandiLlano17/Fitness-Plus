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
