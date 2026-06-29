<?php
require_once 'conexion.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['message' => 'Método no permitido']);
    exit;
}

$id_usuario = $_POST['id_usuario'] ?? '';
$tema = $_POST['tema'] ?? 'claro';
$notificaciones = $_POST['notificaciones'] ?? 'si';

if (!$id_usuario) {
    json_response(400, ['message' => 'ID de usuario requerido']);
    exit;
}

$query = "UPDATE usuarios SET tema = ?, notificaciones = ? WHERE id_usuario = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('ssi', $tema, $notificaciones, $id_usuario);

if ($stmt->execute()) {
    json_response(200, ['success' => true, 'message' => 'Ajustes guardados']);
} else {
    json_response(500, ['message' => 'Error guardando ajustes']);
}
?>