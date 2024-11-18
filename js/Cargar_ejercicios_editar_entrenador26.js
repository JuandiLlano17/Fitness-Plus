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
    
    // Función para agregar el div con la imagen de fondo y los demás elementos
    function agregarEjercicioAlContenedor(ejercicio) {
    // Crear el contenedor principal (div)
    const ejercicioDiv = document.createElement('div');
    ejercicioDiv.classList.add('previsualizacion');
    
    // Crear el contenedor con la imagen de fondo
    const imagenDiv = document.createElement('div');
    imagenDiv.classList.add('imagen-fondo');
    const imagenFondo = `img/ejercicios/${ejercicio.replace(/ /g, '%20')}.png`;  // Cambiar a la imagen correcta
    imagenDiv.style.backgroundImage = `url(${imagenFondo})`;
    
    // Crear el contenedor con el gradiente sobre la imagen
    const gradientDiv = document.createElement('div');
    gradientDiv.classList.add('gradiente-imagen');
    
    // Crear el contenedor "infoDiv" que contendrá el título y las acciones
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info-div');  // Nueva clase para el contenedor de información
    
    // Contenedor para el título (nombre del ejercicio)
    const tituloContainer = document.createElement('div');
    tituloContainer.classList.add('titulo-container');
    const titulo = document.createElement('div');
    titulo.classList.add('titulo');
    titulo.textContent = ejercicio;  // Asigna el nombre del ejercicio
    tituloContainer.appendChild(titulo);
    
    // Contenedor para repeticiones y borrar juntos
    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('actions-container');  // Nuevo contenedor para las acciones
    
    
    // Crear el contenedor de repeticiones
    const repsContainer = document.createElement('div');
    repsContainer.classList.add('reps-container');
    repsContainer.style.display = 'none';
    /*
        // Crear el campo input para las repeticiones
        const repsInput = document.createElement('input');
        repsInput.type = 'text';
        repsInput.placeholder = '3-12'; // Valor predeterminado
        repsInput.classList.add('input-reps');
        
        // Crear el texto "reps"
        const repsText = document.createElement('span');
        repsText.textContent = 'reps';
    
        // Agregar el input y el texto "reps" dentro del contenedor de repeticiones
        repsContainer.appendChild(repsInput);
        repsContainer.appendChild(repsText);
        */
    
    // Contenedor para el botón "Borrar"
    const borrarContainer = document.createElement('div');
    borrarContainer.classList.add('borrar-container');
    const borrarBtn = document.createElement('div');
    borrarBtn.classList.add('delete-btn'); 
    borrarBtn.textContent = 'Borrar';
    borrarContainer.appendChild(borrarBtn);
    
    // Agregar el evento de borrar al botón (ocultar el div en vez de eliminarlo)
    borrarBtn.addEventListener('click', function() {
    // Ocultar el contenedor del ejercicio (ejercicioDiv) usando display: none
    ejercicioDiv.style.display = 'none';  // Oculta el div en lugar de eliminarlo
    });
    
    // Agregar repsContainer y borrarContainer al nuevo contenedor de acciones
    actionsContainer.appendChild(repsContainer);
    actionsContainer.appendChild(borrarContainer);
    
    // Añadir el título y las acciones al infoDiv
    infoDiv.appendChild(tituloContainer);
    infoDiv.appendChild(actionsContainer);
    
    // Añadir los contenedores al contenedor principal
    imagenDiv.appendChild(gradientDiv);
    imagenDiv.appendChild(infoDiv);  // Añadimos el infoDiv en lugar de directamente los otros contenedores
    ejercicioDiv.appendChild(imagenDiv);
    
    // Obtener el contenedor donde agregar el nuevo div
    const exerciseContainer = document.querySelector('.exercise-container');
    const radioOptions = exerciseContainer.querySelector('.radio-options');
    
    // Insertar el nuevo div de ejercicio antes de las opciones de radio
    exerciseContainer.insertBefore(ejercicioDiv, radioOptions);
    console.log("Div insertado en el contenedor:", ejercicioDiv);
    }
    
    // Asignar el evento a los inputs de músculo para que actualice los ejercicios disponibles
    document.querySelectorAll('input[name="musculo"]').forEach(input => {
    input.addEventListener('change', actualizarEjercicios); 
    });