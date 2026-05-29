<?php

$conn = new mysqli("localhost", "root", "", "distrisync");

$data = json_decode(file_get_contents("php://input"));

$token = $data->token;
$password = password_hash($data->password, PASSWORD_DEFAULT);

$sql = "SELECT * FROM usuarios 
WHERE reset_token=? 
AND token_expira > NOW()";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $token);
$stmt->execute();

$result = $stmt->get_result();

if($result->num_rows > 0){

    $user = $result->fetch_assoc();

    $update = $conn->prepare("
        UPDATE usuarios 
        SET password=?, reset_token=NULL, token_expira=NULL
        WHERE id=?
    ");

    $update->bind_param("si", $password, $user["id"]);
    $update->execute();

    echo json_encode([
        "message" => "Contraseña actualizada"
    ]);

}else{

    echo json_encode([
        "message" => "Token inválido o expirado"
    ]);
}
?>