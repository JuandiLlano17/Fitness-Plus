document.addEventListener("DOMContentLoaded", function () {
  function determinarTipologia(medidaMuneca) {
      if (medidaMuneca === "menos-17") {
          return "Ectomorfo";
      } else if (medidaMuneca === "17-20") {
          return "Mesomorfo";
      } else if (medidaMuneca === "mas-20") {
          return "Endomorfo";
      } else {
          return "Desconocido";
      }
  }

  function determinarEmoji(satisfaccion) {
      switch (satisfaccion) {
          case 1:
              return "img/ENOJO.svg";
          case 2:
              return "img/TRISTEZA.svg";
          case 3:
              return "img/SERIO.svg";
          case 4:
              return "img/FELIZ.svg";
          case 5:
              return "img/CONTENTO.svg";
          default:
              return "Desconocido";
      }
  }

  const url = "api/GET/obtener_cliente.php";

  fetch(url)
      .then(response => {
          console.log("Estado de la respuesta:", response.status); // Muestra el estado HTTP
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          console.log("Datos recibidos del servidor:", data); // Muestra los datos completos recibidos

          const clientesContainer = document.getElementById("clientes-container");
          let htmlContent = "";

          if (!data.success || !data.data) {
              clientesContainer.innerHTML = `<p>${data.message || "No se encontraron registros."}</p>`;
              console.log("Datos no válidos:", data); // Mostrar en caso de datos inválidos
              return;
          }

          const clientes = data.data.filter(
              cliente => cliente.rol && cliente.rol.toLowerCase() === "cliente"
          );

          console.log("Clientes filtrados:", clientes); // Muestra los clientes filtrados

          if (clientes.length === 0) {
              clientesContainer.innerHTML = `<p>No hay clientes para mostrar.</p>`;
              return;
          }

          clientes.forEach(cliente => {
              console.log("Procesando cliente:", cliente); // Muestra cada cliente antes de renderizar

              const tipologia = determinarTipologia(cliente.medidaMuneca);
              const emoji = determinarEmoji(cliente.Nivel);

              htmlContent += `
                  <div class="tablita">
                      <div class="cliente-info">
                          <div class="foto-perfil">
                              <img src="${cliente.fotoPerfil ? `data:image/jpeg;base64,${cliente.fotoPerfil}` : "default-avatar.png"}" 
                                  alt="Foto de ${cliente.nombre}" class="perfil-img">
                          </div>
                          <div class="nombre-cliente">
                              <h2>${cliente.nombre}, ${cliente.edad || "N/A"}</h2>
                          </div>
                          <div class="info-item">
                              <p><strong>Peso:</strong> ${cliente.peso} kg</p>
                              <p><strong>Tipo de cuerpo:</strong> ${tipologia}</p>
                              <p><strong>Días de Entreno:</strong> ${cliente.diasEntreno}</p>
                              <p><strong>Altura:</strong> ${cliente.altura} cm</p>
                          </div>
                          <div class="button-group1">
                              <button class="button editar-btn" data-id="${cliente.id}">Editar</button>
                              <span class="emoji">${emoji}</span>
                          </div>
                      </div>
                  </div>`;
          });

          clientesContainer.innerHTML = htmlContent;

          document.querySelectorAll(".editar-btn").forEach(button => {
              button.addEventListener("click", () => {
                  const clienteId = button.getAttribute("data-id");
                  console.log("Editar cliente con ID:", clienteId); // Muestra el ID del cliente a editar
                  window.location.href = `editar_entrenador.html?id=${clienteId}`;
              });
          });
      })
      .catch(error => {
          console.error("Error al cargar los datos:", error); // Muestra cualquier error en la consola
          document.getElementById("clientes-container").innerHTML = "<p>Error al cargar los datos de los clientes.</p>";
      });
});
