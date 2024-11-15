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

// Consulta SQL para unir las tablas detalles_cliente y usuarios
$sql = "
    SELECT 
        usuarios.Nombre, 
        usuarios.Edad, 
        usuarios.Foto_perfil, 
        usuarios.rol,
        detalles_cliente.Medida_Muneca, 
        detalles_cliente.Dias_entreno, 
        detalles_cliente.Peso, 
        detalles_cliente.Altura 
    FROM 
        detalles_cliente
    JOIN 
        usuarios 
    ON 
        detalles_cliente.Identificacion_clien = usuarios.Identificacion_entre
";
$result = $conn->query($sql);

$clientes = [];

if ($result->num_rows > 0) {
    // Llenar los datos de los clientes en el array
    while($row = $result->fetch_assoc()) {
        $clientes[] = [
            "Nombre" => $row["Nombre"],
            "Edad" => $row["Edad"],
            "Foto_perfil" => base64_encode($row["Foto_perfil"]), // Convertir imagen en base64
            "Rol" => $row["rol"],
            "Medida_Muneca" => $row["Medida_Muneca"],
            "Dias_entreno" => $row["Dias_entreno"],
            "Peso" => $row["Peso"],
            "Altura" => $row["Altura"]
        ];
    }
} else {
    echo json_encode(["message" => "No se encontraron datos de clientes y usuarios"]);
}

// Enviar respuesta en JSON
echo json_encode($clientes);

$conn->close();
?>
