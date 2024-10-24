<?php
// Ruta del archivo JSON (asegúrate de que la ruta sea correcta)
$jsonFilePath = __DIR__ . '/pagina.json'; 

// Verificar si el archivo JSON existe
if (file_exists($jsonFilePath)) {
    // Leer el archivo JSON
    $json = file_get_contents($jsonFilePath);

    // Decodificar el JSON a un array asociativo de PHP
    $data = json_decode($json, true);

    // Verificar si se ha recibido correctamente el JSON
    if (isset($data['usuarios']) && is_array($data['usuarios'])) {
        // Recibir el JSON enviado desde el cliente (AJAX)
        if (isset($_POST['usuario']) && isset($_POST['tipoUsuario'])) {
            // Decodificar el JSON enviado desde el cliente
            $usuarioEnviado = json_decode($_POST['usuario'], true);
            $tipoUsuario = $_POST['tipoUsuario'];

            // Verificar que los datos sean válidos
            if ($usuarioEnviado && isset($usuarioEnviado['datosPersonales'])) {
                // Verificar el tipo de usuario
                if ($tipoUsuario === 'entrenador') {
                    // Obtener los datos personales del entrenador enviado por el cliente
                    $correo = $usuarioEnviado['datosPersonales']['correo'];
                    $contraseña = $usuarioEnviado['datosPersonales']['contraseña'];

                    // Aquí puedes hacer algo con los datos, como guardarlos en una base de datos
                    echo json_encode(['status' => 'success', 'message' => 'Datos del entrenador procesados correctamente']);
                } elseif ($tipoUsuario === 'cliente') {
                    // Obtener los datos personales del cliente enviado por el cliente
                    $correo = $usuarioEnviado['datosPersonales']['correo'];
                    $contraseña = $usuarioEnviado['datosPersonales']['contraseña'];

                    // Aquí puedes hacer algo con los datos, como guardarlos en una base de datos
                    echo json_encode(['status' => 'success', 'message' => 'Datos del cliente procesados correctamente']);
                } else {
                    // Tipo de usuario no válido
                    echo json_encode(['status' => 'error', 'message' => 'Tipo de usuario no válido']);
                }
            } else {
                // Error si los datos son incorrectos o faltantes
                echo json_encode(['status' => 'error', 'message' => 'Datos incompletos o inválidos enviados desde el cliente']);
            }
        } else {
            // No se enviaron datos por POST
            echo json_encode(['status' => 'error', 'message' => 'No se recibieron datos desde el cliente']);
        }
    } else {
        // Enviar respuesta de error si el JSON no es válido o no contiene usuarios
        echo json_encode(['status' => 'error', 'message' => 'Datos incorrectos o faltantes en el archivo JSON']);
    }
} else {
    // Enviar respuesta de error si el archivo JSON no se encuentra
    echo json_encode(['status' => 'error', 'message' => 'El archivo pagina.json no existe']);
}

?>

