// Función para actualizar los ejercicios basados en el músculo seleccionado
function actualizarEjercicios() {
    // Obtener el valor del músculo seleccionado
    let musculo = document.querySelector('input[name="musculo"]:checked').value;

    // Leer el archivo JSON local
    fetch('pagina.json')
        .then(response => response.json())
        .then(data => {
            // Obtener los ejercicios del músculo seleccionado
            let ejercicios = data[musculo] || [];

            let container = document.querySelector('.exercise-container .radio-options .exercise-list');
            container.innerHTML = ''; // Limpiar los ejercicios previos

            // Iterar sobre cada ejercicio y crear elementos dinámicamente
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

                // Agregar el evento `click` para cada ejercicio
                label.addEventListener('click', function() {
                    agregarEjercicioAlContenedor(ejercicio);
                });
            });

            // Hacer visible el contenedor de ejercicios cuando se haga clic en el "+" (summary)
            let details = container.closest('details');
            details.addEventListener('toggle', function () {
                container.style.display = details.open ? 'block' : 'none';
            });
        })
        .catch(error => console.error('Error al cargar el JSON local:', error));
}

// Función para agregar el div con la imagen de fondo y los demás elementos
function agregarEjercicioAlContenedor(ejercicio) {
    const ejercicioDiv = document.createElement('div');
    ejercicioDiv.classList.add('previsualizacion');

    const imagenDiv = document.createElement('div');
    imagenDiv.classList.add('imagen-fondo');
    const imagenFondo = `img/ejercicios/${ejercicio.replace(/ /g, '%20')}.png`;
    imagenDiv.style.backgroundImage = `url(${imagenFondo})`;

    const gradientDiv = document.createElement('div');
    gradientDiv.classList.add('gradiente-imagen');

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info-div');

    const tituloContainer = document.createElement('div');
    tituloContainer.classList.add('titulo-container');
    const titulo = document.createElement('div');
    titulo.classList.add('titulo');
    titulo.textContent = ejercicio;
    tituloContainer.appendChild(titulo);

    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('actions-container');

    const borrarContainer = document.createElement('div');
    borrarContainer.classList.add('borrar-container');
    const borrarBtn = document.createElement('div');
    borrarBtn.classList.add('delete-btn');
    borrarBtn.textContent = 'Borrar';
    borrarContainer.appendChild(borrarBtn);

    borrarBtn.addEventListener('click', function () {
        ejercicioDiv.style.display = 'none';
    });

    actionsContainer.appendChild(borrarContainer);
    infoDiv.appendChild(tituloContainer);
    infoDiv.appendChild(actionsContainer);

    imagenDiv.appendChild(gradientDiv);
    imagenDiv.appendChild(infoDiv);
    ejercicioDiv.appendChild(imagenDiv);

    const exerciseContainer = document.querySelector('.exercise-container');
    const radioOptions = exerciseContainer.querySelector('.radio-options');
    exerciseContainer.insertBefore(ejercicioDiv, radioOptions);

    console.log("Ejercicio agregado:", ejercicio);
}

// Asignar el evento a los inputs de músculo para que actualice los ejercicios disponibles
document.querySelectorAll('input[name="musculo"]').forEach(input => {
    input.addEventListener('change', actualizarEjercicios);
});
