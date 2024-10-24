<?php
// Ruta del archivo JSON (asegúrate de que la ruta sea correcta)
$jsonFilePath = __DIR__ . '/pagina.json'; 

// Verificar si el archivo existe
if (file_exists($jsonFilePath)) {
    // Leer el archivo JSON
    $json = file_get_contents($jsonFilePath);

    // Decodificar el JSON a un array asociativo de PHP
    $data = json_decode($json, true);

    // Verificar si se ha recibido correctamente el JSON
    if (isset($data['usuarios']) && is_array($data['usuarios'])) {
        foreach ($data['usuarios'] as $usuario) {
            // Verificar el tipo de usuario
            if (isset($usuario['tipoUsuario']) && $usuario['tipoUsuario'] === 'entrenador') {
                // Obtener los datos personales del entrenador
                $correo = $usuario['datosPersonales']['correo'];
                $contraseña = $usuario['datosPersonales']['contraseña'];

                // Aquí puedes hacer algo con los datos, como guardarlos en una base de datos
                echo json_encode(['status' => 'success', 'message' => 'Datos del entrenador procesados correctamente']);
            } elseif (isset($usuario['tipoUsuario']) && $usuario['tipoUsuario'] === 'cliente') {
                // Obtener los datos personales del cliente
                $correo = $usuario['datosPersonales']['correo'];
                $contraseña = $usuario['datosPersonales']['contraseña'];

                // Aquí puedes hacer algo con los datos, como guardarlos en una base de datos
                echo json_encode(['status' => 'success', 'message' => 'Datos del cliente procesados correctamente']);
            } else {
                // Tipo de usuario no válido
                echo json_encode(['status' => 'error', 'message' => 'Tipo de usuario no válido']);
            }
        }
    } else {
        // Enviar respuesta de error si el JSON no es válido o no contiene usuarios
        echo json_encode(['status' => 'error', 'message' => 'Datos incorrectos o faltantes en el JSON']);
    }
} else {
    // Enviar respuesta de error si el archivo JSON no se encuentra
    echo json_encode(['status' => 'error', 'message' => 'El archivo pagina.json no existe']);
}

?>
