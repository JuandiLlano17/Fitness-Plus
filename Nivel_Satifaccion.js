 // Capturar el emoji seleccionado al hacer clic
 $('.emoji-satisfaction').click(function () {
    selectedEmoji = $(this).attr('src'); // Almacenar la ruta de la imagen seleccionada
    $('.emoji-satisfaction').removeClass('selected'); // Eliminar la clase seleccionada de todos
    $(this).addClass('selected'); // Agregar la clase seleccionada a la imagen clickeada
  });

  // Al presionar "Guardar", mostrar el modal
  $('#GuardarBtn').click(function (e) {
    e.preventDefault();
    if (selectedEmoji) {
      localStorage.setItem('emojiSeleccionado', selectedEmoji); // Guardar en localStorage
      $('#Satisfaccion').css('display', 'block'); // Mostrar el modal
    } else {
      alert('Por favor, seleccione un emoji');
    }
  });

  // Al hacer clic en "Salir", redirigir a la página de Rutina.html
  $('#Cerrar').click(function () {
    window.location.href = 'Rutina.html'; // Redirigir a la página de Rutina
  });
