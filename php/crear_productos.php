<?php
header('Content-Type: application/json; charset=utf-8');

include __DIR__ . '/conexion.php';

$nombre = trim($_POST['nombre'] ?? '');
$precio = trim($_POST['precio'] ?? '');
$id_categoria = trim($_POST['id_categoria'] ?? '');
$imagen = trim($_POST['imagen'] ?? 'v1.png');
$stock = trim($_POST['stock'] ?? '0');
$codigo = trim($_POST['codigo'] ?? '');
$color = trim($_POST['color'] ?? '');
$ml = !empty($ml) ? (int) $ml : null;

if ($nombre === '' || $precio === '' || $id_categoria === '') {
    echo json_encode([
        'success' => false,
        'message' => 'Faltan datos'
    ]);
    exit;
}

if (!is_numeric($precio) || !is_numeric($id_categoria) || !is_numeric($stock) || (!empty($ml) && !is_numeric($ml))) {
    echo json_encode([
        'success' => false,
        'message' => 'Datos numéricos inválidos'
    ]);
    exit;
}

$stmt = $conn->prepare(
    'INSERT INTO productos (codigo, nombre, color, ml, precio, id_categoria, imagen, stock)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
);

$stmt->bind_param(
    'ssssdssi',
    $codigo,
    $nombre,
    $color,
    $ml,
    $precio,
    $id_categoria,
    $imagen,
    $stock
);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Producto creado'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => $stmt->error
    ]);
}

$stmt->close();
$conn->close();