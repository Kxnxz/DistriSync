<?php
error_reporting(0);
include(__DIR__ . "/conexion.php");

$nombre = $_POST['nombre'] ?? '';
$apellido = $_POST['apellido'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$rol = $_POST['rol'] ?? 'cliente';

if (!$nombre || !$apellido || !$email || !$password) {
    json_response(400, [
        'success' => false,
        'message' => 'Faltan datos'
    ]);
}

$check = $conn->query("SELECT id_usuario FROM usuarios WHERE email = '$email'");

if ($check && $check->num_rows > 0) {
    json_response(409, [
        'success' => false,
        'message' => 'Correo ya registrado'
    ]);
}

$sql = "INSERT INTO usuarios (nombre, apellido, email, password, rol) 
        VALUES ('$nombre', '$apellido', '$email', '$password', '$rol')";

if ($conn->query($sql)) {
    json_response(201, [
        'success' => true,
        'message' => 'Registro exitoso'
    ]);
}

json_response(500, [
    'success' => false,
    'message' => $conn->error
]);

$conn->close();
?>