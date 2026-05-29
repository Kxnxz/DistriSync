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
    $sql = "UPDATE usuarios SET nombre='$nombre', email='$email', password='$password' WHERE id_usuario='$id'";
} else {
    $sql = "UPDATE usuarios SET nombre='$nombre', email='$email' WHERE id_usuario='$id'";
}

if ($conn->query($sql)) {
    json_response(200, [
        'success' => true,
        'message' => 'Perfil actualizado'
    ]);
}

json_response(500, [
    'success' => false,
    'message' => $conn->error
]);

$conn->close();
?>