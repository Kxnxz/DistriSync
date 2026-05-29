<?php
include(__DIR__ . "/conexion.php");

$sql = "SELECT id_producto, nombre, precio, stock, imagen, id_categoria as categoria, '' as descripcion FROM productos";
$result = $conn->query($sql);

$data = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

json_response(200, $data);
$conn->close();
?>

