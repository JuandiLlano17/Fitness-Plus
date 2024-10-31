<?php
// Encabezados para permitir CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Respuesta a peticiones de tipo OPTIONS (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de la conexión a la base de datos
$host = 'sql309.infinityfree.com';
$dbname = 'if0_37560263_XXX';
$username = 'if0_37560263';
$password = 'Feliceslos321';

try {
    // Conectar a la base de datos usando PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión a la base de datos']);
    exit();
}

// Recibir y decodificar los datos enviados desde el cliente
$inputData = json_decode(file_get_contents('php://input'), true);

// Validar datos de registro
if (!$inputData || empty($inputData['tipoUsuario']) || empty($inputData['datosPersonales']['correo']) || empty($inputData['datosPersonales']['contraseña'])) {
    echo json_encode(['status' => 'error', 'message' => 'Datos incompletos o inválidos']);
    exit();
}

// Preparar la consulta SQL para insertar los datos en la base de datos
try {
    $stmt = $pdo->prepare("INSERT INTO usuarios (tipoUsuario, correo, contraseña) VALUES (:tipoUsuario, :correo, :contraseña)");
    $stmt->bindParam(':tipoUsuario', $inputData['tipoUsuario']);
    $stmt->bindParam(':correo', $inputData['datosPersonales']['correo']);
    $stmt->bindParam(':contraseña', password_hash($inputData['datosPersonales']['contraseña'], PASSWORD_DEFAULT));

    // Ejecutar la consulta
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Usuario registrado correctamente']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No se pudo registrar el usuario']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error en la consulta SQL']);
}

// Cerrar la conexión
$pdo = null;
?>
