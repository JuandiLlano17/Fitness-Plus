document.addEventListener("DOMContentLoaded", function () {
    let segundos = 60;
    let intervalo;
  
    // Función para iniciar la cuenta regresiva
    function iniciarCuentaRegresiva() {
        clearInterval(intervalo);
        segundos = 60;
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
  
    // Función para obtener el día actual desde WorldTimeAPI usando un proxy PHP
    function getDayFromAPI(callback) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "api/GET/proxy.php", true);
  
        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    const dayOfWeek = data.day_of_week;
  
                    const daysInSpanish = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
                    const dayName = daysInSpanish[dayOfWeek];
  
                    console.log(`Día obtenido desde WorldTimeAPI: ${dayName}`);
                    callback(null, dayName);
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
  
    // Función para cargar la rutina del día actual
    function loadRoutine() {
        const routineContainer = document.querySelector(".routine-header");
        const tituloContainer = document.querySelector(".Titulo");
        const tituloDia = tituloContainer.querySelector("h1");
        const tituloDuracion = tituloContainer.querySelector("h2");
  
  
        getDayFromAPI((error, diaActual) => {
            if (error) {
                console.error("Error al obtener el día actual:", error);
                routineContainer.innerHTML = `<p>Error al obtener el día actual: ${error}</p>`;
                return;
            }
  
            console.log("Día actual obtenido:", diaActual);
  
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `api/GET/rutina.php?dia=${encodeURIComponent(diaActual)}`, true);
  
            xhr.onload = function () {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
  
                        if (!data.success) {
                            throw new Error(data.message || "No se encontraron rutinas disponibles para hoy");
                        }
  
                        const rutina = data.rutinas[0];
                        tituloDia.textContent = rutina.dia || "Sin día";
                        tituloDuracion.textContent = `Duración de la rutina: ${rutina.tiempo_rutina || "Sin duración"}`;
  
                        const exerciseContainer = document.getElementById("exercise");
                        exerciseContainer.innerHTML = "";
  
                        rutina.ejercicios.forEach(ejercicio => {
                            const videoPath = `Video/${ejercicio.nombre_ejercicio.replace(/ /g, '%20')}.mov`;
  
                            const exerciseHTML = `
                                <div class="exercise">
                                    <div class="video-container">
                                        <video controls>
                                            <source src="${videoPath}" type="video/mp4" />
                                            Tu navegador no soporta el elemento de video.
                                        </video>
                                    </div>
                                    <article class="exercise-details">
                                        <h2>${ejercicio.musculo}</h2>
                                        <h1>${ejercicio.nombre_ejercicio}</h1>
                                        <ul class="exercise-tips">
                                            <li>${ejercicio.detalle1 || ''}</li>
                                            <li>${ejercicio.detalle2 || ''}</li>
                                            <li>${ejercicio.detalle3 || ''}</li>
                                        </ul>
                                        <div class="exercise-actions">
                                         <button class="button button-cronometro">Cronómetro</button>
                                             <button 
                                                class="button button-change-exercise" 
                                                data-id_rutina="${rutina.id_rutina}" 
                                                data-id_ejercicio="${ejercicio.id_ejercicio}" 
                                                data-reemplazo="${ejercicio.reemplazo}">
                                              Cambiar Ejercicio
                                              </button>
                                        </div>
                                    </article>
                                </div>
                            `;
                            exerciseContainer.innerHTML += exerciseHTML;
                        });
  
                        // Añadir eventos a los botones de cambiar ejercicio
                        document.querySelectorAll(".button-change-exercise").forEach(button => {
                            button.addEventListener("click", function () {
                                const reemplazoId = this.getAttribute("data-reemplazo");
                                const rutinaId = this.getAttribute("data-id_rutina");
                                const ejercicioActualId = this.getAttribute("data-id_ejercicio");
                                  if (reemplazoId) {
                                    alert(`Ejercicio de reemplazo: ${reemplazoId},${rutinaId},${ejercicioActualId} `);
                                      loadReplacementExercise(reemplazoId, rutinaId, ejercicioActualId);
                                  } else {
                                      alert("No hay ejercicio de reemplazo disponible.");
                                  }
                            });
                        });
                    } catch (error) {
                        routineContainer.innerHTML = `<p>Error al cargar las rutinas: ${error.message}</p>`;
                    }
                } else {
                    routineContainer.innerHTML = `<p>Error al cargar las rutinas: ${xhr.statusText}</p>`;
                }
            };
  
            xhr.onerror = function () {
                routineContainer.innerHTML = `<p>Error de red al cargar las rutinas.</p>`;
            };
  
            xhr.send();
        });
    }
    function loadReplacementExercise(reemplazoId, rutinaId, ejercicioActualId) {
      fetch('api/POST/reemplazar_ejercicio.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              id_rutina: rutinaId,
              id_ejercicio_actual: ejercicioActualId,
              id_ejercicio_reemplazo: reemplazoId
          })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert("Ejercicio reemplazado correctamente.");
              loadRoutine(); // Recargar rutinas para reflejar el cambio
          } else {
              alert("Error al reemplazar el ejercicio: " + data.message);
          }
      })
      .catch(error => console.error("Error al reemplazar el ejercicio:", error));
  }
  
    // Inicia la carga de las rutinas al cargar el DOM
    loadRoutine();
  
    // Evento para manejar las acciones de "Finalizado" y "Salir"
    document.getElementById("boton-finalizado").addEventListener("click", function () {
        document.getElementById("modalSatisfaccion").style.display = "block";
    });
  
  // Escucha el evento submit del formulario
  document.getElementById("form-salir").addEventListener("submit", function (event) {
      event.preventDefault(); // Prevenir el envío predeterminado del formulario
      // Redirigir al archivo logout.php
      window.location.href = "api/POST/logout.php";
  });
  
  });
  