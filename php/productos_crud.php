<?php
include("conexion.php");

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch($action) {
    case 'listar':
        $sql = "SELECT id_producto, nombre, precio, stock, imagen, id_categoria as categoria FROM productos";
        $result = $conn->query($sql);
        $data = [];
        if ($result) {
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }
        json_response(200, $data);
        break;

    case 'crear':
        $nombre = trim($_POST['nombre'] ?? '');
        $precio = trim($_POST['precio'] ?? '');
        $stock = trim($_POST['stock'] ?? '');
        $categoria = trim($_POST['categoria'] ?? '');
        $imagen = trim($_POST['imagen'] ?? 'v1.png');

        if (empty($nombre) || empty($precio) || empty($stock) || empty($categoria)) {
            json_response(400, ['success' => false, 'error' => 'Faltan datos obligatorios']);
        }

        if (!is_numeric($precio) || !is_numeric($stock) || !is_numeric($categoria)) {
            json_response(400, ['success' => false, 'error' => 'Datos numéricos inválidos']);
        }

        $stmt = $conn->prepare("INSERT INTO productos (nombre, precio, stock, id_categoria, imagen) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param('sdiis', $nombre, $precio, $stock, $categoria, $imagen);

        if ($stmt->execute()) {
            json_response(201, ['success' => true, 'id' => $stmt->insert_id]);
        }

        json_response(500, ['success' => false, 'error' => $stmt->error]);
        $stmt->close();
        break;

    case 'editar':
        $id = trim($_POST['id'] ?? '');
        $nombre = trim($_POST['nombre'] ?? '');
        $precio = trim($_POST['precio'] ?? '');
        $stock = trim($_POST['stock'] ?? '');
        $categoria = trim($_POST['categoria'] ?? '');

        if (empty($id) || empty($nombre) || empty($precio) || empty($stock) || empty($categoria)) {
            json_response(400, ['success' => false, 'error' => 'Faltan datos obligatorios']);
        }

        if (!is_numeric($id) || !is_numeric($precio) || !is_numeric($stock) || !is_numeric($categoria)) {
            json_response(400, ['success' => false, 'error' => 'Datos numéricos inválidos']);
        }

        $stmt = $conn->prepare("UPDATE productos SET nombre=?, precio=?, stock=?, id_categoria=? WHERE id_producto=?");
        $stmt->bind_param('sdiii', $nombre, $precio, $stock, $categoria, $id);

        if ($stmt->execute()) {
            json_response(200, ['success' => true]);
        }

        json_response(500, ['success' => false, 'error' => $stmt->error]);
        $stmt->close();
        break;

    case 'eliminar':
        $id = trim($_POST['id'] ?? '');

        if (empty($id) || !is_numeric($id)) {
            json_response(400, ['success' => false, 'error' => 'ID inválido']);
        }

        $stmt = $conn->prepare("DELETE FROM productos WHERE id_producto=?");
        $stmt->bind_param('i', $id);

        if ($stmt->execute()) {
            json_response(200, ['success' => true, 'message' => 'Producto eliminado']);
        }

        json_response(500, ['success' => false, 'error' => $stmt->error]);
        $stmt->close();
        break;

    default:
        json_response(400, ['success' => false, 'error' => 'Acción no válida']);
        break;
}

$conn->close();
?>

