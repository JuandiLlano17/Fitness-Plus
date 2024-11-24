document.addEventListener("DOMContentLoaded", () => {
    // Elemento al que se asignará el evento de clic
    const cardContainer = document.querySelector(".card-container");

    // Función para obtener el día actual desde WorldTimeAPI usando un proxy PHP
    function getDayFromAPI(callback) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "api/GET/proxy.php", true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (data && typeof data.day_of_week === "number") {
                        const daysInSpanish = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
                        const dayName = daysInSpanish[data.day_of_week];
                        console.log(`Día obtenido desde WorldTimeAPI: ${dayName}`);
                        callback(null, dayName);
                    } else {
                        console.error("Estructura inesperada en la respuesta de WorldTimeAPI:", data);
                        callback("Estructura de datos inválida", null);
                    }
                } catch (error) {
                    console.error("Error al procesar la respuesta de WorldTimeAPI:", error);
                    callback(error, null);
                }
            } else {
                console.error("Error al obtener datos de WorldTimeAPI:", xhr.statusText);
                callback(xhr.statusText, null);
            }
        };

        xhr.onerror = function () {
            console.error("Error de red al intentar conectarse al servidor intermedio");
            callback("Error de red", null);
        };

        xhr.send();
    }

    // Función para cargar y verificar si existe una rutina para el día actual
    function loadRoutine() {
        getDayFromAPI((error, diaActual) => {
            if (error) {
                console.error("Error al obtener el día:", error);
                mostrarModal("No se pudo obtener el día actual. Por favor, intenta nuevamente más tarde.");
                return;
            }

            console.log("Día actual obtenido:", diaActual);

            const xhr = new XMLHttpRequest();
            xhr.open("GET", `api/GET/rutina.php?dia=${encodeURIComponent(diaActual)}`, true);

            xhr.onload = function () {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        if (data && data.success) {
                            console.log("Rutina encontrada:", data.rutina);
                            // Redirigir a Rutina.html
                            window.location.href = "Rutina.html";
                        } else {
                            console.warn("No se encontraron rutinas disponibles para hoy.");
                            mostrarModal(data.message || "No se encontraron rutinas disponibles para hoy.");
                        }
                    } catch (error) {
                        console.error("Error al procesar la rutina:", error);
                        mostrarModal("Error al procesar los datos de la rutina.");
                    }
                } else {
                    console.error("Error al cargar las rutinas:", xhr.statusText);
                    mostrarModal("Error al intentar cargar las rutinas.");
                }
            };

            xhr.onerror = function () {
                console.error("Error de red al intentar cargar las rutinas");
                mostrarModal("Error de red al intentar cargar las rutinas.");
            };

            xhr.send();
        });
    }

    // Función para mostrar el modal con un mensaje
    function mostrarModal(mensaje) {
        const modal = document.getElementById("modal");
        const modalContent = modal.querySelector(".modal-content");

        if (modal && modalContent) {
            modalContent.innerText = mensaje; // Cambia el contenido del mensaje
            modal.style.display = "flex"; // Cambiar de "none" a "flex"
        } else {
            console.error("No se pudo encontrar el modal o su contenido.");
        }
    }

    // Cerrar el modal al hacer clic en "OK"
    document.getElementById("modal-close").addEventListener("click", function () {
        const modal = document.getElementById("modal");
        if (modal) {
            modal.style.display = "none"; // Oculta el modal
            // Redirigir a index.html
            window.location.href = "index.html";
        }
    });

    // Asignar evento de clic al contenedor card-container
    if (cardContainer) {
        cardContainer.addEventListener("click", () => {
            console.log("Se hizo clic en card-container. Verificando rutina...");
            loadRoutine(); // Llamar a la función para cargar y verificar la rutina
        });
    } else {
        console.error("No se encontró el elemento card-container.");
    }
});
