<?php
include(__DIR__ . "/conexion.php");

// Compatibilidad con el front: el JS llama a php/producto.php?action=listar
$action = isset($_GET['action']) ? trim($_GET['action']) : '';

if ($action !== '' && $action !== 'listar') {
    json_response(400, ['error' => "Acción no válida" ]);
    $conn->close();
    exit;
}

$proveedorId = isset($_GET['proveedorId']) ? trim($_GET['proveedorId']) : '';

// Si proveedorId viene informado, filtramos productos por ese proveedor.
// Esto hace que proveedorProductos.html muestre solo los productos del proveedor.
$sqlBase = "SELECT p.id_producto, p.nombre, p.precio, p.stock, p.imagen, p.id_categoria as categoria,
                   '' as descripcion,
                   u.nombre as proveedor_nombre
            FROM productos p
            LEFT JOIN usuarios u ON u.id_usuario = p.id_proveedor";

$sql = $sqlBase;
if ($proveedorId !== '' && is_numeric($proveedorId)) {
    $sql .= " WHERE p.id_proveedor = " . (int)$proveedorId;
}

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


