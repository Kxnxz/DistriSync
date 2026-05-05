<?php
header("Content-Type: application/json");
include("conexion.php");

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch($action) {
    case 'listar':
        $sql = "SELECT id_producto, nombre, precio, stock, imagen, id_categoria as categoria FROM productos";
        $result = $conn->query($sql);
        $data = [];
        while($row = $result->fetch_assoc()) $data[] = $row;
        echo json_encode($data);
        break;
        
    case 'crear':
        $nombre = $_POST['nombre'];
        $precio = $_POST['precio'];
        $stock = $_POST['stock'];
        $categoria = $_POST['categoria'];
        $imagen = $_POST['imagen'] ?? 'v1.png';
        
        $sql = "INSERT INTO productos (nombre, precio, stock, id_categoria, imagen) VALUES ('$nombre', $precio, $stock, $categoria, '$imagen')";
        if ($conn->query($sql)) {
            echo json_encode(['success' => true, 'id' => $conn->insert_id]);
        } else {
            echo json_encode(['success' => false, 'error' => $conn->error]);
        }
        break;
        
    case 'editar':
        $id = $_POST['id'];
        $nombre = $_POST['nombre'];
        $precio = $_POST['precio'];
        $stock = $_POST['stock'];
        $categoria = $_POST['categoria'];
        
        $sql = "UPDATE productos SET nombre='$nombre', precio=$precio, stock=$stock, id_categoria=$categoria WHERE id_producto=$id";
        if ($conn->query($sql)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $conn->error]);
        }
        break;
        
    case 'eliminar':
        $id = $_POST['id'];
        $sql = "DELETE FROM productos WHERE id_producto=$id";
        if ($conn->query($sql)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $conn->error]);
        }
        break;
}

$conn->close();
?>

