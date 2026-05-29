<?php
require_once 'conexion.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'estadisticas':
        obtenerEstadisticas();
        break;
    default:
        json_response(400, ['message' => 'Acción no válida']);
}

function obtenerEstadisticas() {
    global $conn;

    // Ventas totales
    $queryVentas = "SELECT SUM(total) as total FROM ventas";
    $resultVentas = $conn->query($queryVentas);
    $ventas = $resultVentas->fetch_assoc()['total'] ?? 0;

    // Clientes activos
    $queryClientes = "SELECT COUNT(*) as total FROM usuarios WHERE rol = 'cliente'";
    $resultClientes = $conn->query($queryClientes);
    $clientes = $resultClientes->fetch_assoc()['total'] ?? 0;

    // Productos vendidos
    $queryProductos = "SELECT SUM(cantidad) as total FROM detalle_venta";
    $resultProductos = $conn->query($queryProductos);
    $productosVendidos = $resultProductos->fetch_assoc()['total'] ?? 0;

    // Crecimiento (simulado, último mes vs anterior)
    $crecimiento = 12.4; // Placeholder

    // Ticket promedio
    $queryTicket = "SELECT AVG(total) as promedio FROM ventas";
    $resultTicket = $conn->query($queryTicket);
    $ticket = $resultTicket->fetch_assoc()['promedio'] ?? 0;

    json_response(200, [
        'ventasTotales' => $ventas,
        'clientesActivos' => $clientes,
        'productosVendidos' => $productosVendidos,
        'crecimiento' => $crecimiento,
        'ticketPromedio' => $ticket
    ]);
}
?>