document.addEventListener("DOMContentLoaded", function () {
    // Ruta del archivo PHP
    const url = 'api/GET/obtener_cliente.php'; // Cambia esto si el archivo PHP está en una subcarpeta
//actua
    // Realizar la solicitud a obtener_cliente.php
    fetch(url)
        .then(response => {
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Convertir la respuesta a JSON
        })
        .then(data => {
            const clientesContainer = document.getElementById('clientes-container');

            // Verificar si se devuelve un mensaje en lugar de datos
            if (data.message) {
                clientesContainer.innerHTML = `<p>${data.message}</p>`;
                return;
            }

            // Recorrer los datos y mostrarlos en el contenedor
            data.forEach(cliente => {
                const clienteHTML = `
                    <div class="tablita">
                        <div class="cliente-info">
                            <div class="nombre-cliente">
                                <h2>${cliente.Identificacion}</h2>
                            </div>
                            <div class="info-item">
                                <p><strong>Peso:</strong> ${cliente.Peso} kg</p>
                                <p><strong>Medida de Muñeca:</strong> ${cliente.Medida_Muneca}</p>
                                <p><strong>Días de Entreno:</strong> ${cliente.Dias_entreno}</p>
                                <p><strong>Altura:</strong> ${cliente.Altura} cm</p>
                            </div>
                            <div class="button-group1">
                                <button class="button">Editar</button>
                            </div>
                        </div>
                    </div>
                `;
                clientesContainer.innerHTML += clienteHTML;
            });
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
            document.getElementById('clientes-container').innerHTML = '<p>Error al cargar los datos de los clientes.</p>';
        });
});
