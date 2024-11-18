
document.addEventListener('DOMContentLoaded', function () {
    // Para el tiempo 
    const radiosTiempo = document.querySelectorAll('input[name="tiempo-rutina"]');
    const summaryTiempo = document.getElementById('tiempoSeleccionado');
    // Para el músculo
    const radiosMusculo = document.querySelectorAll('input[name="musculo"]');
    const summaryMusculo = document.getElementById('musculoSeleccionado');
    // Obtener el modal y el campo para el nombre del ejercicio
    const modal = document.getElementById('crearEjercicioModal');
    const ejercicioNombre = document.getElementById('ejercicio-nombre');
    const radioButtons = document.querySelectorAll('input[name="agregar"]');
    // Obtener los modales de borrado y sus botones
    const borrarModal = document.getElementById('borrarModal');
    const siButton = borrarModal.querySelector('.boton-parent .button:first-child');
    const noButton = borrarModal.querySelector('.boton-parent .button:last-child');
    const borrarButtons = document.querySelectorAll('.frame .button');
    // Guardar modal y botón de guardar
    const guardarModal = document.getElementById('guardarModal');
    const guardarButton = document.querySelector('.button-centrado');
    // Mostrar el modal de confirmación de borrado al hacer clic en borrar
    borrarButtons.forEach(boton => {
        boton.addEventListener('click', function () {
            borrarModal.style.display = 'block'; // Mostrar el modal
        });
    });
    // Al hacer clic en "Sí", ocultar el modal
    siButton.addEventListener('click', function () {
        borrarModal.style.display = 'none'; // Ocultar el modal de confirmación
        modal.style.display = 'none'; // Ocultar también el modal de creación de ejercicios (si es necesario)
    });
    // Al hacer clic en "No", simplemente ocultar el modal de confirmación
    noButton.addEventListener('click', function () {
        borrarModal.style.display = 'none'; // Ocultar el modal de confirmación
    });
    // Función para actualizar el texto del summary de tiempo de la rutina
    function actualizarTiempo() {
        const tiempoSeleccionado = Array.from(radiosTiempo)
            .filter(radio => radio.checked) // Filtrar el que está seleccionado
            .map(radio => radio.labels[0].innerText); // Obtener el texto de la etiqueta
        // Si hay una medida seleccionada, mostrarla
        if (tiempoSeleccionado.length > 0) {
            summaryTiempo.textContent = tiempoSeleccionado[0]; // Mostrar la medida seleccionada
            summaryTiempo.style.color = 'black'; // Cambiar el color a negro
        } else {
            summaryTiempo.textContent = 'Tiempo de la Rutina'; // Texto predeterminado
            summaryTiempo.style.color = ''; // Volver al color predeterminado
        }
    }
    // Función para actualizar el texto del summary de músculo
    function actualizarMusculo() {
        const musculoSeleccionado = Array.from(radiosMusculo)
            .filter(radio => radio.checked) // Filtrar el que está seleccionado
            .map(radio => radio.labels[0].innerText); // Obtener el texto de la etiqueta
        // Si hay un músculo seleccionado, mostrarlo
        if (musculoSeleccionado.length > 0) {
            summaryMusculo.textContent = musculoSeleccionado[0]; // Mostrar el músculo seleccionado
            summaryMusculo.style.color = 'black'; // Cambiar el color a negro
        } else {
            summaryMusculo.textContent = 'Músculo'; // Texto predeterminado
            summaryMusculo.style.color = ''; // Volver al color predeterminado
        }
    }
    // Actualizar el contenido del modal de ejercicios cuando se selecciona un ejercicio
    radioButtons.forEach(radio => {
        radio.addEventListener('click', function () {
            // Obtener el texto del label asociado al radio button seleccionado
            const label = document.querySelector(`label[for="${radio.id}"]`).innerText;
            // Cambiar el nombre del ejercicio en el modal
            ejercicioNombre.textContent = label;
            // Mostrar el modal
            modal.style.display = 'flex';  // Mostrar el modal
            modal.style.zIndex = '1000'; // Asegurar que esté por encima de otros elementos
        });
    });
    // Añadir eventos a los radio buttons de tiempo para detectar los cambios
    radiosTiempo.forEach(radio => {
        radio.addEventListener('change', actualizarTiempo);
    });
    // Añadir eventos a los radio buttons de músculo para detectar los cambios
    radiosMusculo.forEach(radio => {
        radio.addEventListener('change', actualizarMusculo);
    });
    // Actualizar los valores iniciales por si hay selección previa
    actualizarTiempo();
    actualizarMusculo();
    // Mostrar el modal de guardar cuando se hace clic en el botón "Guardar"
    guardarButton.addEventListener('click', function () {
        guardarModal.style.display = 'block'; // Mostrar el modal de guardado
    });
    // Cerrar el modal de guardar al hacer clic en el botón dentro del modal
    const cerrarGuardarButton = guardarModal.querySelector('button');
    cerrarGuardarButton.addEventListener('click', function () {
        guardarModal.style.display = 'none'; // Cerrar el modal
    });
    
});
    