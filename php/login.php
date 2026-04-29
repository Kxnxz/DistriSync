<?php
header("Content-Type: application/json");
include("conexion.php");

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

$sql = "SELECT * FROM usuarios WHERE email = '$email' AND password = '$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $usuario = $result->fetch_assoc();

    echo json_encode([
        "success" => true,
        "usuario" => $usuario
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Credenciales incorrectas"
    ]);
}

$conn->close();
?>