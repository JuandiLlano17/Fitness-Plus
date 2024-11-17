document.addEventListener("DOMContentLoaded", function () {
    // Elementos para manejar días de entreno y medida de muñeca
    const checkboxes = document.querySelectorAll('input[name="diasEntreno"]');
    const summary = document.getElementById('diasSeleccionados');
    const radios = document.querySelectorAll('input[name="muñeca"]');
    const summaryMuñeca = document.getElementById('medidaMuñecaSeleccionada');

    const abreviaturas = {
        'lunes': 'Lun',
        'martes': 'Mar',
        'miercoles': 'Mié',
        'jueves': 'Jue',
        'viernes': 'Vie',
        'sabado': 'Sáb',
        'domingo': 'Dom'
    };

    function actualizarDiasSeleccionados() {
        const diasSeleccionados = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => abreviaturas[checkbox.value]);

        if (diasSeleccionados.length > 0) {
            summary.textContent = diasSeleccionados.join(', ');
            summary.style.color = 'black';
        } else {
            summary.textContent = 'Días de entreno';
            summary.style.color = '';
        }
    }

    function actualizarMedidaMuñeca() {
        const muñecaSeleccionada = Array.from(radios)
            .filter(radio => radio.checked)
            .map(radio => radio.labels[0].innerText);

        if (muñecaSeleccionada.length > 0) {
            summaryMuñeca.textContent = muñecaSeleccionada[0];
            summaryMuñeca.style.color = 'black';
        } else {
            summaryMuñeca.textContent = 'Medida de Muñeca';
            summaryMuñeca.style.color = '';
        }
    }

    // Eventos para actualizar los resúmenes de selección
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', actualizarDiasSeleccionados);
    });

    radios.forEach(radio => {
        radio.addEventListener('change', actualizarMedidaMuñeca);
    });

    // Inicializar valores al cargar la página
    actualizarDiasSeleccionados();
    actualizarMedidaMuñeca();

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

    document.getElementById('registroClienteBtn').addEventListener('click', function () {
    const identificacion = document.getElementById('identificacion').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const edad = document.getElementById('edad').value.trim();
    const peso = document.getElementById('peso').value.trim();
    const medidaMuñeca = document.querySelector('input[name="muñeca"]:checked')?.value;
    const diasEntreno = Array.from(document.querySelectorAll('input[name="diasEntreno"]:checked')).map(el => el.value).join(',');
    const altura = document.getElementById('altura').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const contraseña = document.getElementById('contraseña').value.trim();
    const fotoInput = document.getElementById('fotoPerfil');
    const fotoArchivo = fotoInput.files[0];

    if (!identificacion || !nombre || !edad || !peso || !medidaMuñeca || !diasEntreno || !altura || !correo || !contraseña || !fotoArchivo) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
    }

    // Convertir la imagen a Base64
    const reader = new FileReader();
    reader.onload = function (e) {
        const fotoBase64 = e.target.result; // Aquí está la imagen en Base64

        // Crear el objeto cliente con la imagen Base64
        const cliente = {
            "datosPersonales": {
            "identificacion": identificacion,
            "nombre": nombre,
            "edad": edad,
            "peso": peso,
            "medidaMuneca": medidaMuñeca,
            "diasEntreno": diasEntreno,
            "altura": altura,
            "correo": correo,
            "contrasena": contraseña,
            "fotoPerfil": fotoBase64, // La imagen como Base64
            "rol": "cliente"
            }
        };

        // Enviar el objeto cliente al servidor
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
        console.log(cliente);
        
        xhr.send(JSON.stringify(cliente)); // Enviar el cliente en formato JSON
    };

    reader.readAsDataURL(fotoArchivo); // Leer el archivo como Base64
    });
});
