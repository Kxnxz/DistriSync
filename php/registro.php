<?php
header("Content-Type: application/json");


error_reporting(0);


include(__DIR__ . "/conexion.php");


$nombre = $_POST['nombre'] ?? '';
$apellido = $_POST['apellido'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$rol = $_POST['rol'] ?? 'cliente';


if (!$nombre || !$apellido || !$email || !$password) {
    echo json_encode([
        "success" => false,
        "message" => "Faltan datos"
    ]);
    exit;
}

$check = $conn->query("SELECT id_usuario FROM usuarios WHERE email = '$email'");

if ($check && $check->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Correo ya registrado"
    ]);
    exit;
}


$sql = "INSERT INTO usuarios (nombre, apellido, email, password, rol) 
        VALUES ('$nombre', '$apellido', '$email', '$password', '$rol')";

if ($conn->query($sql)) {
    echo json_encode([
        "success" => true,
        "message" => "Registro exitoso"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
}

$conn->close();
?>