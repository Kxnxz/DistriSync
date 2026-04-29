<?php
include("conexion.php");

$nombre = $_POST['nombre'];
$precio = $_POST['precio'];
$categoria = $_POST['categoria'];

$sql = "INSERT INTO productos (nombre, precio, id_categoria)
VALUES ('$nombre', '$precio', '$categoria')";

$conn->query($sql);

echo json_encode(["success" => true]);
?>