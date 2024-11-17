    // Función para actualizar los ejercicios basados en el músculo seleccionado
function actualizarEjercicios() {
    // Obtener el valor del músculo seleccionado
    let musculo = document.querySelector('input[name="musculo"]:checked').value;

    fetch('api/POST/editar_entrenador.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'musculo=' + musculo
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            let ejercicios = data.data;

            let container = document.querySelector('.exercise-container .radio-options .exercise-list');
            container.innerHTML = '';  // Limpiar los ejercicios previos

            // Iterar sobre cada ejercicio y agregar el evento `click` solo una vez
            ejercicios.forEach(ejercicio => {
                let radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = 'agregar';
                radioInput.value = ejercicio;
                radioInput.id = ejercicio.toLowerCase().replace(/ /g, '-');

                let label = document.createElement('label');
                label.htmlFor = radioInput.id;
                label.classList.add('custom-radio');
                label.textContent = ejercicio;

                // Agregar el input y el label al contenedor
                container.appendChild(radioInput);
                container.appendChild(label);
                container.appendChild(document.createElement('br'));

                // Agregar el evento `click` para cada ejercicio de forma controlada
                label.addEventListener('click', function() {
                    agregarEjercicioAlContenedor(ejercicio);
                });
            });
            
            // Hacer visible el contenedor de ejercicios cuando se haga clic en el "+" (summary)
            let details = container.closest('details');
            details.addEventListener('toggle', function() {
                container.style.display = details.open ? 'block' : 'none';
            });
        }
    })
    .catch(error => console.error('Error en la solicitud:', error));
}

// Función para agregar el div rojo con la imagen de fondo al lado izquierdo del botón "+"
function agregarEjercicioAlContenedor(ejercicio) {
    // Crear el div que representará el ejercicio seleccionado
    const ejercicioDiv = document.createElement('div');
    ejercicioDiv.classList.add('previsualizacion');  // Se agregará la clase para estilos generales desde el CSS

    // Crear un contenedor para la imagen de fondo
    const imagenDiv = document.createElement('div');
    imagenDiv.classList.add('imagen-fondo');  // Usaremos esta clase para los estilos de la imagen

    // Establecer el fondo del ejercicio con la imagen correspondiente
    const imagenFondo = `img/ejercicios/${ejercicio.replace(/ /g, '%20')}.png`;
    imagenDiv.style.backgroundImage = `url(${imagenFondo})`;
    imagenDiv.style.width = '100%';  // Ocupa el 100% del ancho del contenedor principal
    imagenDiv.style.height = '100%'; // Ocupa el 100% del alto del contenedor principal
    imagenDiv.style.backgroundSize = 'cover';
    imagenDiv.style.backgroundPosition = 'center';
    imagenDiv.style.filter = 'blur(3px)'; // Aplica el desenfoque
    imagenDiv.style.position = 'absolute'; // Para que la imagen esté por debajo de otros elementos

    // Añadir el contenedor de la imagen de fondo dentro del div principal
    ejercicioDiv.appendChild(imagenDiv);

    // Crear el título (h3) con el nombre del ejercicio
    const h3 = document.createElement('h3');
    h3.textContent = ejercicio;  // Asigna el nombre del ejercicio
    // Los estilos del h3 ya están en el archivo CSS bajo .previsualizacion h3

    // Agregar el h3 dentro del div de previsualización
    ejercicioDiv.appendChild(h3);

    // Obtener el contenedor donde agregar el div
    const exerciseContainer = document.querySelector('.exercise-container');
    const radioOptions = exerciseContainer.querySelector('.radio-options');
    
    // Insertar el nuevo div de previsualización a la izquierda del contenedor de opciones de radio
    exerciseContainer.insertBefore(ejercicioDiv, radioOptions);
    console.log("Div insertado en el contenedor:", ejercicioDiv);
}

// Asignar el evento a los inputs de músculo para que actualice los ejercicios disponibles
document.querySelectorAll('input[name="musculo"]').forEach(input => {
    input.addEventListener('change', actualizarEjercicios);
});