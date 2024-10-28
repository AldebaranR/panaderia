<?php
$servername = "localhost";
$username = "root";
$password = "n0m3l0";
$dbname = "panaderia";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Comprobar conexión
if ($conn->connect_error) {
    http_response_code(500);
    die("Conexión fallida: " . $conn->connect_error);
}
?>
