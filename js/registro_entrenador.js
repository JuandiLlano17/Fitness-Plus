// Manejo del cambio de imagen de perfil
document.getElementById('fotoPerfil').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('previewImagen').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Registro de entrenador
document.getElementById('registroEntrenadorBtn').addEventListener('click', async function () {
    try {
        const identificacion = document.getElementById('identificacion').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const edad = document.getElementById('edad').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const contraseña = document.getElementById('contrasena').value.trim();
        const fotoPerfilInput = document.getElementById('fotoPerfil');

        // Validaciones de campos
        if (!identificacion || !nombre || !edad || !correo || !contraseña) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }

        // Validar que la imagen de perfil haya sido seleccionada
        if (fotoPerfilInput.files.length === 0) {
            alert('Por favor selecciona una foto de perfil.');
            return;
        }

        const file = fotoPerfilInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const fotoBase64 = e.target.result; // Aquí está la imagen en Base64

            // Construcción del objeto entrenador
            const entrenador = {
                datosPersonales: {
                    "identificacion": identificacion,
                    "nombre": nombre,
                    "edad": edad,
                    "correo": correo,
                    "contrasena": contraseña,
                    "fotoPerfil": fotoBase64,
                    "rol": "entrenador"
                }
            };

            // Configuración de la solicitud XMLHttpRequest
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "api/POST/RegistroE.php", true);
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            alert('Registro exitoso');
                            window.location.href = "iniciar_sesion.html";
                        } else {
                            alert('Error en el registro: ' + response.message);
                        }
                    } else {
                        alert('Error en la solicitud al servidor.');
                    }
                }
            };

            // Enviar el objeto entrenador en formato JSON
            xhr.send(JSON.stringify(entrenador));
        };

        // Leer el archivo de imagen como Base64
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('Error al registrar el entrenador:', error);
        alert('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
    }
});
