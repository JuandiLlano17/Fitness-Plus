document.addEventListener('DOMContentLoaded', function () {
    const guardarButton = document.querySelector('.button-centrado');

    // Mapeo de nombres de ejercicios a sus respectivos ID
    const ejerciciosId = {
        'Press de Banca': 2,
        'Aperturas con Mancuernas': 3,
        'Press Inclinado': 4,
        'Remo con Barra': 5,
        'Dominadas': 6,
        'Peso Muerto': 7,
        'Sentadilla Libre': 8,
        'Prensa': 9,
        'Extensiones de Cuadriceps': 10,
        'Sentadilla Hack': 11,
        'Sentadilla Smith': 12,
        'Curl de Biceps': 13,
        'Triceps en Polea': 14,
        'Curl Martillo': 15,
        'Press Militar': 16,
        'Elevaciones Laterales': 17,
        'Face Pull': 18,
        'Crunch': 19,
        'Plancha': 20,
        'Elevaciones de Piernas': 21
    };

    // Función para obtener los ejercicios seleccionados (con IDs en lugar de nombres)
    function obtenerIdEjercicio() {
        const idEjercicio = [];
        
        // Seleccionamos todos los divs con la clase 'previsualizacion'
        const divsEjercicios = document.querySelectorAll('.previsualizacion');

        // Iteramos sobre cada div 'previsualizacion' y extraemos el título del ejercicio
        divsEjercicios.forEach(div => {
            // Buscamos dentro de cada 'div' el título del ejercicio dentro de '.titulo-container .titulo'
            const tituloEjercicio = div.querySelector('.titulo-container .titulo');
            if (tituloEjercicio) {
                // Extraemos el texto del título del ejercicio
                const nombreEjercicio = tituloEjercicio.textContent.trim();

                // Si el nombre del ejercicio está en el mapeo, lo añadimos al array de ID
                if (ejerciciosId[nombreEjercicio]) {
                    idEjercicio.push(ejerciciosId[nombreEjercicio]);
                }
            }
        });

        console.log("ID Ejercicios seleccionados:", idEjercicio);
        return idEjercicio;
    }

    // Definir la función obtenerClienteId
    function obtenerClienteId() {
        // Obtener el id del cliente desde la URL
        const urlParams = new URLSearchParams(window.location.search);
        const clienteId = urlParams.get('id');  // Obtenemos el id del cliente desde la URL

        // Verificar si se ha proporcionado el ID del cliente
        if (!clienteId) {
            console.error("No se ha proporcionado el ID del cliente.");
            return null;  // Si no se encuentra el ID, retornamos null
        } else {
            console.log("ID Cliente:", clienteId);
            return clienteId;  // Si se encuentra, lo retornamos
        }
    }

    guardarButton.addEventListener('click', function () {
        const clienteId = obtenerClienteId(); // Ahora la función obtiene el clienteId correctamente
        const dia = "lunes"; // Día estático según el requerimiento

        // Verificar selección de tiempo de rutina
        const tiempoRutinaInput = document.querySelector('input[name="tiempo-rutina"]:checked');
        if (!tiempoRutinaInput) {
            console.log("Error: No se seleccionó un tiempo de rutina.");
            alert("Por favor selecciona un tiempo de rutina");
            return; // Detener la ejecución si no se selecciona un tiempo
        }
        const tiempoRutina = tiempoRutinaInput.value;

        // Verificar selección de ejercicios
        const idEjercicio = obtenerIdEjercicio(); // Ahora obtenemos los IDs de los ejercicios
        if (!idEjercicio || idEjercicio.length === 0) {
            console.log("Error: No se seleccionaron ejercicios.");
            alert("Por favor selecciona al menos un ejercicio");
            return; // Detener la ejecución si no hay ejercicios seleccionados
        }

        console.log("Datos iniciales recopilados:", {
            cliente_id: clienteId,
            dia: dia,
            tiempo_rutina: tiempoRutina,
            id_ejercicio: idEjercicio
        });

        // Enviar los datos al servidor usando fetch
        fetch('api/POST/guardar_rutina.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cliente_id: clienteId,
                dia: dia,
                tiempo_rutina: tiempoRutina,
                id_ejercicio: idEjercicio
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log("Rutina guardada con éxito.");
            } else {
                console.error("Error al guardar la rutina:", data.message);
                alert('Hubo un error al guardar la rutina');
            }
        })
        .catch(error => {   
            console.error("Error en la solicitud:", error);
            alert('Hubo un error de conexión');
        });
    });
});
