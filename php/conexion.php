<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

function json_response(int $status, array $payload): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

$serverName = $_SERVER['SERVER_NAME'] ?? '';
$serverAddr = $_SERVER['SERVER_ADDR'] ?? '';

$isLocal = $serverName === 'localhost' || $serverName === '127.0.0.1' || $serverAddr === '127.0.0.1' || strpos($serverName, 'localhost') !== false;

if ($isLocal) {
    $dbHost = '127.0.0.1';
    $dbName = 'distri';
    $dbUser = 'root';
    $dbPass = '';
} else {
    $dbHost = 'sql108.infinityfree.com';
    $dbName = 'if0_42262155_distri';
    $dbUser = 'if0_42262155';
    $dbPass = 'TU_CONTRASEÑA_DE_VPANEL';
}

$conn = @new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($conn->connect_error) {
    json_response(500, [
        'success' => false,
        'message' => 'Error de conexión: ' . $conn->connect_error
    ]);
}
?>