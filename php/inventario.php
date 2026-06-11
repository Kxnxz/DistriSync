<?php
require_once 'conexion.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'listar':
        listarInventario();
        break;
    case 'csv':
        exportarCsv();
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

function exportarCsv() {
    global $conn;

    $query = "SELECT id_producto, nombre, stock, precio FROM productos ORDER BY nombre";
    $result = $conn->query($query);

    if (!$result) {
        http_response_code(500);
        header('Content-Type: text/plain; charset=utf-8');
        echo "Error en la consulta";
        exit;
    }

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="inventario.csv"');

    $out = fopen('php://output', 'w');

    // Cabecera
    fputcsv($out, ['ID', 'Producto', 'Stock', 'Precio']);

    while ($row = $result->fetch_assoc()) {
        fputcsv($out, [
            $row['id_producto'],
            $row['nombre'],
            $row['stock'],
            number_format((float)$row['precio'], 2, '.', '')
        ]);
    }

    fclose($out);
    exit;
}
?>
