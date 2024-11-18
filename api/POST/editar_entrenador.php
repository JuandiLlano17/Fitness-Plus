<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Configuración de conexión a la base de datos
$servername = "sql309.infinityfree.com";
$username = "if0_37560263";
$password = "Feliceslos321";
$dbname = "if0_37560263_Gimnasio1";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Conexión fallida: " . $conn->connect_error]);
    exit;
}

// Leer los datos enviados en el cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

// Validar que se enviaron los datos requeridos
if (!isset($data['musculo'], $data['nombre'], $data['instrucciones'])) {
    echo json_encode(["status" => "error", "message" => "Faltan parámetros requeridos"]);
    exit;
}

// Asignar los valores
$musculo = $data['musculo'];
$nombre = $data['nombre'];
$instrucciones = $data['instrucciones'];

// Consulta para insertar datos en la tabla
$sql = "INSERT INTO rutina (musculo, nombre, instrucciones) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $musculo, $nombre, $instrucciones);

// Ejecutar la consulta
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Ejercicio guardado exitosamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al guardar el ejercicio: " . $stmt->error]);
}

// Cerrar la conexión
$stmt->close();
$conn->close();
?>
