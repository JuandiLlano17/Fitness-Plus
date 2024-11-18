<?php
// Cabeceras para permitir solicitudes desde cualquier origen y establecer el tipo de contenido
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Configuración de conexión a la base de datos
$servername = "sql309.infinityfree.com";
$username = "if0_37560263";
$password = "Feliceslos321";
$dbname = "if0_37560263_Gimnasio1";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    error_log("Error de conexión a la base de datos: " . $conn->connect_error);
    die(json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos: " . $conn->connect_error
    ]));
}

// Leer los datos JSON enviados
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Registrar los datos recibidos en los logs
error_log("Datos JSON recibidos: " . $jsonData);

// Verificar que se recibió el campo "satisfaccion"
if (isset($data['satisfaccion']) && !empty($data['satisfaccion'])) {
    $nivel = $data['satisfaccion']; // Asignar el valor a la columna 'Nivel'

    // Log para verificar el valor de nivel
    error_log("Nivel recibido: " . $nivel);

    // Preparar la consulta para insertar el dato en la tabla detalles_cliente
    $stmt = $conn->prepare("INSERT INTO detalles_cliente (Nivel) VALUES (?)");

    if (!$stmt) {
        error_log("Error en la preparación del statement: " . $conn->error);
        echo json_encode([
            "success" => false,
            "message" => "Error al preparar la consulta: " . $conn->error
        ]);
        exit;
    }

    $stmt->bind_param("s", $nivel);

    // Ejecutar la consulta y verificar si fue exitosa
    if ($stmt->execute()) {
        error_log("Nivel guardado exitosamente en la base de datos.");
        echo json_encode([
            "success" => true,
            "message" => "Nivel guardado exitosamente en detalles_cliente."
        ]);
    } else {
        // Log del error en la ejecución de la consulta
        error_log("Error al ejecutar la consulta: " . $stmt->error);
        echo json_encode([
            "success" => false,
            "message" => "Error al guardar el nivel: " . $stmt->error
        ]);
    }

    // Cerrar la declaración
    $stmt->close();
} else {
    // Log del error si no se recibe el campo "satisfaccion"
    error_log("El campo 'satisfaccion' no se recibió o está vacío.");
    echo json_encode([
        "success" => false,
        "message" => "El campo 'satisfaccion' es obligatorio."
    ]);
}

// Cerrar la conexión a la base de datos
$conn->close();
?>
