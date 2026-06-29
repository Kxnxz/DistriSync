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

$stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $usuario = $result->fetch_assoc();

    if (password_verify($password, $usuario['password'])) {
        unset($usuario['password']);

        json_response(200, [
            'success' => true,
            'usuario' => $usuario
        ]);
    }
}

json_response(401, [
    'success' => false,
    'message' => 'Credenciales incorrectas'
]);

$conn->close();
?>
