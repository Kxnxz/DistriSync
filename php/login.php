<?php
include("conexion.php");

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    json_response(400, [
        'success' => false,
        'message' => 'Email y contraseña son obligatorios'
    ]);
}

$sql = "SELECT * FROM usuarios WHERE email = '$email' AND password = '$password'";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $usuario = $result->fetch_assoc();
    json_response(200, [
        'success' => true,
        'usuario' => $usuario
    ]);
}

json_response(401, [
    'success' => false,
    'message' => 'Credenciales incorrectas'
]);

$conn->close();
?>