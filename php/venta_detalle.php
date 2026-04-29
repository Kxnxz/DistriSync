<?php
include("conexion.php");

$id_venta = $_POST['id_venta'];
$id_producto = $_POST['id_producto'];
$cantidad = $_POST['cantidad'];
$precio = $_POST['precio'];

$sql = "INSERT INTO venta_detalle (id_venta, id_producto, cantidad, precio)
        VALUES ('$id_venta', '$id_producto', '$cantidad', '$precio')";

$conn->query($sql);

echo json_encode(["success" => true]);

$conn->close();
?>