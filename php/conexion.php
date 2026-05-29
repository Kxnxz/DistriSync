<?php
// =====================
// Config DB (ajústalo)
// =====================
$dbHost = 'localhost';
$dbName = 'distri';
$dbUser = 'root';
$dbPass = '';

$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

function json_response(int $status, array $payload): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($conn->connect_error) {
    json_response(500, [
        'success' => false,
        'message' => 'Error de conexión: ' . $conn->connect_error
    ]);
}
?>