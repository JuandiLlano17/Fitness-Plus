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

    const url = 'api/GET/obtener_cliente.php';

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

            if (!data.success || !data.data) {
                clientesContainer.innerHTML = `<p>${data.message || 'No se encontraron registros.'}</p>`;
                return;
            }

            const clientes = data.data.filter(cliente => cliente.rol && cliente.rol.toLowerCase() === "cliente");

            if (clientes.length === 0) {
                clientesContainer.innerHTML = `<p>No hay clientes para mostrar.</p>`;
                return;
            }

            clientes.forEach(cliente => {
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
                                <button class="button editar-btn">Editar</button>
                                <span class="emoji">${cliente.emoji || '😊'}</span>
                            </div>
                        </div>
                    </div>
                `;
                clientesContainer.innerHTML += clienteHTML;
            });

            // Añadir evento de clic al botón de editar
            document.querySelectorAll('.editar-btn').forEach(button => {
                button.addEventListener('click', () => {
                    window.location.href = 'editar_entrenador.html';
                });
            });
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
            document.getElementById('clientes-container').innerHTML = '<p>Error al cargar los datos de los clientes.</p>';
        });
});
