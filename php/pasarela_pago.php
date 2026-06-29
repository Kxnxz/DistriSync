<?php
require_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['success' => false, 'message' => 'Método no permitido']);
}

$id_usuario = $_POST['id_usuario'] ?? '';
$total = $_POST['total'] ?? 0;
$productos_json = $_POST['productos'] ?? '';

if (!$id_usuario || !$productos_json) {
    json_response(400, ['success' => false, 'message' => 'Datos incompletos']);
}

$productos = json_decode($productos_json, true);
if (!is_array($productos) || count($productos) === 0) {
    json_response(400, ['success' => false, 'message' => 'Productos inválidos']);
}

// Insertar venta
$queryVenta = "INSERT INTO ventas (id_usuario, total, fecha) VALUES (?, ?, NOW())";
$stmtVenta = $conn->prepare($queryVenta);
if (!$stmtVenta) {
    json_response(500, ['success' => false, 'message' => 'Error preparando venta']);
}
$stmtVenta->bind_param('id', $id_usuario, $total);

if (!$stmtVenta->execute()) {
    json_response(500, ['success' => false, 'message' => 'Error creando venta']);
}

$id_venta = $conn->insert_id;

// Insertar detalles (tabla real en la DB: venta_detalle)
$queryDetalle = "INSERT INTO venta_detalle (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)";
$stmtDetalle = $conn->prepare($queryDetalle);
if (!$stmtDetalle) {
    json_response(500, ['success' => false, 'message' => 'Error preparando detalle']);
}


foreach ($productos as $prod) {
    $id_producto = (int)($prod['id_producto'] ?? 0);
    $cantidad = (int)($prod['cantidad'] ?? 0);
    $precio = (float)($prod['precio'] ?? 0);

    if ($id_producto <= 0 || $cantidad <= 0) {
        json_response(400, ['success' => false, 'message' => 'Producto inválido en carrito']);
    }

    $stmtDetalle->bind_param('iiid', $id_venta, $id_producto, $cantidad, $precio);
    if (!$stmtDetalle->execute()) {
        json_response(500, ['success' => false, 'message' => 'Error guardando detalle']);
    }

    // Actualizar stock
    $queryStock = "UPDATE productos SET stock = stock - ? WHERE id_producto = ?";
    $stmtStock = $conn->prepare($queryStock);
    if (!$stmtStock) {
        json_response(500, ['success' => false, 'message' => 'Error preparando stock']);
    }
    $stmtStock->bind_param('ii', $cantidad, $id_producto);
    $stmtStock->execute();
}

json_response(200, ['success' => true, 'message' => 'Pago procesado', 'id_venta' => $id_venta]);

