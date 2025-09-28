<?php
// Configuración de conexión a la base de datos
$servername = "sql300.infinityfree.com"; 
$username   = "if0_40041136";
$password   = "7auL2wynwt5";
$database   = "if0_40041136_Base_Datos";

// Crear la conexión a la base de datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Error de conexión: " . $conn->connect_error]));
}

// Obtener los datos JSON del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

// Verificar si los datos se recibieron correctamente
if (!isset($data['cliente_id']) || !isset($data['dia']) || !isset($data['tiempo_rutina']) || !isset($data['id_ejercicio'])) {
    echo json_encode(["status" => "error", "message" => "Faltan datos en la solicitud."]);
    exit();
}

// Asignar las variables desde el JSON recibido
$cliente_id = $data['cliente_id'];
$dia = $data['dia'];
$tiempo_rutina = $data['tiempo_rutina'];
$id_ejercicio = $data['id_ejercicio'];
// Si id_ejercicio es un arreglo, lo convertimos en una cadena
if (is_array($id_ejercicio)) {
    $id_ejercicio = implode(',', $id_ejercicio); // Convierte el arreglo en una cadena separada por comas
}

// Preparar la consulta SQL para insertar los datos
$query = "INSERT INTO rutina (cliente_id, dia, tiempo_rutina, id_ejercicio) VALUES (?, ?, ?, ?)";

// Preparar la declaración
$stmt = $conn->prepare($query);
if ($stmt === false) {
    echo json_encode(["status" => "error", "message" => "Error al preparar la consulta SQL."]);
    exit();
}

// Vincular los parámetros
$stmt->bind_param("ssss", $cliente_id, $dia, $tiempo_rutina, $id_ejercicio);

// Ejecutar la consulta
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Rutina guardada exitosamente."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al guardar la rutina: " . $stmt->error]);
}

// Cerrar la conexión
$stmt->close();
$conn->close();
?>
