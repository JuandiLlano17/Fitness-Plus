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
    // Si hay un error en la conexión, enviamos un mensaje de error
    echo json_encode(["status" => "error", "message" => "Conexión fallida: " . $conn->connect_error]);
    exit;
}

// Verificar si el valor de 'musculo' está presente
if (!isset($_POST['musculo'])) {
    // Si el parámetro 'musculo' no está presente, enviamos un error
    echo json_encode(["status" => "error", "message" => "El parámetro 'musculo' no fue enviado"]);
    exit;
}

$musculo = $_POST['musculo'];
error_log("Músculo recibido: " . $musculo); // Para depuración

// Consulta para obtener ejercicios del músculo seleccionado
$sql = "SELECT Nombre FROM ejercicio WHERE musculo = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $musculo);
$stmt->execute();
$result = $stmt->get_result();

// Crear un array para almacenar los ejercicios
$ejercicios = [];
while ($row = $result->fetch_assoc()) {
    $ejercicios[] = $row['Nombre'];
}

// Cerrar la conexión y la declaración preparada
$stmt->close();
$conn->close();

// Verificar si se encontraron ejercicios y devolverlos en formato JSON
if (empty($ejercicios)) {
    // Si no se encontraron ejercicios, devolver error
    error_log("No se encontraron ejercicios para el músculo: $musculo");  // Agregar depuración
    echo json_encode([
        "status" => "error",
        "message" => "No se encontraron ejercicios para el músculo: $musculo"
    ]);
} else {
    // Si se encontraron ejercicios, devolver éxito con los ejercicios
    error_log("Ejercicios encontrados: " . implode(", ", $ejercicios));  // Agregar depuración
    echo json_encode([
        "status" => "success",
        "data" => $ejercicios
    ]);
}

// Asegurar que los datos se envíen inmediatamente
flush();
?>
