document.addEventListener("DOMContentLoaded", () => {
    let selectedEmojiId = null;

    // Seleccionar emojis y manejar clics
    const emojis = document.querySelectorAll(".emoji-satisfaction");
    emojis.forEach((emoji) => {
        emoji.addEventListener("click", () => {
            selectedEmojiId = emoji.getAttribute("data-id");
            emojis.forEach((e) => e.classList.remove("selected"));
            emoji.classList.add("selected");
        });
    });

    // Manejar el clic en el botón Guardar
    const guardarBtn = document.getElementById("GuardarBtn");
    guardarBtn.addEventListener("click", () => {
        if (!selectedEmojiId) {
            alert("Selecciona un nivel de satisfacción antes de guardar.");
            return;
        }

        // Crear el objeto con los datos
        const datos = {
            satisfaccion: selectedEmojiId
        };

        // Enviar datos al servidor con AJAX
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "api/POST/Nivel_Satifaccion.php", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const respuesta = JSON.parse(xhr.responseText);
                    if (respuesta.success) {
                        alert(respuesta.message); // Mostrar el mensaje
                        window.location.href = "Rutina.html"; // Redirigir a rutina.html
                    } else {
                        alert("Error: " + respuesta.message);
                    }
                } else {
                    console.error("Error en la solicitud AJAX:", xhr.statusText);
                }
            }
        };

        xhr.send(JSON.stringify(datos));
    });
});

