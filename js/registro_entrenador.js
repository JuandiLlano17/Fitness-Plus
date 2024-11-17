document.getElementById('fotoPerfil').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('previewImagen').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('registroEntrenadorBtn').addEventListener('click', async function () {
try {
  const identificacion = document.getElementById('identificacion').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const edad = document.getElementById('edad').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const contraseña = document.getElementById('contrasena').value.trim();

  // Validaciones de campos
  if (!identificacion || !nombre || !edad || !correo || !contraseña) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
  }

  const entrenador = {
     "tipoUsuario": "entrenador",
      "datosPersonales": {
          "identificacion": identificacion,
          "nombre": nombre,
          "edad": edad,
          "correo": correo,
          "contraseña": contraseña
      }
  };

  console.log(JSON.stringify(entrenador));

  const response = await fetch('api/POST/Registro.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(entrenador)
  });

  if (!response.ok) {
      throw new Error("Error en la solicitud al servidor.");
  }

  const data = await response.json();
  
  if (data.success) {
      alert('Registro exitoso');
      window.location.href = "iniciar_sesion.html";
  } else {
      alert('Error en el registro: ' + data.message);
  }
} catch (error) {
  console.error('Error:', error);
  alert('Error en el registro. Por favor, intenta nuevamente.');
}
});