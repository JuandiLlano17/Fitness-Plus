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
      xhr.open("GET", "api/GET/proxy.php", true); // Cambia "proxy.php" a la URL de tu proxy PHP

      xhr.onload = function () {
          if (xhr.status === 200) {
              try {
                  const data = JSON.parse(xhr.responseText);

                  // Obtener el número del día de la semana (0 = Domingo, 1 = Lunes, ...)
                  const dayOfWeek = data.day_of_week;

                  // Mapear el número al día en español
                  const daysInSpanish = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
                  const dayName = daysInSpanish[dayOfWeek];

                  console.log(`Día obtenido desde WorldTimeAPI: ${dayName}`);
                  callback(null, dayName); // Llama al callback con el día
              } catch (error) {
                  console.error("Error al procesar la respuesta de WorldTimeAPI:", error);
                  callback(error, null); // Error al procesar
              }
          } else {
              console.error("Error al obtener datos de WorldTimeAPI:", xhr.statusText);
              callback(xhr.statusText, null); // Error de red
          }
      };

      xhr.onerror = function () {
          console.error("Error de red al intentar conectarse al servidor intermedio");
          callback("Error de red", null); // Error de red
      };

      xhr.send();
  }

  // Función para cargar la rutina del día actual
  function loadRoutine() {
      const routineContainer = document.querySelector(".routine-header");
      const tituloContainer = document.querySelector(".Titulo");
      const tituloDia = tituloContainer.querySelector("h1");
      const tituloDuracion = tituloContainer.querySelector("h2");

      // ID del cliente
      const idCliente = 1234567;

      // Obtener el día actual desde WorldTimeAPI usando AJAX
      getDayFromAPI((error, diaActual) => {
          if (error) {
              console.error("Error al obtener el día actual:", error);
              routineContainer.innerHTML = `<p>Error al obtener el día actual: ${error}</p>`;
              return;
          }

          console.log("Día actual obtenido:", diaActual);

          const xhr = new XMLHttpRequest();
          xhr.open("GET", `api/GET/rutina.php?id_cliente=${idCliente}&dia=${encodeURIComponent(diaActual)}`, true);

          xhr.onload = function () {
              if (xhr.status === 200) {
                  try {
                      const data = JSON.parse(xhr.responseText);

                      if (!data.success) {
                          throw new Error(data.message || "No se encontraron rutinas disponibles para hoy");
                      }

                      const rutina = data.rutinas[0]; // Supongamos una rutina por día
                      tituloDia.textContent = rutina.dia || "Sin día";
                      tituloDuracion.textContent = `Duración de la rutina: ${rutina.tiempo_rutina || "Sin duración"}`;

                      const exerciseContainer = document.getElementById("exercise");
                      exerciseContainer.innerHTML = ""; // Limpia ejercicios anteriores

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
                                          <button class="button button-change-exercise">Cambiar Ejercicio</button>
                                      </div>
                                  </article>
                              </div>
                          `;
                          exerciseContainer.innerHTML += exerciseHTML;
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

  // Inicia la carga de las rutinas al cargar el DOM
  loadRoutine();

  // Evento para manejar las acciones de "Finalizado" y "Salir"
  document.getElementById("boton-finalizado").addEventListener("click", function () {
      document.getElementById("modalSatisfaccion").style.display = "block";
  });

  document.getElementById("boton-salir").addEventListener("click", function () {
      window.location.href = "index.html";
  });
});
