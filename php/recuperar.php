<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "distri");

if ($conn->connect_error) {
    die(json_encode([
        "message" => "Error de conexión: " . $conn->connect_error
    ]));
}

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->email)) {
    echo json_encode([
        "message" => "No se recibió el correo electrónico"
    ]);
    exit;
}

$email = trim($data->email);

$sql = "SELECT * FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "message" => "Error SQL: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {

    $token = bin2hex(random_bytes(32));
    $expira = date("Y-m-d H:i:s", strtotime("+1 hour"));

    $update = $conn->prepare("
        UPDATE usuarios
        SET reset_token = ?, token_expira = ?
        WHERE email = ?
    ");

    if (!$update) {
        echo json_encode([
            "message" => "Error UPDATE: " . $conn->error
        ]);
        exit;
    }

    $update->bind_param("sss", $token, $expira, $email);

    if ($update->execute()) {

        $link = "http://localhost/DistriSync-main/resetear.html?token=$token";

        echo json_encode([
            "success" => true,
            "message" => "Enlace generado correctamente",
            "link" => $link
        ]);

    } else {

        echo json_encode([
            "message" => "No se pudo guardar el token"
        ]);

    }

} else {

    echo json_encode([
        "message" => "Correo no encontrado"
    ]);

}

$conn->close();

?>