document.addEventListener("DOMContentLoaded", function () {
  let segundos = 60;
  let intervalo;
  let ejercicioAnterior = ""; // Variable global para almacenar el ejercicio anterior

  // Función para iniciar la cuenta regresiva
  function iniciarCuentaRegresiva() {
    segundos = 60;
    clearInterval(intervalo);
    intervalo = setInterval(() => {
      if (segundos > 0) {
        segundos--;
        document.getElementById("segundos").textContent = segundos.toString().padStart(2, "0");
      } else {
        clearInterval(intervalo);
      }
    }, 1000);
  }

  // Función para reiniciar la cuenta regresiva
  function reiniciarCuentaRegresiva() {
    clearInterval(intervalo);
    segundos = 60;
    document.getElementById("segundos").textContent = "60";
    iniciarCuentaRegresiva();
  }

  // Evento para abrir el cronómetro
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("button-cronometro")) {
      document.getElementById("modalCronometro").style.display = "block";
      iniciarCuentaRegresiva();
    }
  });

  // Botón de regresar (cierra el cronómetro)
  document.getElementById("boton-regresar").addEventListener("click", function () {
    document.getElementById("modalCronometro").style.display = "none";
    clearInterval(intervalo);
  });

  // Botón de reiniciar la cuenta regresiva
  document.getElementById("boton-reiniciar").addEventListener("click", reiniciarCuentaRegresiva);

  // Cargar rutina y ejercicios asociados
  function loadRoutine() {
    const routineHeader = document.querySelector("#exercise-container");
    const tituloContainer = document.querySelector(".Titulo");
    const tituloDia = tituloContainer.querySelector("h1");
    const tituloDuracion = tituloContainer.querySelector("h2");

    // ID del cliente
    const idCliente =1234;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `api/GET/rutina.php?id_cliente=${idCliente}`, true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);

          console.log("Datos recibidos:", data);

          if (!data.success) {
            throw new Error(data.message || "No se encontraron rutinas disponibles");
          }

          const diaRutina = data.rutinas[0]?.dia || "Sin día";
          const duracionRutina = data.rutinas[0]?.tiempo_rutina || "Sin duración";

          tituloDia.textContent = diaRutina;
          tituloDuracion.textContent = `Duración de la rutina ${duracionRutina}`;

          routineHeader.innerHTML = ""; // Limpia el contenedor

          data.rutinas.forEach((rutina) => {
            const videoPath = `Video/${rutina.nombre_ejercicio.replace(/ /g, "_")}.mp4`;

            const section = `
              <section class="exercise">
                <div class="video-container">
                  <video controls>
                    <source src="${videoPath}" type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
                <article class="exercise-details">
                  <h2>${rutina.musculo}</h2>
                  <h1>${rutina.nombre_ejercicio}</h1>
                  <ul class="exercise-tips">
                    <li>${rutina.detalle1}</li>
                    <li>${rutina.detalle2}</li>
                    <li>${rutina.detalle3}</li>
                  </ul>
                  <div class="exercise-actions">
                    <button class="button button-cronometro">Cronómetro</button>
                    <button class="button button-change-exercise">Cambiar Ejercicio</button>
                  </div>
                </article>
              </section>
            `;
            routineHeader.innerHTML += section;
          });
        } catch (error) {
          console.error("Error al procesar los datos:", error);
          routineHeader.innerHTML = `<p>Error al cargar las rutinas: ${error.message}</p>`;
        }
      } else {
        console.error("Error al obtener los datos:", xhr.statusText);
        routineHeader.innerHTML = `<p>Error al cargar las rutinas: ${xhr.statusText}</p>`;
      }
    };

    xhr.onerror = function () {
      console.error("Error de red al intentar obtener las rutinas.");
      routineHeader.innerHTML = `<p>Error de red al cargar las rutinas.</p>`;
    };

    xhr.send();
  }

  loadRoutine();

  // Evento para cambiar ejercicio
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("button-change-exercise")) {
      const exerciseElement = document.querySelector(".exercise1");
      if (ejercicioAnterior !== "") {
        exerciseElement.innerHTML = ejercicioAnterior;
        ejercicioAnterior = "";
      } else {
        ejercicioAnterior = exerciseElement.innerHTML;

        exerciseElement.innerHTML = `
          <div class="video-container">
            <video controls>
                <source src="Video\PressMaquina.MOV" type="video/mp4">
                Tu navegador no soporta el elemento de video.
            </video>
          </div>
          <article class="exercise-details">
            <h2>Pectoral</h2>
            <h1>Press en máquina</h1>
            <ul class="exercise-tips">
              <li>Toma un peso que puedas cargar sin mucho problema</li>
              <li>Mantén la barra estable en tu espalda</li>
              <li>Mantén la espalda recta</li>
              <li>Baja de forma controlada hasta los 90 grados</li>
            </ul>
            <div class="exercise-actions">
              <button class="button button-cronometro">Cronómetro</button>
              <button class="button button-change-exercise">Cambiar Ejercicio</button>
            </div>
          </article>
        `;
      }
    }
  });

  document.getElementById("boton-finalizado").addEventListener("click", function () {
    document.getElementById("modalSatisfaccion").style.display = "block";
  });

  document.getElementById("boton-salir").addEventListener("click", function () {
    window.location.href = "index.html";
  });
});
