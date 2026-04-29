<?php
include("conexion.php");

$id = $_GET['id_usuario'];

$sql = "SELECT * FROM ventas WHERE id_usuario = '$id' ORDER BY fecha DESC";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$conn->close();
?>