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

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]);
    exit;
}

// Obtener los datos JSON del body de la petición
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Datos no válidos"]);
    exit;
}

try {
    // Extraer los datos personales
    $datosPersonales = $data['datosPersonales'];
    
    // Preparar la consulta SQL
    $sql = "INSERT INTO entrenador (Indentificacion_entre, Nombre, Edad, Correo, Contrasena) 
            VALUES (?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Error preparando la consulta: " . $conn->error);
    }

    // Hash de la contraseña
    $hashContraseña = password_hash($datosPersonales['contraseña'], PASSWORD_DEFAULT);
    
    // Vincular parámetros
    $stmt->bind_param("ssiss", 
        $datosPersonales['identificacion'],
        $datosPersonales['nombre'],
        $datosPersonales['edad'],
        $datosPersonales['correo'],
        $hashContraseña
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Error ejecutando la consulta: " . $stmt->error);
    }
    
    // Respuesta exitosa
    echo json_encode(["success" => true, "message" => "Usuario registrado exitosamente"]);
    
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}
?>
