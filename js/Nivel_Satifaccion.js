document.addEventListener("DOMContentLoaded", () => {
    let selectedEmojiId = null;

    // Obtener todos los emojis y añadirles un event listener para detectar el clic
    const emojis = document.querySelectorAll(".emoji-satisfaction");
    emojis.forEach((emoji) => {
        emoji.addEventListener("click", () => {
            // Guardar el ID del emoji seleccionado
            selectedEmojiId = emoji.getAttribute("data-id");

            // Resaltar el emoji seleccionado
            emojis.forEach((e) => e.classList.remove("selected")); // Quitar selección de otros emojis
            emoji.classList.add("selected");
        });
    });

    // Manejar el clic en el botón "Guardar"
    const guardarBtn = document.getElementById("GuardarBtn");
    guardarBtn.addEventListener("click", () => {
        if (selectedEmojiId) {
            // Crear un objeto con la satisfacción
            const satisfaccionData = {
                "satisfaccion": selectedEmojiId,
            };

            // Crear una solicitud AJAX
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "api/POST/Nivel_Satifaccion.php", true);
            xhr.setRequestHeader("Content-Type", "application/json"); // Enviar como JSON

            // Manejar la respuesta del servidor
            xhr.onload = function () {
                if (xhr.status === 200) {
                    alert("Respuesta del servidor: " + xhr.responseText);
                } else {
                    alert("Error al guardar: " + xhr.status);
                }
            };
            console.log(satisfaccionData);

            // Enviar el objeto como JSON
            xhr.send(JSON.stringify(satisfaccionData));
        } else {
            alert("Por favor, selecciona un emoji antes de guardar.");
        }
    });
});
