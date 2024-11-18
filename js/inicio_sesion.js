// Agregar evento de clic al botón de iniciar sesión
document.getElementById('iniciarSesionBtn').addEventListener('click', function (e) {
    e.preventDefault(); // Evitar recarga de la página

    // Obtener los valores de los campos
    const correo = document.getElementById('email').value.trim();
    const contrasena = document.getElementById('password').value.trim();
    const mensajeError = document.getElementById('mensajeError');

    // Validaciones de campos
    if (correo === "" || contrasena === "") {
        mensajeError.textContent = "Por favor completa todos los campos.";
        return;
    }

    const iniciar = {
        "Inicio_sesion": {
            "correo": correo,
            "contrasena": contrasena
        }
    };

    // Crear el objeto XMLHttpRequest
    const xhr = new XMLHttpRequest();

    // Configurar la solicitud
    xhr.open('POST', 'api/POST/verificar_usuario.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    // Manejar la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);

                if (response.success === "entrenador") {
                    // Redirigir a la pantalla del entrenador
                    window.location.href = 'Cliente-Entrenado.html';
                } else if (response.success === "cliente") {
                    // Redirigir a la pantalla del cliente
                    window.location.href = 'opcion_cliente.html';
                } else {
                    // Mostrar mensaje de error si el servidor indica fallo
                    mensajeError.textContent = response.message || "Error al iniciar sesión.";
                }
            } catch (error) {
                console.error("Error al procesar la respuesta:", error);
                mensajeError.textContent = "Respuesta no válida del servidor.";
            }
        } else {
            mensajeError.textContent = "Error en la solicitud. Intenta nuevamente.";
        }
    };

    // Manejar errores de red
    xhr.onerror = function () {
        mensajeError.textContent = "No se pudo conectar con el servidor. Intenta nuevamente.";
    };

    // Enviar la solicitud con los datos en formato JSON
    xhr.send(JSON.stringify(iniciar));
});
