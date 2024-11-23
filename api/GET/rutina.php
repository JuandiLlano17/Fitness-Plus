<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
function writeLog($message) {
    $logFile = 'log.txt'; // Archivo donde guardarás los logs
    $current = file_get_contents($logFile);
    $current .= date('Y-m-d H:i:s') . " - " . $message . "\n";
    file_put_contents($logFile, $current);
}

// Conexión a la base de datos
$servername = "sql309.infinityfree.com";
$username = "if0_37560263";
$password = "Feliceslos321";
$dbname = "if0_37560263_Gimnasio1";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos: " . $conn->connect_error]);
    exit;
}

$id_cliente = isset($_GET['id_cliente']) ? intval($_GET['id_cliente']) : 0;
writeLog("ID Cliente recibido: $id_cliente");

$id_cliente = isset($_GET['id_cliente']) ? intval($_GET['id_cliente']) : 0;

if ($id_cliente <= 0) {
    echo json_encode(["success" => false, "message" => "ID de cliente no válido"]);
    $conn->close();
    exit;
}
try {
    // Consulta SQL para unir las tablas y obtener los datos requeridos
    $sql = "SELECT 
                r.id_rutina, 
                r.tiempo_rutina, 
                r.dia, 
                e.id_ejercicios, 
                e.Nombre AS nombre_ejercicio, 
                e.musculo, 
                e.Detalle1 AS detalle1, 
                e.Detalle2 AS detalle2, 
                e.Detalle3 AS detalle3
            FROM rutina r
            INNER JOIN ejercicio e ON r.id_ejercicios = e.id_ejercicios
            WHERE r.cliente_id = $id_cliente
        ";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $rutinas = [];
        while ($row = $result->fetch_assoc()) {
            $rutinas[] = [
                "id_rutina" => $row["id_rutina"],
                "tiempo_rutina" => $row["tiempo_rutina"],
                "dia" => $row["dia"],
                "id_ejercicios" => $row["id_ejercicios"],
                "nombre_ejercicio" => $row["Nombre"],
                "musculo" => $row["musculo"],
                "detalle1" => $row["Detalle1"],
                "detalle2" => $row["Detalle2"],
                "detalle3" => $row["Detalle3"]
            ];
        }
        writeLog("Rutinas obtenidas: " . json_encode($rutinas));
        echo json_encode(["success" => true, "rutinas" => $rutinas]);
    } else {
        echo json_encode(["success" => false, "message" => "No se encontraron rutinas para el cliente."]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} finally {
    $conn->close();
}
?>
