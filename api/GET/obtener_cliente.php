<?php
// Conexión a la base de datos
$servername = "sql309.infinityfree.com";
$username = "if0_37560263";
$password = "Feliceslos321";
$dbname = "if0_37560263_Gimnasio1";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

header('Content-Type: application/json');

// Consulta para obtener los datos de la tabla detalles_cliente
$sql = "SELECT Identificacion_clien, Peso, Medida_Muneca, Dias_entreno, Altura FROM detalles_cliente";
$result = $conn->query($sql);

$clientes = [];

if ($result->num_rows > 0) {
    // Llenar los datos de los clientes en el array
    while($row = $result->fetch_assoc()) {
        $clientes[] = [
            "Identificacion" => $row["Identificacion_clien"],
            "Peso" => $row["Peso"],
            "Medida_Muñeca" => $row["Medida_Muneca"],
            "Dias_Entreno" => $row["Dias_entreno"],
            "Altura" => $row["Altura"]
        ];
    }
} else {
    echo json_encode(["message" => "No se encontraron detalles de clientes"]);
}

echo json_encode($clientes);

$conn->close();
?>
