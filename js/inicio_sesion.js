// Agregar evento de clic al botón de iniciar sesión
$('#iniciarSesionBtn').on('click', function (e) {
    e.preventDefault(); // Evitar recarga de la página

    // Obtener los valores de los campos
    const correo = $('#email').val().trim();
    const contrasena = $('#password').val().trim();
    const mensajeError = $('#mensajeError');

    // Validaciones de campos
    if (correo === "" || contrasena === "") {
        mensajeError.text("Por favor completa todos los campos.");
        return;
    }

    const iniciar = {
        "Inicio_sesion": {
            "correo": correo,
            "contrasena": contrasena
        }
    };

    // Enviar los datos al servidor usando AJAX
    $.ajax({
        url: 'api/POST/verificar_usuario.php',
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(iniciar),
        success: function (response) {
            try {
                if (response.success) {
                    // Redirigir al usuario si el inicio de sesión es exitoso
                    window.location.href = 'dashboard.html';
                } else {
                    // Mostrar mensaje de error si el servidor indica fallo
                    mensajeError.text(response.message || "Error al iniciar sesión.");
                }
            } catch (error) {
                console.error("Error al procesar la respuesta:", error);
                mensajeError.text("Respuesta no válida del servidor.");
            }
        },
        error: function () {
            mensajeError.text("Error en la solicitud. Intenta nuevamente.");
        }
    });
});
