$(document).ready(function () {
    // Realizar la llamada AJAX para obtener los datos de los clientes desde el servidor
    $.ajax({
        url: 'api/GET/obtener_cliente.php',  // La URL de tu servidor
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data); // Mostrar los datos en la consola

            // Recorrer los datos de los clientes y crear los elementos HTML para cada uno
            data.forEach(function(cliente, index) {
                const tipoCuerpo = determinarTipologia(cliente.Medida_Muneca); // Usamos la función para determinar la tipología corporal
                
                // Crear la estructura HTML para cada cliente
                const clienteHTML = `
                    <div class="parte1">
                        <div class="tablita">
                            <div class="img-cliente">
                                <img id="imagen-perfil-${index + 1}" class="img-cel" src="data:image/jpeg;base64,${cliente.Foto_perfil}" alt="Imagen del Cliente">
                            </div>
                            <div class="cliente-info">
                                <div class="nombre-cliente">
                                    <h2>${cliente.Nombre}, ${cliente.Edad}</h2>
                                </div>
                                <div class="info-item">
                                    <p>Tipo: <span class="tipo-cuerpo-cliente">${tipoCuerpo}</span></p>
                                </div>
                                <div class="info-item">
                                    <p>Días: <span class="dias-entreno">${cliente.Dias_entreno}</span></p>
                                </div>
                                <div class="button-group1">
                                    <div class="button-text">
                                        <a href="editar_entrenador.html">
                                            <button class="button">Editar</button>
                                        </a>
                                    </div>
                                    <div class="cara">
                                        <figure>
                                            <img src="img/Contento1.svg" alt="Cara del Entrenador" />
                                        </figure>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Agregar el HTML del cliente al contenedor principal
                $('#clientes-container').append(clienteHTML);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al cargar los datos: ', error);
        }
    });
});

// Función para determinar la tipología corporal
function determinarTipologia(medidaMuneca) {
    if (medidaMuneca < 17) {
        return "Ectomorfo";
    } else if (medidaMuneca >= 17 && medidaMuneca <= 20) {
        return "Mesomorfo";
    } else {
        return "Endomorfo";
    }
}
