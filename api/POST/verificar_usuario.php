<?php
// Configuración de encabezados para permitir CORS y solicitudes POST
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Configuración de conexión a la base de datos
$servername = "sql309.infinityfree.com";
$username = "if0_37560263";
$password = "Feliceslos321";
$dbname = "if0_37560263_Gimnasio1";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error al conectar a la base de datos.']);
    exit();
}

// Obtener los datos JSON del body de la petición
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Validar datos recibidos
if (!isset($data['Inicio_sesion']['correo']) || !isset($data['Inicio_sesion']['contrasena'])) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios.']);
    exit();
}

// Limpiar datos ingresados
$correo = trim($data['Inicio_sesion']['correo']);
$contrasena = trim($data['Inicio_sesion']['contrasena']);

// Consultar el correo en la base de datos
$sql = "SELECT Identificacion, Contrasena, rol FROM usuarios WHERE Correo = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // El usuario existe
    $row = $result->fetch_assoc();
    $hashedPassword = $row['Contrasena'];
    $rol = $row['rol'];
    $identificacion = $row['Identificacion'];

    // Verificar contraseña
    if (password_verify($contrasena, $hashedPassword)) {
        session_start(); // Iniciar la sesión
        $_SESSION["usuario_id"] = $Identificacion; // Guardar el ID del usuario
        $_SESSION["usuario_rol"] = $rol; // Guardar el rol del usuario
        // Contraseña correcta
        echo json_encode(['success' => $rol]); // Devuelve el rol directamente
    } else {
        // Contraseña incorrecta
        echo json_encode(['success' => false, 'message' => 'Usuario o contraseña incorrectos.']);
    }

} else {
    // Correo no encontrado
    echo json_encode(['success' => false, 'message' => 'Usuario o contraseña incorrectos.']);
}

// Cerrar conexión
$stmt->close();
$conn->close();
?>
