// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    // Obtener el ID del cliente y los días desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('id');
    const dias = urlParams.get('dias'); // Obtener los días codificados desde la URL

    // Mostrar los datos en consola para depuración
    console.log("ID Cliente:", clienteId);
    console.log("Días:", dias);

    // Verificar si se obtuvieron los días correctamente
    if (dias) {
        const diasArray = dias.split(','); // Dividir la cadena de días en un arreglo
        console.log("Días como array:", diasArray);

        // Filtrar días válidos (opcional: si hay días predeterminados)
        const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sábado', 'domingo'];
        const diasFiltrados = diasArray.filter(dia => diasValidos.includes(dia.toLowerCase()));

        // Renderizar los días en el contenedor
        const diasContainer = document.getElementById('dias-container'); // Usar el ID correcto
        if (diasContainer) {
            diasContainer.innerHTML = ''; // Limpiar contenido previo

            // Crear elementos para cada día filtrado
            diasFiltrados.forEach(dia => {
                const diaElement = document.createElement('div');
                diaElement.className = 'dia-item'; // Clase CSS para estilizar los días
                diaElement.textContent = dia.charAt(0).toUpperCase() + dia.slice(1); // Capitalizar el nombre del día
                diasContainer.appendChild(diaElement); // Añadir al contenedor

                // Agregar un evento de click a cada día para marcarlo como seleccionado
                diaElement.addEventListener('click', () => {
                    // Si el día ya está seleccionado, no hacer nada
                    if (diaElement.classList.contains('selected')) {
                        return;
                    }

                    // Limpiar selección de cualquier otro día
                    document.querySelectorAll('.dia-item').forEach(item => {
                        item.classList.remove('selected');
                        item.style.backgroundColor = ''; // Restaurar el color de fondo
                    });

                    // Marcar el día como seleccionado
                    diaElement.classList.add('selected');
                    diaElement.style.backgroundColor = '#FCD23B';

                    // Almacenar el día seleccionado en el localStorage o variable
                    localStorage.setItem('diaSeleccionado', dia); // Usando localStorage para persistir la selección
                });
            });
        } else {
            console.error("No se encontró el contenedor de días (dias-container).");
        }

        // Verificar si hay un día previamente seleccionado en el localStorage
        const diaSeleccionado = localStorage.getItem('diaSeleccionado');
        if (diaSeleccionado) {
            const diaElements = document.querySelectorAll('.dia-item');
            diaElements.forEach(diaElement => {
                if (diaElement.textContent.toLowerCase() === diaSeleccionado.toLowerCase()) {
                    diaElement.classList.add('selected');
                }
            });
        }

    } else {
        console.error("No se encontraron días en la URL.");
    }
});
