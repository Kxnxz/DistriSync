<?php
include("conexion.php");

$id_venta = $_POST['id_venta'] ?? '';
$id_producto = $_POST['id_producto'] ?? '';
$cantidad = $_POST['cantidad'] ?? '';
$precio = $_POST['precio'] ?? '';

if (!$id_venta || !$id_producto || !$cantidad || !$precio) {
    json_response(400, [
        'success' => false,
        'message' => 'Faltan datos para registrar el detalle de venta'
    ]);
}

$sql = "INSERT INTO venta_detalle (id_venta, id_producto, cantidad, precio_unitario)
        VALUES ('$id_venta', '$id_producto', '$cantidad', '$precio')";

if ($conn->query($sql)) {
    json_response(201, ['success' => true]);
}

json_response(500, [
    'success' => false,
    'message' => $conn->error
]);

$conn->close();
?>