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

$check = $conn->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();

if ($result && $result->num_rows > 0) {
    json_response(409, [
        'success' => false,
        'message' => 'Correo ya registrado'
    ]);
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $nombre, $apellido, $email, $passwordHash, $rol);

if ($stmt->execute()) {
    json_response(201, [
        'success' => true,
        'message' => 'Registro exitoso'
    ]);
}

json_response(500, [
    'success' => false,
    'message' => $stmt->error ?: $conn->error
]);

$conn->close();
?>
