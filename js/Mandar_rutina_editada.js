//recuperar id del cliente seleccionado
const urlParams = new URLSearchParams(window.location.search);
const clienteId = urlParams.get('id');

if (clienteId) {
} else {
    console.error('No se proporcionó el ID del cliente.');
}

fetch('api/GET/obtener_cliente.php')
    .then(response => response.json())
    .then(data => {
        if (data.success && data.data) {
            const cliente = data.data.find(c => c.id === clienteId); // Obtener el cliente por su ID
            if (cliente) {
                // Aquí tienes los días de entrenamiento
                const diasEntreno = cliente.diasEntreno.split(','); // Convertir los días en un array
                mostrarDias(diasEntreno); // Llamamos a la función para mostrar los días
            }
        }
    })
    .catch(error => {
        console.error('Error al cargar los datos del cliente:', error);
    });

function mostrarDias(diasEntreno) {
    const diasContainer = document.querySelector('.dias-container');
    diasContainer.innerHTML = ''; // Limpiamos el contenedor de días

    // Mostrar solo los días que el cliente tiene en su lista
    diasEntreno.forEach(dia => {
        const diaElement = document.createElement('h2');
        diaElement.classList.add('dia');
        diaElement.textContent = dia; // Asignar el nombre del día
        diasContainer.appendChild(diaElement);

        // Agregar evento para manejar el click en cada día
        diaElement.addEventListener('click', () => {
            seleccionarDia(dia); // Llamamos a la función para manejar el clic
        });
    });
}

function seleccionarDia(dia) {
    console.log('Día seleccionado:', dia);
    // Aquí puedes cambiar la interfaz y cargar los ejercicios para ese día.
    // Mostrar el formulario para agregar ejercicios según el día.
    // Deberías cargar los ejercicios previamente guardados para ese día.
}


//INFO RUTINA

// Obtener los datos del formulario
const tiempoRutina = document.querySelector('input[name="tiempo-rutina"]:checked')?.value;
const musculoSeleccionado = document.querySelector('input[name="musculo"]:checked')?.value;
const ejercicios = [];  // Aquí guardamos los ejercicios seleccionados
const repeticiones = [];  // Aquí las repeticiones de cada ejercicio

// Llenar los ejercicios y repeticiones desde los campos correspondientes
document.querySelectorAll('.exercise-list input').forEach((input, index) => {
    if (input.checked) {
        ejercicios.push(input.value);  // Nombre del ejercicio
        repeticiones.push(document.querySelector(`#repeticiones-${index}`).value);  // Repeticiones
    }
});

// Enviar los datos al servidor
fetch('guardar_rutina.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        clienteId: clienteId,
        tiempoRutina: tiempoRutina,
        musculoSeleccionado: musculoSeleccionado,
        ejercicios: ejercicios,
        repeticiones: repeticiones
    })
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        alert('Rutina guardada correctamente');
    } else {
        alert('Error al guardar la rutina');
    }
})
.catch(error => {
    console.error('Error al enviar los datos:', error);
    alert('Hubo un error al guardar los datos');
});
