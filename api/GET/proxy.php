<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Forzar la IP manualmente (cambia '186.155.13.191' por tu IP pública real)
$ip = "186.155.13.191";
$url = "http://worldtimeapi.org/api/ip/$ip";

// Hacer la solicitud a WorldTimeAPI
$response = file_get_contents($url);

if ($response === FALSE) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al conectarse a WorldTimeAPI"]);
    exit;
}

echo $response;
?>
