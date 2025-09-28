<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Función para registrar logs
function writeLog($message) {
    $logFile = 'log.txt';
    $current = file_exists($logFile) ? file_get_contents($logFile) : '';
    $current .= date('Y-m-d H:i:s') . " - " . $message . "\n";
    file_put_contents($logFile, $current);
}

// Conexión a la base de datos
$servername = "sql300.infinityfree.com"; 
$username   = "if0_40041136";
$password   = "7auL2wynwt5";
$database   = "if0_40041136_Base_Datos";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos: " . $conn->connect_error]);
    exit;
}

// Manejo de solicitud POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validar y extraer parámetros
    $id_rutina = isset($data['id_rutina']) ? intval($data['id_rutina']) : 0;
    $id_ejercicio_actual = isset($data['id_ejercicio_actual']) ? intval($data['id_ejercicio_actual']) : 0;
    $id_ejercicio_reemplazo = isset($data['id_ejercicio_reemplazo']) ? intval($data['id_ejercicio_reemplazo']) : 0;

    // Validación de parámetros
    if ($id_rutina <= 0 || $id_ejercicio_actual <= 0 || $id_ejercicio_reemplazo <= 0) {
        writeLog("Error: Datos insuficientes para reemplazar el ejercicio.");
        echo json_encode(["success" => false, "message" => "Datos insuficientes para reemplazar el ejercicio."]);
        $conn->close();
        exit;
    }

    try {
        // Actualizar el ejercicio en la tabla rutina
        $sql = "UPDATE rutina 
                SET id_ejercicio = REPLACE(id_ejercicio, '$id_ejercicio_actual', '$id_ejercicio_reemplazo') 
                WHERE id_rutina = $id_rutina";

        if ($conn->query($sql) === TRUE) {
            writeLog("Ejercicio reemplazado correctamente: $id_ejercicio_actual -> $id_ejercicio_reemplazo en rutina $id_rutina.");
            echo json_encode(["success" => true, "message" => "Ejercicio reemplazado correctamente."]);
        } else {
            throw new Exception("Error al actualizar el ejercicio: " . $conn->error);
        }
    } catch (Exception $e) {
        writeLog("Error en la consulta: " . $e->getMessage());
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }

    $conn->close();
    exit;
}

// Si no es una solicitud POST, retornar error
echo json_encode(["success" => false, "message" => "Método no permitido."]);
$conn->close();
?>
