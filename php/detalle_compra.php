<?php
require_once 'conexion.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['message' => 'Método no permitido']);
    exit;
}

$id_usuario = $_POST['id_usuario'] ?? '';
$total = $_POST['total'] ?? 0;
$productos_json = $_POST['productos'] ?? '';

if (!$id_usuario || !$productos_json) {
    json_response(400, ['message' => 'Datos incompletos']);
    exit;
}

$productos = json_decode($productos_json, true);
if (!$productos) {
    json_response(400, ['message' => 'Productos inválidos']);
    exit;
}

// Insertar venta
$queryVenta = "INSERT INTO ventas (id_usuario, total, fecha) VALUES (?, ?, NOW())";
$stmtVenta = $conn->prepare($queryVenta);
$stmtVenta->bind_param('id', $id_usuario, $total);

if (!$stmtVenta->execute()) {
    json_response(500, ['message' => 'Error creando venta']);
    exit;
}

$id_venta = $conn->insert_id;

// Insertar detalles
$queryDetalle = "INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio) VALUES (?, ?, ?, ?)";
$stmtDetalle = $conn->prepare($queryDetalle);

foreach ($productos as $prod) {
    $stmtDetalle->bind_param('iiid', $id_venta, $prod['id_producto'], $prod['cantidad'], $prod['precio']);
    if (!$stmtDetalle->execute()) {
        json_response(500, ['message' => 'Error guardando detalle']);
        exit;
    }

    // Actualizar stock
    $queryStock = "UPDATE productos SET stock = stock - ? WHERE id_producto = ?";
    $stmtStock = $conn->prepare($queryStock);
    $stmtStock->bind_param('ii', $prod['cantidad'], $prod['id_producto']);
    $stmtStock->execute();
}

json_response(200, ['success' => true, 'message' => 'Compra procesada', 'id_venta' => $id_venta]);
?>