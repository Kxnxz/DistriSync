<?php
include("conexion.php");

$id_venta = $_GET['id_venta'];

$sql = "
SELECT d.*, p.nombre
FROM venta_detalle d
JOIN productos p ON d.id_producto = p.id_producto
WHERE d.id_venta = '$id_venta'
";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
$conn->close();
?>