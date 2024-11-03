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
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

// Obtener los datos JSON del body de la petición
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

if (!$data) {
    die(json_encode(["success" => false, "message" => "Datos no válidos"]));
}

try {
    // Extraer los datos personales
    $datosPersonales = $data['datosPersonales'];
    
    // Preparar la consulta SQL
    $sql = "INSERT INTO cliente (Identificacion_clien, Nombre, Edad, Peso, Medida_Muneca, Dias_entreno, Altura, Correo, Contrasena) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Error preparando la consulta: " . $conn->error);
    }
    
    // Convertir el array de días a string
    $diasEntrenoStr = implode(',', $datosPersonales['diasEntreno']);
    
    // Hash de la contraseña
    $hashContraseña = password_hash($datosPersonales['contrasena'], PASSWORD_DEFAULT);
    
    // Vincular parámetros
    $stmt->bind_param("ssiddssss", 
        $datosPersonales['identificacion'],
        $datosPersonales['nombre'],
        $datosPersonales['edad'],
        $datosPersonales['peso'],
        $datosPersonales['medidaMuñeca'],
        $diasEntrenoStr,
        $datosPersonales['altura'],
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
