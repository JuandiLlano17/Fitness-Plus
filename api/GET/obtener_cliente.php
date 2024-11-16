<?php
header('Content-Type: application/json');

// Configuración de la conexión
$servername = "sql309.infinityfree.com";
$username = "if0_37560263";
$password = "Feliceslos321";
$dbname = "if0_37560263_Gimnasio1";

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['error' => 'Conexión fallida: ' . $conn->connect_error]));
}

// Consulta SQL para obtener los datos del cliente
$sql = "SELECT Identificacion_clien, Peso, Medida_Muneca, Dias_entreno, Altura FROM detalles_cliente";
$result = $conn->query($sql);

$clientes = [];

if ($result->num_rows > 0) {
    // Recorrer los resultados y almacenarlos en un array
    while ($row = $result->fetch_assoc()) {
        $clientes[] = [
            'Identificacion' => $row['Identificacion_clien'],
            'Peso' => $row['Peso'],
            'Medida_Muneca' => $row['Medida_Muneca'],
            'Dias_entreno' => $row['Dias_entreno'],
            'Altura' => $row['Altura']
        ];
    }
} else {
    echo json_encode(['message' => 'No se encontraron clientes']);
    exit;
}

// Enviar los datos como JSON
echo json_encode($clientes);
$conn->close();
