<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Configuración de conexión a la base de datos
$servername = "sql300.infinityfree.com"; 
$username   = "if0_40041136";
$password   = "7auL2wynwt5";
$database   = "if0_40041136_Base_Datos";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos: " . $conn->connect_error]));
}

// Obtener los datos JSON del body de la petición
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);
file_put_contents("log_datos_recibidos.txt", $jsonData);

if (!$data) {
    die(json_encode(["success" => false, "message" => "Datos no válidos o JSON mal formado"]));
}

try {
    // Extraer los datos personales
    $datosPersonales = $data['datosPersonales'] ?? null;

    if (!$datosPersonales) {
        throw new Exception("No se encontraron datos personales en el JSON");
    }

    // Lista de campos obligatorios
    $requiredFields = [
        'identificacion', 'nombre', 'edad', 'correo', 'contrasena', 'rol',
         'fotoPerfil'
    ];

    // Validar que todos los campos estén presentes
    foreach ($requiredFields as $field) {
        if (empty($datosPersonales[$field])) {
            throw new Exception("Falta el campo obligatorio: $field");
        }
    }

    // Procesar la foto de perfil
    $fotoPerfilBlob = null;
    if (!empty($datosPersonales['fotoPerfil'])) {
        $fotoPerfilBase64 = $datosPersonales['fotoPerfil'];
        list($tipo, $fotoPerfilBase64) = explode(';', $fotoPerfilBase64); // Separar tipo
        list(, $fotoPerfilBase64) = explode(',', $fotoPerfilBase64); // Obtener datos reales
        $fotoPerfilBlob = base64_decode($fotoPerfilBase64);
    }

    // Primera consulta: Insertar en tabla `usuarios`
    $sqlUsuarios = "INSERT INTO usuarios (Identificacion, Nombre, Edad, Correo, Contrasena, Foto_perfil, rol) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sqlUsuarios);
    if (!$stmt) {
        throw new Exception("Error preparando la consulta para usuarios: " . $conn->error);
    }

    // Hash de la contraseña
    $hashContrasena = password_hash($datosPersonales['contrasena'], PASSWORD_DEFAULT);

    // Vincular parámetros para la tabla `usuarios`
    $stmt->bind_param(
        "ssissss",
        $datosPersonales['identificacion'],
        $datosPersonales['nombre'],
        $datosPersonales['edad'],
        $datosPersonales['correo'],
        $hashContrasena,
        $fotoPerfilBlob, // Foto como binario
        $datosPersonales['rol']
    );

    if (!$stmt->execute()) {
        throw new Exception("Error ejecutando la consulta para usuarios: " . $stmt->error);
    }
    $stmt->close();

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
