<?php
// Recibir el JSON enviado
$json = file_get_contents('php://input');

// Decodificar el JSON a un array asociativo de PHP
$data = json_decode($json, true);

// Verificar el tipo de usuario y procesar los datos
if ($data['tipoUsuario'] === 'cliente') {
    // Procesar datos de cliente
    $nombre = $data['datosPersonales']['nombre'];
    $identificacion = $data['datosPersonales']['identificacion'];
    // Otros datos del cliente...
} elseif ($data['tipoUsuario'] === 'entrenador') {
    // Procesar datos de entrenador
    $nombre = $data['datosPersonales']['nombre'];
    $identificacion = $data['datosPersonales']['identificacion'];
    // Otros datos del entrenador...
}

// Enviar respuesta
echo json_encode(['status' => 'success', 'data' => $data]);
?>