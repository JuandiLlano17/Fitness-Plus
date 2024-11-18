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

// Leer los datos recibidos desde el frontend
$data = json_decode(file_get_contents('php://input'), true);

// Comprobar si todos los datos requeridos están presentes
if (isset($data['clienteId'], $data['diasEntreno'], $data['tiempoRutina'], $data['musculoSeleccionado'], $data['ejercicios'], $data['repeticiones'])) {
    $clienteId = $data['clienteId'];
    $diasEntreno = $data['diasEntreno'];  // Array de días que el cliente entrena
    $tiempoRutina = $data['tiempoRutina'];
    $musculoSeleccionado = $data['musculoSeleccionado'];
    $ejercicios = $data['ejercicios'];  // Array de ejercicios
    $repeticiones = $data['repeticiones'];  // Array de repeticiones

    // Asegurarse de que ambos arreglos tengan el mismo tamaño
    if (count($ejercicios) !== count($repeticiones)) {
        echo json_encode(["status" => "error", "message" => "La cantidad de ejercicios y repeticiones no coinciden"]);
        exit;
    }

    // Preparar la consulta para insertar los datos de la rutina en la base de datos
    $stmt = $conn->prepare("INSERT INTO rutinas (cliente_id, tiempo_rutina, musculo, dia, ejercicio, repeticiones) VALUES (?, ?, ?, ?, ?, ?)");

    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Error al preparar la consulta: " . $conn->error]);
        exit;
    }

    // Recorrer los días de la rutina seleccionados y los ejercicios
    $exito = true;
    foreach ($diasEntreno as $dia) {
        foreach ($ejercicios as $index => $ejercicio) {
            $repeticion = $repeticiones[$index];

            // Bind los parámetros para la consulta
            $stmt->bind_param('sssssi', $clienteId, $tiempoRutina, $musculoSeleccionado, $dia, $ejercicio, $repeticion);

            if (!$stmt->execute()) {
                $exito = false;
                break;  // Detener el proceso si ocurre un error
            }
        }
        if (!$exito) {
            break;
        }
    }

    // Verificar si la inserción fue exitosa
    if ($exito) {
        echo json_encode(["status" => "success", "message" => "Rutina guardada correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al guardar los ejercicios"]);
    }

    // Cerrar la declaración y la conexión
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>
