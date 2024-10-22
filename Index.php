<?php
// Recibir el JSON enviado
$json = file_get_contents('php://input');

// Decodificar el JSON a un array asociativo de PHP
$data = json_decode($json, true);

// Procesar los datos recibidos
if (isset($data['tipoUsuario']) && $data['tipoUsuario'] === 'entrenador') {
    // Obtener los datos personales del entrenador
    $nombre = $data['datosPersonales']['nombre'];
    $identificacion = $data['datosPersonales']['identificacion'];
    $edad = $data['datosPersonales']['edad'];
    $correo = $data['datosPersonales']['correo'];
    $contraseña = $data['datosPersonales']['contraseña'];

    // Aquí puedes hacer algo con los datos, como guardarlos en una base de datos
    // Ejemplo de respuesta exitosa
    echo json_encode(['status' => 'success', 'message' => 'Datos del entrenador guardados correctamente']);
} else {
    // Enviar respuesta de error
    echo json_encode(['status' => 'error', 'message' => 'Datos incorrectos o faltantes']);
}
?>
