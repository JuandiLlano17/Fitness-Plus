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
    die(json_encode([
        "success" => false,
        "message" => "Error de conexión a la base de datos: " . $conn->connect_error
    ]));
}

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Leer los datos JSON enviados
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);

    // Verificar que se recibió el campo "satisfaccion"
    if (isset($data['satisfaccion'])) {
        $nivel = $data['satisfaccion']; // Asignar el valor a la columna 'Nivel'

        // Preparar la consulta para insertar el dato en la tabla detalles_cliente
        $stmt = $conn->prepare("INSERT INTO detalles_cliente (Nivel) VALUES (?)");
        $stmt->bind_param("s", $nivel);

        // Ejecutar la consulta y verificar si fue exitosa
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Nivel guardado exitosamente en detalles_cliente.",
                "Nivel" => $nivel
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Error al guardar el nivel: " . $conn->error
            ]);
        }

        // Cerrar la declaración
        $stmt->close();
    } else {
        // Error: no se proporcionó el campo "satisfaccion"
        echo json_encode([
            "success" => false,
            "message" => "El campo 'satisfaccion' es obligatorio."
        ]);
    }
} else {
    // Error: método no permitido
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Solo se acepta POST."
    ]);
}

// Cerrar la conexión a la base de datos
$conn->close();
?>
