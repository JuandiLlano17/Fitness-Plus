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

// Consulta para obtener los datos de los clientes
$sql = "SELECT Nombre, Edad, Foto_Perfil, Medida_Muñeca, Dias_Entreno FROM cliente";
$result = $conn->query($sql);

$clientes = [];

if ($result->num_rows > 0) {
    // Llenar los datos de los clientes en el array
    while($row = $result->fetch_assoc()) {
        $clientes[] = [
            "Nombre" => $row["Nombre"],
            "Edad" => $row["Edad"],
            "Foto_Perfil" => $row["Foto_Perfil"], // Corregido aquí
            "Medida_Muñeca" => $row["Medida_Muñeca"],
            "Dias_Entreno" => $row["Dias_Entreno"]
        ];
    }
} else {
    echo json_encode(["message" => "No se encontraron clientes"]);
}

echo json_encode($clientes);

$conn->close();
?>