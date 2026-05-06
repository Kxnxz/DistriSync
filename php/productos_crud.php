<?php
header("Content-Type: application/json; charset=utf-8");
include("conexion.php");

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch($action) {
    case 'listar':
        $sql = "SELECT id_producto, nombre, precio, stock, imagen, id_categoria as categoria FROM productos";
        $result = $conn->query($sql);
        $data = [];
        if ($result) {
            while($row = $result->fetch_assoc()) $data[] = $row;
        }
        echo json_encode($data);
        break;
        
    case 'crear':
        $nombre = trim($_POST['nombre'] ?? '');
        $precio = trim($_POST['precio'] ?? '');
        $stock = trim($_POST['stock'] ?? '');
        $categoria = trim($_POST['categoria'] ?? '');
        $imagen = trim($_POST['imagen'] ?? 'v1.png');
        
        if (empty($nombre) || empty($precio) || empty($stock) || empty($categoria)) {
            echo json_encode(['success' => false, 'error' => 'Faltan datos obligatorios']);
            break;
        }
        
        if (!is_numeric($precio) || !is_numeric($stock) || !is_numeric($categoria)) {
            echo json_encode(['success' => false, 'error' => 'Datos numéricos inválidos']);
            break;
        }
        
        $stmt = $conn->prepare("INSERT INTO productos (nombre, precio, stock, id_categoria, imagen) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param('sdiis', $nombre, $precio, $stock, $categoria, $imagen);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        $stmt->close();
        break;
        
    case 'editar':
        $id = trim($_POST['id'] ?? '');
        $nombre = trim($_POST['nombre'] ?? '');
        $precio = trim($_POST['precio'] ?? '');
        $stock = trim($_POST['stock'] ?? '');
        $categoria = trim($_POST['categoria'] ?? '');
        
        if (empty($id) || empty($nombre) || empty($precio) || empty($stock) || empty($categoria)) {
            echo json_encode(['success' => false, 'error' => 'Faltan datos obligatorios']);
            break;
        }
        
        if (!is_numeric($id) || !is_numeric($precio) || !is_numeric($stock) || !is_numeric($categoria)) {
            echo json_encode(['success' => false, 'error' => 'Datos numéricos inválidos']);
            break;
        }
        
        $stmt = $conn->prepare("UPDATE productos SET nombre=?, precio=?, stock=?, id_categoria=? WHERE id_producto=?");
        $stmt->bind_param('sdiii', $nombre, $precio, $stock, $categoria, $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        $stmt->close();
        break;
        
    case 'eliminar':
        $id = trim($_POST['id'] ?? '');
        
        if (empty($id) || !is_numeric($id)) {
            echo json_encode(['success' => false, 'error' => 'ID inválido']);
            break;
        }
        
        $stmt = $conn->prepare("DELETE FROM productos WHERE id_producto=?");
        $stmt->bind_param('i', $id);
        
      if ($stmt->execute()) {

    echo json_encode([
        'success' => true,
        'id' => $stmt->insert_id,
        'mensaje' => 'Producto guardado REALMENTE'
    ]);

} else {

    echo json_encode([
        'success' => false,
        'error' => $stmt->error
    ]);
}
}
$conn->close();
?>

