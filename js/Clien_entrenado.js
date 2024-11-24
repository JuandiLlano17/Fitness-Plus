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

    // Ruta del archivo PHP
    const url = 'api/GET/obtener_cliente.php';

    // Realizar la solicitud a obtener_cliente.php
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const clientesContainer = document.getElementById('clientes-container');
            clientesContainer.innerHTML = '';

            // Manejar caso de error en los datos
            if (!data.success || !data.data) {
                clientesContainer.innerHTML = `<p>${data.message || 'No se encontraron registros.'}</p>`;
                return;
            }

            // Filtrar los clientes con rol "cliente"
            const clientes = data.data.filter(cliente => cliente.rol && cliente.rol.toLowerCase() === "cliente");

            if (clientes.length === 0) {
                clientesContainer.innerHTML = `<p>No hay clientes para mostrar.</p>`;
                return;
            }

            // Crear el HTML para cada cliente
            clientes.forEach((cliente, index) => {
                console.log(`Cliente ${index}:`, cliente); // Depuración: revisar datos del cliente
                const tipologia = determinarTipologia(cliente.medidaMuneca);

                const clienteHTML = `
                    <div class="tablita">
                        <div class="cliente-info">
                            <div class="foto-perfil">
                                <img src="${cliente.fotoPerfil ? `data:image/jpeg;base64,${cliente.fotoPerfil}` : 'default-avatar.png'}" 
                                    alt="Foto de ${cliente.nombre}" class="perfil-img">
                            </div>
                            <div class="nombre-cliente">
                                <h2>${cliente.nombre}, ${cliente.edad || 'N/A'}</h2>
                            </div>
                            <div class="info-item">
                                <p><strong>Peso:</strong> ${cliente.peso} kg</p>
                                <p><strong>Tipo de cuerpo:</strong> ${tipologia}</p>
                                <p><strong>Días de Entreno:</strong> ${cliente.diasEntreno}</p>
                                <p><strong>Altura:</strong> ${cliente.altura} cm</p>
                            </div>
                            <div class="button-group1">
                                <button class="button editar-btn" data-identificacion="${cliente.identificacion}">Editar</button>
                                <span class="emoji">${cliente.emoji || '😊'}</span>
                            </div>
                        </div>
                    </div>
                `;
                clientesContainer.innerHTML += clienteHTML;
            });

            // Añadir eventos a los botones de editar
            document.querySelectorAll('.editar-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const clienteId = e.target.getAttribute('data-identificacion'); // Obtener el ID del cliente
                    if (clienteId) {
                        console.log("ID Cliente:", clienteId);
                        window.location.href = `editar_entrenador.html?id=${clienteId}`;
                    } else {
                        console.error('ID del cliente no encontrado para este botón.');
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
            document.getElementById('clientes-container').innerHTML = '<p>Error al cargar los datos de los clientes.</p>';
        });
});
