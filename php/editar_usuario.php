<?php
include("conexion.php");

$id = $_POST['id_usuario'];
$nombre = $_POST['nombre'];
$email = $_POST['email'];
$password = $_POST['password'];

if ($password) {
    $sql = "UPDATE usuarios SET nombre='$nombre', email='$email', password='$password' WHERE id_usuario='$id'";
} else {
    $sql = "UPDATE usuarios SET nombre='$nombre', email='$email' WHERE id_usuario='$id'";
}

$conn->query($sql);

echo json_encode(["success" => true]);

$conn->close();
?>