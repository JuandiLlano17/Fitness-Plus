document.addEventListener("DOMContentLoaded", function () {
    // Función para determinar la tipología corporal
    function determinarTipologia(medidaMuñeca) {
        if (medidaMuñeca === "menos-17") {
            return "Ectomorfo";
        } else if (medidaMuñeca === "17-20") {
            return "Mesomorfo";
        } else if (medidaMuñeca === "mas-20") {
            return "Endomorfo";
        } else {
            return "Desconocido";
        }
    }

    // Ruta del archivo PHP
    const url = 'api/GET/obtener_cliente.php'; // Cambia esto si el archivo PHP está en una subcarpeta

    // Realizar la solicitud a obtener_cliente.php
    fetch(url)
        .then(response => {
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
                // Determinar la tipología corporal según la medida de la muñeca
                const tipologia = determinarTipologia(cliente.medidaMuneca);

                const clienteHTML = `
                    <div class="tablita">
                        <div class="cliente-info">
                            <!-- Foto de perfil -->
                            <div class="foto-perfil">
                                <img src="${cliente.fotoPerfil ? `data:image/jpeg;base64,${cliente.fotoPerfil}` : 'default-avatar.png'}" 
                                    alt="Foto de ${cliente.nombre}" class="perfil-img">
                            </div>
                            <!-- Información del cliente -->
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
                                <button class="button">Editar</button>
                                <span class="emoji">${cliente.emoji || '😊'}</span>
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
