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

// Validación del cliente
$id_cliente = isset($_GET['id_cliente']) ? intval($_GET['id_cliente']) : 0;
writeLog("ID Cliente recibido: $id_cliente");

if ($id_cliente <= 0) {
    echo json_encode(["success" => false, "message" => "ID de cliente no válido"]);
    $conn->close();
    exit;
}

// Validación del día
$dia_actual = isset($_GET['dia']) ? strtolower($_GET['dia']) : null;

if (!$dia_actual) {
    writeLog("Día no especificado en la solicitud.");
    echo json_encode(["success" => false, "message" => "No se especificó el día actual"]);
    $conn->close();
    exit;
}

// Validar que el día sea válido
$valid_days = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
if (!in_array($dia_actual, $valid_days)) {
    writeLog("Día inválido recibido: $dia_actual");
    echo json_encode(["success" => false, "message" => "Día no válido"]);
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
        INNER JOIN ejercicio e ON FIND_IN_SET(e.id_ejercicios, r.id_ejercicio)
        WHERE r.cliente_id = $id_cliente AND LOWER(r.dia) = '$dia_actual'";
    writeLog("Consulta SQL ejecutada: $sql");

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $rutinas = [];
        while ($row = $result->fetch_assoc()) {
            $rutina_id = $row["id_rutina"];

            // Agrupar ejercicios bajo la misma rutina
            if (!isset($rutinas[$rutina_id])) {
                $rutinas[$rutina_id] = [
                    "id_rutina" => $rutina_id,
                    "tiempo_rutina" => $row["tiempo_rutina"],
                    "dia" => $row["dia"],
                    "ejercicios" => []
                ];
            }

            // Agregar los detalles del ejercicio a la rutina
            $rutinas[$rutina_id]["ejercicios"][] = [
                "id_ejercicio" => $row["id_ejercicios"],
                "nombre_ejercicio" => $row["nombre_ejercicio"],
                "musculo" => htmlspecialchars($row["musculo"]),
                "musculo" => utf8_encode($row["musculo"]),
                "detalle1" => utf8_encode($row["detalle1"]),
                "detalle2" => utf8_encode($row["detalle2"]),
                "detalle3" => utf8_encode($row["detalle3"])
            ];
        }

        writeLog("Rutinas obtenidas para el día $dia_actual: " . json_encode($rutinas));
        echo json_encode(["success" => true, "rutinas" => array_values($rutinas)]);
    } else {
        writeLog("No se encontraron rutinas para el día: $dia_actual y cliente ID: $id_cliente");
        echo json_encode(["success" => false, "message" => "No se encontraron rutinas para el cliente en el día '$dia_actual'."]);
    }
} catch (Exception $e) {
    writeLog("Error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} finally {
    $conn->close();
}
?>
