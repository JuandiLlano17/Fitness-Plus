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
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Conexión fallida: ' . $conn->connect_error]);
    exit();
}
// Obtener los datos JSON del body de la petición
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "Datos no válidos"]);
    exit;
}
// Extraer correo y contraseña del JSON recibido
$email = $data['Inicio_sesion']['correo'] ?? '';
$password = $data['Inicio_sesion']['contrasena'] ?? '';
if (empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Campos de correo o contraseña vacíos']);
    exit();
}
// Si no es cliente, consulta en la tabla entrenador
$sql_entrenador = "SELECT * FROM usuarios WHERE Correo = ? AND Contrasena = ?";
$stmt_entrenador = $conn->prepare($sql_entrenador);
if (!$stmt_entrenador) {
    echo json_encode(['status' => 'error', 'message' => 'Error al preparar la consulta de entrenador: ' . $conn->error]);
    exit();
}
/*$stmt_entrenador->bind_param("ss", $email, $password);
if (!$stmt_entrenador->execute()) {
    echo json_encode(['status' => 'error', 'message' => 'Error en la consulta de entrenador: ' . $stmt_entrenador->error]);
    exit();
}*/
$result_entrenador = $stmt_entrenador->get_result();
if ($result_entrenador->num_rows > 0) {
    echo json_encode(['status' => $result_entrenador["rol"], 'message' => 'Entrenador encontrado']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No se encontró el usuario']);
}
// Cerrar las conexiones
$conn->close();
?>