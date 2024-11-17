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
file_put_contents("log_datos_recibidos.txt", file_get_contents('php://input'));


if (!$data) {
    die(json_encode(["success" => false, "message" => "Datos no válidos"]));
}

try {
    // Extraer los datos personales
    $datosPersonales = $data['datosPersonales'];

    // Validar que todos los campos necesarios estén presentes
    if (!isset($datosPersonales['identificacion'], $datosPersonales['nombre'], $datosPersonales['edad'], 
              $datosPersonales['correo'], $datosPersonales['contrasena'], $datosPersonales['rol'], 
              $datosPersonales['peso'], $datosPersonales['medidaMuñeca'], $datosPersonales['diasEntreno'], 
              $datosPersonales['altura'], $datosPersonales['fotoPerfil'])) {
        throw new Exception("Faltan datos necesarios");
    }

    // Procesar la foto de perfil
    $fotoPerfilBlob = null;
    if (!empty($datosPersonales['fotoPerfil'])) {
        $fotoPerfilBase64 = $datosPersonales['fotoPerfil'];
        
        // Decodificar Base64 a binario para guardarlo como BLOB
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
    $hashContraseña = password_hash($datosPersonales['contrasena'], PASSWORD_DEFAULT);

    // Vincular parámetros para la tabla `usuarios`
    $stmt->bind_param("ssisssb", 
        $datosPersonales['identificacion'], 
        $datosPersonales['nombre'], 
        $datosPersonales['edad'], 
        $datosPersonales['correo'], 
        $hashContraseña, 
        $fotoPerfilBlob, // Foto como binario
        $datosPersonales['rol']
    );

    if (!$stmt->execute()) {
        throw new Exception("Error ejecutando la consulta para usuarios: " . $stmt->error);
    }
    $stmt->close();

    // Segunda consulta: Insertar en tabla `detalles_cliente`
    $sqlDetalles = "INSERT INTO detalles_cliente (Identificacion, Peso, Medida_Muneca, Dias_entreno, Altura) 
                    VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sqlDetalles);
    if (!$stmt) {
        throw new Exception("Error preparando la consulta para detalles_cliente: " . $conn->error);
    }

    // Convertir el array de días a string
    $diasEntrenoStr = implode(',', $datosPersonales['diasEntreno']);

    // Vincular parámetros para la tabla `detalles_cliente`
    $stmt->bind_param("sddss",
        $datosPersonales['identificacion'],
        $datosPersonales['peso'],
        $datosPersonales['medidaMuñeca'],
        $diasEntrenoStr,
        $datosPersonales['altura']
    );

    if (!$stmt->execute()) {
        throw new Exception("Error ejecutando la consulta para detalles_cliente: " . $stmt->error);
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
