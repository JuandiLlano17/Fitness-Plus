 // Vista previa de la imagen de perfil
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

document.getElementById('registroEntrenadorBtn').addEventListener('click', function () {
const identificacion = document.getElementById('identificacion').value.trim();
const nombre = document.getElementById('nombre').value.trim();
const edad = document.getElementById('edad').value.trim();
const correo = document.getElementById('correo').value.trim();
const contraseña = document.getElementById('contrasena').value.trim();
const fotoInput = document.getElementById('fotoPerfil');
const fotoArchivo = fotoInput.files[0];

if (!identificacion || !nombre || !edad || !correo || !contraseña || !fotoArchivo) {
    alert('Por favor completa todos los campos obligatorios.');
    return;
}

// Convertir la imagen a Base64
const reader = new FileReader();
reader.onload = function (e) {
    const fotoBase64 = e.target.result; // Aquí está la imagen en Base64

    const entrenador = {
        "datosPersonales": {
        "identificacion": identificacion,
        "nombre": nombre,
        "edad": edad,
        "correo": correo,
        "contrasena": contraseña,
        "fotoPerfil": fotoBase64, // La imagen como Base64
        "rol": "entrenador"
        }
    };

    // Enviar el objeto cliente al servidor
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "api/POST/Registro.php", true);
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
    console.log(entrenador);
    
    xhr.send(JSON.stringify(entrenador)); // Enviar el cliente en formato JSON
};

reader.readAsDataURL(fotoArchivo); // Leer el archivo como Base64
});