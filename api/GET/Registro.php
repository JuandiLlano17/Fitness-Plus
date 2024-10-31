<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

$servername = "sql309.infinityfree.com";
$username = "if0_37560263";
$password = "Feliceslos321";
$dbname = "if0_37560263_Gimnasio1";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

// Obtener los datos del formulario en formato JSON
$data = json_decode(file_get_contents("php://input"), true);

if ($data && isset($data["tipoUsuario"])) {
    $tipoUsuario = $data["tipoUsuario"];
    $datosPersonales = $data["datosPersonales"];

    // Preparar y ejecutar consulta según el tipo de usuario
    if ($tipoUsuario == "cliente") {
        $stmt = $conn->prepare("INSERT INTO cliente (identificacion, nombre, edad, peso, altura, correo, contrasena, medida_muñeca, dias_entreno) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "ssidsdsss",
            $datosPersonales["identificacion"],
            $datosPersonales["nombre"],
            $datosPersonales["edad"],
            $datosPersonales["peso"],
            $datosPersonales["altura"],
            $datosPersonales["correo"],
            password_hash($datosPersonales["contraseña"], PASSWORD_BCRYPT),
            $datosPersonales["medidaMuñeca"],
            json_encode($datosPersonales["diasEntreno"])
        );
    } elseif ($tipoUsuario == "entrenador") {
        $stmt = $conn->prepare("INSERT INTO entrenador (identificacion, nombre, edad, correo, contrasena) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "ssiss",
            $datosPersonales["identificacion"],
            $datosPersonales["nombre"],
            $datosPersonales["edad"],
            $datosPersonales["correo"],
            password_hash($datosPersonales["contrasena"], PASSWORD_BCRYPT)
        );
    } else {
        echo json_encode(["success" => false, "message" => "Tipo de usuario no válido"]);
        exit;
    }

    // Ejecutar la consulta
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Registro exitoso"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al guardar en la base de datos"]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Datos inválidos o incompletos"]);
}

$conn->close();
?>
