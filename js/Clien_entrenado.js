document.addEventListener("DOMContentLoaded", function () {
    // Ruta del archivo PHP
    const url = 'api/GET/obtener_cliente.php'; // Cambia esto si el archivo PHP está en una subcarpeta

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
            clientesContainer.innerHTML = ''; // Limpiar el contenedor para evitar duplicados

            // Verificar si se devuelve un mensaje en lugar de datos
            if (!data.success || !data.data) {
                clientesContainer.innerHTML = `<p>${data.message || 'No se encontraron registros.'}</p>`;
                return;
            }

            // Recorrer los datos y mostrarlos en el contenedor
            data.data.forEach(cliente => {
                const clienteHTML = `
                    <div class="tablita">
                        <div class="cliente-info">
                            <div class="nombre-cliente">
                                <h2>${cliente.identificacion}</h2>
                                <p><strong>Nombre:</strong> ${cliente.nombre}</p>
                            </div>
                            <div class="info-item">
                                <p><strong>Peso:</strong> ${cliente.peso} kg</p>
                                <p><strong>Medida de Muñeca:</strong> ${cliente.medidaMuneca}</p>
                                <p><strong>Días de Entreno:</strong> ${cliente.diasEntreno}</p>
                                <p><strong>Altura:</strong> ${cliente.altura} cm</p>
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
