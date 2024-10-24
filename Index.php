<?php
// Encabezados para permitir CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Respuesta a peticiones de tipo OPTIONS (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ruta del archivo JSON (asegúrate de que la ruta sea correcta)
$jsonFilePath = __DIR__ . '/pagina.json';

// Verificar si el archivo JSON existe
if (file_exists($jsonFilePath)) {
    // Leer el archivo JSON
    $json = file_get_contents($jsonFilePath);

    // Decodificar el JSON a un array asociativo de PHP
    $data = json_decode($json, true);

    // Validar que la decodificación JSON fue exitosa
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['status' => 'error', 'message' => 'Error al decodificar el archivo JSON']);
        exit();
    }

    // Verificar si el archivo JSON tiene la clave 'usuarios'
    if (isset($data['usuarios']) && is_array($data['usuarios'])) {
        // Recibir el JSON enviado desde el cliente (AJAX)
        $inputData = json_decode(file_get_contents('php://input'), true);

        // Validar que el JSON enviado sea válido
        if (json_last_error() !== JSON_ERROR_NONE) {
            echo json_encode(['status' => 'error', 'message' => 'Datos JSON enviados desde el cliente son inválidos']);
            exit();
        }

        // Verificar que los datos sean válidos
        if ($inputData && isset($inputData['tipoUsuario']) && isset($inputData['datosPersonales'])) {
            $tipoUsuario = $inputData['tipoUsuario'];
            $datosPersonales = $inputData['datosPersonales'];

            // Verificar el tipo de usuario
            if ($tipoUsuario === 'entrenador' || $tipoUsuario === 'cliente') {
                // Agregar el nuevo usuario al array de usuarios
                $data['usuarios'][] = $inputData;

                // Guardar los datos actualizados en el archivo JSON
                if (file_put_contents($jsonFilePath, json_encode($data, JSON_PRETTY_PRINT)) === false) {
                    echo json_encode(['status' => 'error', 'message' => 'No se pudo guardar el archivo JSON']);
                    exit();
                }

                // Respuesta exitosa
                echo json_encode(['status' => 'success', 'message' => 'Usuario registrado correctamente']);
            } else {
                // Tipo de usuario no válido
                echo json_encode(['status' => 'error', 'message' => 'Tipo de usuario no válido']);
            }
        } else {
            // Datos enviados son inválidos
            echo json_encode(['status' => 'error', 'message' => 'Datos incompletos o inválidos enviados desde el cliente']);
        }
    } else {
        // El archivo JSON no tiene la estructura esperada
        echo json_encode(['status' => 'error', 'message' => 'Datos incorrectos o faltantes en el archivo JSON']);
    }
} else {
    // El archivo JSON no existe
    echo json_encode(['status' => 'error', 'message' => 'El archivo pagina.json no existe']);
}
?>
