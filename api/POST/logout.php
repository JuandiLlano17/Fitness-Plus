<?php
session_start();

// Eliminar todas las variables de sesión
session_unset();

// Destruir la sesión
session_destroy();

// Redirigir a la página principal
header("Location: /index.html"); // Ajusta esta ruta si es necesario
exit;
?>
