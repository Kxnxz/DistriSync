<?php
require_once 'conexion.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'listar':
        listarPedidos();
        break;
    default:
        json_response(400, ['message' => 'Acción no válida']);
}

function listarPedidos() {
    global $conn;

$query = "SELECT v.id_venta, v.fecha, v.total, u.nombre as cliente
              FROM ventas v
              JOIN usuarios u ON v.id_usuario = u.id_usuario
              ORDER BY v.fecha DESC";

    $result = $conn->query($query);

    if (!$result) {
        json_response(500, ['message' => 'Error en la consulta']);
        return;
    }

    $pedidos = [];
    while ($row = $result->fetch_assoc()) {
        $pedidos[] = $row;
    }

    json_response(200, $pedidos);
}
?>