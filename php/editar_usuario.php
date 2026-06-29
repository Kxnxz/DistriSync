<?php
include("conexion.php");

$id = $_POST['id_usuario'] ?? '';
$nombre = $_POST['nombre'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$id || !$nombre || !$email) {
    json_response(400, [
        'success' => false,
        'message' => 'id_usuario, nombre y email son obligatorios'
    ]);
}

if ($password) {
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE usuarios SET nombre = ?, email = ?, password = ? WHERE id_usuario = ?");
    $stmt->bind_param("sssi", $nombre, $email, $passwordHash, $id);
} else {
    $stmt = $conn->prepare("UPDATE usuarios SET nombre = ?, email = ? WHERE id_usuario = ?");
    $stmt->bind_param("ssi", $nombre, $email, $id);
}

if ($stmt->execute()) {
    json_response(200, [
        'success' => true,
        'message' => 'Perfil actualizado'
    ]);
}

json_response(500, [
    'success' => false,
    'message' => $stmt->error ?: $conn->error
]);

$conn->close();
?>
