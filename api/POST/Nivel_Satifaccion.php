<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

session_start();

// Verificar que la sesión tiene un ID de usuario
if (!isset($_SESSION["usuario_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "No se encontró un ID de usuario en la sesión. Por favor, inicie sesión."
    ]);
    exit;
}

// Configuración de conexión a la base de datos
$servername = "sql300.infinityfree.com"; 
$username   = "if0_40041136";
$password   = "7auL2wynwt5";
$database   = "if0_40041136_Base_Datos";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Error en la conexión a la base de datos: " . $conn->connect_error
    ]);
    exit;
}

// Leer los datos JSON enviados
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Validar que se recibe el campo 'satisfaccion'
if (isset($data['satisfaccion']) && !empty($data['satisfaccion'])) {
    $nivel = $data['satisfaccion'];
    $usuario_id = $_SESSION["usuario_id"]; // Obtener el ID del usuario desde la sesión

    // Verificar si el usuario ya existe en la base de datos
    $stmt = $conn->prepare("SELECT Identificacion_clien FROM detalles_cliente WHERE Identificacion_clien = ?");
    if (!$stmt) {
        echo json_encode([
            "success" => false,
            "message" => "Error al preparar la consulta SELECT: " . $conn->error
        ]);
        exit;
    }

    $stmt->bind_param("i", $usuario_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Insertar el nivel de satisfacción si el usuario existe
        $stmt_insert = $conn->prepare("UPDATE detalles_cliente SET Nivel = ? WHERE Identificacion_clien = ?");
        if (!$stmt_insert) {
            echo json_encode([
                "success" => false,
                "message" => "Error al preparar la consulta de inserción: " . $conn->error
            ]);
            exit;
        }

        $stmt_insert->bind_param("si", $nivel, $usuario_id);

        if ($stmt_insert->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Nivel de satisfacción actualizado correctamente."
                
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Error al actualizar el nivel: " . $stmt_insert->error
            ]);
        }

        $stmt_insert->close();
    } else {
        echo json_encode([
            "success" => false,
            "message" => "El usuario no existe en la base de datos."
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
