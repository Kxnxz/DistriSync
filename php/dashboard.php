<?php
require_once 'conexion.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'estadisticas':
        obtenerEstadisticasDashboard();
        break;
    default:
        json_response(400, ['message' => 'Acción no válida']);
}

function obtenerEstadisticasDashboard() {
    global $conn;

    // Total productos
    $queryProductos = "SELECT COUNT(*) as total FROM productos";
    $resultProductos = $conn->query($queryProductos);
    $totalProductos = $resultProductos->fetch_assoc()['total'] ?? 0;

    // Total ventas
    $queryVentas = "SELECT COUNT(*) as total FROM ventas";
    $resultVentas = $conn->query($queryVentas);
    $totalVentas = $resultVentas->fetch_assoc()['total'] ?? 0;

    // Ventas del mes
    $queryVentasMes = "SELECT COUNT(*) as total FROM ventas WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())";
    $resultVentasMes = $conn->query($queryVentasMes);
    $ventasMes = $resultVentasMes->fetch_assoc()['total'] ?? 0;

    // Ingresos totales
    $queryIngresos = "SELECT SUM(total) as total FROM ventas";
    $resultIngresos = $conn->query($queryIngresos);
    $ingresos = $resultIngresos->fetch_assoc()['total'] ?? 0;

    json_response(200, [
        'totalProductos' => $totalProductos,
        'totalVentas' => $totalVentas,
        'ventasMes' => $ventasMes,
        'ingresosTotales' => $ingresos
    ]);
}
?>