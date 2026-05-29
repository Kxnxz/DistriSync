<?php
include("conexion.php");

$id = $_GET['id_usuario'] ?? '';

if (!$id) {
    json_response(400, [
        'success' => false,
        'message' => 'id_usuario es requerido'
    ]);
}

$sql = "SELECT * FROM ventas WHERE id_usuario = '$id' ORDER BY fecha DESC";
$result = $conn->query($sql);

$data = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

json_response(200, $data);

$conn->close();
?>