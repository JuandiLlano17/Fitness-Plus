// Asegurarse de que el DOM esté completamente cargado antes de ejecutar
document.addEventListener('DOMContentLoaded', function () {
    const guardarButton = document.getElementById('guardarButton'); // Asegúrate de que este ID exista en el HTML
    const guardarModal = document.getElementById('guardarModal'); // Asegúrate de que este ID exista en el HTML

    // Mostrar el modal de guardar cuando se hace clic en el botón "Guardar"
    guardarButton.addEventListener('click', function () {
        guardarModal.style.display = 'block'; // Mostrar el modal de guardado
    });

    // Función para actualizar los ejercicios basados en el músculo seleccionado
    function actualizarEjercicios() {
        // Obtener el valor del músculo seleccionado
        let musculo = document.querySelector('input[name="musculo"]:checked').value;

        // Leer los ejercicios desde el servidor (modifica la URL según corresponda)
        fetch('pagina.json')
            .then(response => response.json())
            .then(data => {
                // Obtener los ejercicios del músculo seleccionado
                let ejercicios = data.musculo.ejercicios[musculo] || [];

                let container = document.querySelector('.exercise-container .radio-options .exercise-list');
                container.innerHTML = ''; // Limpiar los ejercicios previos

                // Iterar sobre cada ejercicio y crear elementos dinámicamente
                ejercicios.forEach(ejercicio => {
                    let radioInput = document.createElement('input');
                    radioInput.type = 'radio';
                    radioInput.name = 'agregar';
                    radioInput.value = ejercicio.nombre;
                    radioInput.id = ejercicio.nombre.toLowerCase().replace(/ /g, '-');

                    let label = document.createElement('label');
                    label.htmlFor = radioInput.id;
                    label.classList.add('custom-radio');
                    label.textContent = ejercicio.nombre;

                    // Agregar el input y el label al contenedor
                    container.appendChild(radioInput);
                    container.appendChild(label);
                    container.appendChild(document.createElement('br'));

                    // Agregar el evento `click` para cada ejercicio
                    label.addEventListener('click', function () {
                        agregarEjercicioAlContenedor(ejercicio, musculo);
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
    function agregarEjercicioAlContenedor(ejercicio, musculo) {
        const ejercicioDiv = document.createElement('div');
        ejercicioDiv.classList.add('previsualizacion');

        const imagenDiv = document.createElement('div');
        imagenDiv.classList.add('imagen-fondo');
        const imagenFondo = ejercicio.imagen;
        imagenDiv.style.backgroundImage = `url(${imagenFondo})`;

        const gradientDiv = document.createElement('div');
        gradientDiv.classList.add('gradiente-imagen');

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info-div');

        const tituloContainer = document.createElement('div');
        tituloContainer.classList.add('titulo-container');
        const titulo = document.createElement('div');
        titulo.classList.add('titulo');
        titulo.textContent = ejercicio.nombre;
        tituloContainer.appendChild(titulo);

        const instruccionesContainer = document.createElement('ul');
        instruccionesContainer.classList.add('instrucciones-list');
        ejercicio.instrucciones.forEach(instruccion => {
            const li = document.createElement('li');
            li.textContent = instruccion;
            instruccionesContainer.appendChild(li);
        });

        const actionsContainer = document.createElement('div');
        actionsContainer.classList.add('actions-container');

        const borrarContainer = document.createElement('div');
        borrarContainer.classList.add('borrar-container');
        const borrarBtn = document.createElement('div');
        borrarBtn.classList.add('delete-btn');
        borrarBtn.textContent = 'Borrar';
        borrarContainer.appendChild(borrarBtn);

        borrarBtn.addEventListener('click', function () {
            ejercicioDiv.remove(); // Eliminar el elemento del DOM
        });

        actionsContainer.appendChild(borrarContainer);
        infoDiv.appendChild(tituloContainer);
        infoDiv.appendChild(instruccionesContainer);
        infoDiv.appendChild(actionsContainer);

        imagenDiv.appendChild(gradientDiv);
        imagenDiv.appendChild(infoDiv);
        ejercicioDiv.appendChild(imagenDiv);

        const exerciseContainer = document.querySelector('.exercise-container');
        const radioOptions = exerciseContainer.querySelector('.radio-options');
        exerciseContainer.insertBefore(ejercicioDiv, radioOptions);

        console.log("Ejercicio agregado:", ejercicio.nombre);

        // Enviar datos al servidor
        guardarEjercicioEnServidor(musculo, ejercicio.nombre, ejercicio.instrucciones);
    }

    // Función para enviar datos al servidor
    function guardarEjercicioEnServidor(musculo, nombre, instrucciones) {
        fetch('api/POST/editar_entrenador.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                musculo: musculo,
                nombre: nombre,
                instrucciones: instrucciones.join("\n") // Enviar las instrucciones como un solo string
            })
        })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    console.log("Ejercicio guardado exitosamente en el servidor");
                } else {
                    console.error("Error al guardar el ejercicio:", result.message);
                }
            })
            .catch(error => console.error('Error al enviar los datos al servidor:', error));
    }

    // Asignar el evento a los inputs de músculo para que actualice los ejercicios disponibles
    document.querySelectorAll('input[name="musculo"]').forEach(input => {
        input.addEventListener('change', actualizarEjercicios);
    });
});
