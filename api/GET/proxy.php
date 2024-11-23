<?php
header("Access-Control-Allow-Origin: *"); // Permitir solicitudes desde cualquier origen
header("Content-Type: application/json"); // Responder con JSON

// URL de la API
$url = "http://worldtimeapi.org/api/ip";

// Hacer la solicitud a WorldTimeAPI
$response = file_get_contents($url);

// Verificar si la solicitud tuvo éxito
if ($response === FALSE) {
    http_response_code(500); // Código de error en caso de fallo
    echo json_encode(["success" => false, "message" => "Error al conectarse a WorldTimeAPI"]);
    exit;
}

// Responder al cliente con los datos obtenidos
echo $response;
?>
