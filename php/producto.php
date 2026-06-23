<?php
include(__DIR__ . "/conexion.php");

// Compatibilidad con el front: el JS llama a php/producto.php?action=listar
$action = isset($_GET['action']) ? trim($_GET['action']) : '';

if ($action !== '' && $action !== 'listar') {
    json_response(400, ['error' => "Acción no válida" ]);
    $conn->close();
    exit;
}

$sql = "SELECT id_producto, nombre, precio, stock, imagen, id_categoria as categoria, '' as descripcion FROM productos";
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


