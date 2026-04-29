<?php
header("Content-Type: application/json");
include(__DIR__ . "/conexion.php");

$sql = "SELECT id_producto, nombre, precio, stock, imagen, categoria, descripcion 
        FROM productosdetalles";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
$conn->close();
?>