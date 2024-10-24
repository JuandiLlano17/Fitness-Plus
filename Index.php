<?php
// Ruta del archivo JSON (asegúrate de que la ruta sea correcta)
$jsonFilePath = __DIR__ . '/pagina.json'; 

// Verificar si el archivo JSON existe
if (file_exists($jsonFilePath)) {
    // Leer el archivo JSON
    $json = file_get_contents($jsonFilePath);

    // Decodificar el JSON a un array asociativo de PHP
    $data = json_decode($json, true);

    // Verificar si el archivo JSON tiene la clave 'usuarios'
    if (isset($data['usuarios']) && is_array($data['usuarios'])) {
        // Recibir el JSON enviado desde el cliente (AJAX)
        $inputData = json_decode(file_get_contents('php://input'), true);

        // Verificar que los datos sean válidos
        if ($inputData && isset($inputData['tipoUsuario']) && isset($inputData['datosPersonales'])) {
            $tipoUsuario = $inputData['tipoUsuario'];
            $datosPersonales = $inputData['datosPersonales'];

            // Verificar el tipo de usuario
            if ($tipoUsuario === 'entrenador' || $tipoUsuario === 'cliente') {
                // Agregar el nuevo usuario al array de usuarios
                $data['usuarios'][] = $inputData;

                // Guardar los datos actualizados en el archivo JSON
                if (file_put_contents($jsonFilePath, json_encode($data, JSON_PRETTY_PRINT))) {
                    // Respuesta exitosa
                    echo json_encode(['status' => 'success', 'message' => 'Usuario registrado correctamente']);
                } else {
                    // Error al guardar el archivo JSON
                    echo json_encode(['status' => 'error', 'message' => 'Error al guardar los datos en el archivo JSON']);
                }
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

