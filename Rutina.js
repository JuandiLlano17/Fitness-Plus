// Variables para el cronómetro
let tiempo = 0;
let intervalo;
let iniciado = false;

// Elementos del cronómetro en el DOM
const displayTiempo = document.querySelector('.tiempo');
const botonIniciar = document.getElementById('boton-iniciar');
const botonReiniciar = document.getElementById('boton-reiniciar');

// Función para actualizar el cronómetro en pantalla
function actualizarDisplay() {
  let segundos = tiempo % 60;
  let minutos = Math.floor(tiempo / 60);

  // Formatear los minutos y segundos para mostrar siempre dos dígitos
  displayTiempo.textContent = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

// Función para iniciar o pausar el cronómetro
function iniciarCronometro() {
  if (!iniciado) {
    intervalo = setInterval(() => {
      tiempo++;
      actualizarDisplay();
    }, 1000);
    iniciado = true;
  } else {
    clearInterval(intervalo);
    iniciado = false;
  }
}

// Función para reiniciar el cronómetro
function reiniciarCronometro() {
  clearInterval(intervalo);
  tiempo = 0;
  iniciado = false;
  actualizarDisplay();
}

// Event listeners para los botones
botonIniciar.addEventListener('click', iniciarCronometro);
botonReiniciar.addEventListener('click', reiniciarCronometro);