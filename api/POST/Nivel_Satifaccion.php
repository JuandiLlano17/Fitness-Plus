<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Configuración de conexión a la base de datos
$servername = "sql309.infinityfree.com";
$username = "if0_37560263";
$password = "Feliceslos321";
$dbname = "if0_37560263_Gimnasio1";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "Error en la conexión a la base de datos: " . $conn->connect_error
    ]));
}

// Leer los datos JSON enviados
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Validar que se recibe el campo 'satisfaccion'
if (isset($data['satisfaccion']) && !empty($data['satisfaccion'])) {
    $nivel = $data['satisfaccion'];

    // Insertar el nivel en la base de datos
    $stmt = $conn->prepare("INSERT INTO detalles_cliente (Nivel) VALUES (?)");
    if (!$stmt) {
        echo json_encode([
            "success" => false,
            "message" => "Error al preparar la consulta: " . $conn->error
        ]);
        exit;
    }

    $stmt->bind_param("s", $nivel);

    // Ejecutar consulta
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Nivel de satisfacción guardado correctamente."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Error al guardar el nivel: " . $stmt->error
        ]);
    }

    $stmt->close();
} else {
    echo json_encode([
        "success" => false,
        "message" => "El campo 'satisfaccion' es obligatorio."
    ]);
}

$conn->close();
?>
