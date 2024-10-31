<?php
// Encabezados para permitir CORS y definir JSON como tipo de contenido
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Leer los datos enviados por el cliente
$inputData = json_decode(file_get_contents("php://input"), true);

if (!$inputData || empty($inputData['correo']) || empty($inputData['contraseña'])) {
    echo json_encode(['status' => 'error', 'message' => 'Datos incompletos o inválidos']);
    exit();
}

$correo = $inputData['correo'];
$contraseña = $inputData['contraseña'];

// Cargar el archivo JSON
$jsonFilePath = 'pagina.json'; // Cambia 'ruta/a/pagina.json' por la ruta real
$jsonData = file_get_contents($jsonFilePath);

if ($jsonData === false) {
    echo json_encode(['status' => 'error', 'message' => 'No se pudo cargar el archivo JSON']);
    exit();
}

$usuarios = json_decode($jsonData, true);

// Buscar al usuario en el JSON
$usuarioEncontrado = null;
foreach ($usuarios['usuarios'] as $usuario) {
    if ($usuario['datosPersonales']['correo'] === $correo && $usuario['datosPersonales']['contraseña'] === $contraseña) {
        $usuarioEncontrado = $usuario;
        break;
    }
}

// Responder según el resultado de la autenticación
if ($usuarioEncontrado) {
    echo json_encode(['status' => 'success', 'tipoUsuario' => $usuarioEncontrado['tipoUsuario']]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Correo o contraseña incorrectos']);
}
?>
