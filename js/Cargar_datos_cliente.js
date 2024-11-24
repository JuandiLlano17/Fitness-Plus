// Obtener el id del cliente desde la URL
const urlParams = new URLSearchParams(window.location.search);
const clienteId = urlParams.get('id');  // Obtenemos el id del cliente desde la URL

// Verificar si se ha proporcionado el ID del cliente
if (!clienteId) {
    console.error("No se ha proporcionado el ID del cliente.");
} else {
    console.log("ID Cliente:", clienteId);

    // Obtener los datos del cliente a través de la API
    document.addEventListener('DOMContentLoaded', function () {
        const url = `api/GET/obtener_cliente_por_id.php?id=${clienteId}`;  // Ajusta la URL según tu API

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.data) {
                    const cliente = data.data[0];  // Asumimos que el cliente se encuentra en el primer índice
                    const diasEntreno = cliente.diasEntreno.split(',');  // Asumiendo que los días están separados por coma

                    console.log("Días de entrenamiento del cliente:", diasEntreno);

                    // Mostrar los días de entrenamiento del cliente
                    const diasContainer = document.querySelector('.dias-container');
                    const dias = diasContainer.querySelectorAll('.dia');  // Seleccionamos todos los días disponibles

                    dias.forEach(dia => {
                        // Si el cliente entrena en este día, añadir clase "activo" y quitar "gris"
                        if (diasEntreno.includes(dia.textContent.trim())) {
                            dia.classList.add('activo');  // Lo resalta
                            dia.classList.remove('gris'); // Elimina la clase gris
                        } else {
                            dia.classList.add('gris');   // Lo pone en gris
                            dia.classList.remove('activo'); // Elimina la clase activo
                        }

                        // Agregar un listener para que el entrenador pueda seleccionar los días
                        dia.addEventListener('click', function () {
                            // Si el día está en gris, lo activa, si está activo, lo desactiva
                            if (dia.classList.contains('gris')) {
                                dia.classList.remove('gris');
                                dia.classList.add('activo');
                                // Aquí puedes agregar lógica para actualizar los días en el servidor si es necesario
                            } else {
                                dia.classList.remove('activo');
                                dia.classList.add('gris');
                                // Aquí puedes agregar lógica para actualizar los días en el servidor si es necesario
                            }
                        });
                    });

                    // Llenar el resto de los datos del cliente en la página
                    document.querySelector('#nombre-cliente').textContent = cliente.nombre;
                    document.querySelector('#peso-cliente').textContent = cliente.peso + " kg";
                    document.querySelector('#altura-cliente').textContent = cliente.altura + " cm";
                    document.querySelector('#edad-cliente').textContent = cliente.edad || 'N/A';

                } else {
                    console.error("No se encontró el cliente o hubo un error.");
                }
            })
            .catch(error => {
                console.error('Error al obtener los datos del cliente:', error);
            });
    });
}
