<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Configuración de conexión a la base de datos
$servername = "sql309.infinityfree.com";
$username = "if0_37560263";
$password = "Feliceslos321";
$dbname = "if0_37560263_Gimnasio1";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión a la base de datos
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos: " . $conn->connect_error]));
}

try {
    // Consulta SQL para unir las tablas y obtener los datos requeridos
    $sql = "SELECT 
                u.Nombre AS nombre, 
                u.Foto_perfil AS fotoPerfil,
                u.Edad AS edad,
                u.Rol AS rol, 
                d.Identificacion_clien AS identificacion, 
                d.Peso AS peso, 
                d.Medida_Muneca AS medidaMuneca, 
                d.Dias_entreno AS diasEntreno, 
                d.Altura AS altura,
                d.Nivel AS nivel
            FROM detalles_cliente d
            INNER JOIN usuarios u ON d.Identificacion_clien = u.Identificacion";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $usuariosDetalles = [];
        while ($row = $result->fetch_assoc()) {
            $usuariosDetalles[] = [
                "nombre" => $row["nombre"],
                "fotoPerfil" => !empty($row["fotoPerfil"]) ? base64_encode($row["fotoPerfil"]) : null,
                "edad" => $row["edad"],
                "rol" => $row["rol"],
                "identificacion" => $row["identificacion"],
                "peso" => $row["peso"],
                "medidaMuneca" => $row["medidaMuneca"],
                "diasEntreno" => $row["diasEntreno"],
                "altura" => $row["altura"],
                "nivel" => $row["nivel"]
            ];
        }
        echo json_encode(["success" => true, "data" => $usuariosDetalles]);
    } else {
        echo json_encode(["success" => false, "message" => "No se encontraron registros"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} finally {
    $conn->close();
}
?>
