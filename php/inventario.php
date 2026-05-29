<?php
require_once 'conexion.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'listar':
        listarInventario();
        break;
    default:
        json_response(400, ['message' => 'Acción no válida']);
}

function listarInventario() {
    global $conn;

    $query = "SELECT id_producto, nombre, stock, precio FROM productos ORDER BY nombre";
    $result = $conn->query($query);

    if (!$result) {
        json_response(500, ['message' => 'Error en la consulta']);
        return;
    }

    $inventario = [];
    while ($row = $result->fetch_assoc()) {
        $inventario[] = $row;
    }

    $totalProductos = count($inventario);
    $stockTotal = array_sum(array_column($inventario, 'stock'));
    $valorTotal = array_sum(array_map(function($p) { return $p['stock'] * $p['precio']; }, $inventario));

    json_response(200, [
        'productos' => $inventario,
        'totalProductos' => $totalProductos,
        'stockTotal' => $stockTotal,
        'valorTotal' => $valorTotal
    ]);
}
?>