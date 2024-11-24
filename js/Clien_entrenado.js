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
    function obtenerImagenPorNivel(nivel) {
        const nivelInt = parseInt(nivel, 10); // Intenta convertir nivel a un número
        if (isNaN(nivelInt)) {
            // Si no es un número, usa una imagen predeterminada
            return "img/X Icon (1).svg";
        }
    
        // Devuelve la imagen correspondiente al nivel numérico
        switch (nivelInt) {
            case 1:
                return "img/Enojo1.svg";
            case 2:
                return "img/Tristeza1.svg";
            case 3:
                return "img/Serio1.svg";
            case 4:
                return "img/Feliz1.svg";
            case 5:
                return "img/Contento1.svg";
            default:
                return "img/X Icon (1).svg"; // Imagen predeterminada si el nivel no es válido
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
                const imagenNivel = obtenerImagenPorNivel(cliente.nivel);
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
                             <div class="imagen-nivel">
                            <img src="${imagenNivel}" alt="Nivel ${cliente.nivel}" class="nivel-img">
                        </div>
                            
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
