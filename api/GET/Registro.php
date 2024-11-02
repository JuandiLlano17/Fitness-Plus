<?php
// Configuración para mostrar errores (solo en desarrollo, no en producción)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

// Configuración de conexión a la base de datos
$servername = "sql309.infinityfree.com";
$username = "if0_37560263";
$password = "Feliceslos321";
$dbname = "if0_37560263_Gimnasio1";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

// Obtener los datos JSON en el campo "cliente"
if (isset($_POST['cliente'])) {
    $data = json_decode($_POST['cliente'], true);

    if (!$data) {
        die(json_encode(["success" => false, "message" => "Datos no válidos"]));
    }
} else {
    die(json_encode(["success" => false, "message" => "No se recibieron datos"]));
}

// Cerrar la conexión
$stmt->close();
$conn->close();
?>
