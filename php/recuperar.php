<?php

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

error_reporting(E_ALL);
ini_set('display_errors', 0);

include(__DIR__ . "/conexion.php");
include(__DIR__ . "/mail_config.php");

require_once(__DIR__ . "/../vendor/phpmailer/phpmailer/src/Exception.php");
require_once(__DIR__ . "/../vendor/phpmailer/phpmailer/src/PHPMailer.php");
require_once(__DIR__ . "/../vendor/phpmailer/phpmailer/src/SMTP.php");

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->email)) {
    json_response(400, [
        "success" => false,
        "message" => "No se recibió el correo electrónico"
    ]);
}

$email = trim($data->email);

if (
    SMTP_USERNAME === 'tu_correo@gmail.com'
    || SMTP_PASSWORD === 'tu_app_password'
    || SMTP_FROM_EMAIL === 'tu_correo@gmail.com'
) {
    json_response(500, [
        "success" => false,
        "message" => "Configura las credenciales SMTP en php/mail_config.php antes de enviar correos"
    ]);
}

$sql = "SELECT id_usuario FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    json_response(500, [
        "success" => false,
        "message" => "Error SQL: " . $conn->error
    ]);
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    json_response(200, [
        "success" => true,
        "message" => "Si el correo existe, enviaremos un enlace de recuperación"
    ]);
}

$token = bin2hex(random_bytes(32));
$expira = date("Y-m-d H:i:s", strtotime("+1 hour"));

$update = $conn->prepare("
    UPDATE usuarios
    SET reset_token = ?, token_expira = ?
    WHERE email = ?
");

if (!$update) {
    json_response(500, [
        "success" => false,
        "message" => "Error UPDATE: " . $conn->error
    ]);
}

$update->bind_param("sss", $token, $expira, $email);

if (!$update->execute()) {
    json_response(500, [
        "success" => false,
        "message" => "No se pudo guardar el token"
    ]);
}

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$basePath = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/\\');
$link = $scheme . "://" . $host . $basePath . "/html/resetear.html?token=" . urlencode($token);

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = SMTP_PORT;
    $mail->CharSet = 'UTF-8';

    $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
    $mail->addAddress($email);

    $mail->isHTML(true);
    $mail->Subject = 'Recuperación de contraseña - DistriSync';
    $mail->Body = "
        <h2>Recuperación de contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña en DistriSync.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <p><a href=\"{$link}\">Restablecer contraseña</a></p>
        <p>Este enlace expira en 1 hora. Si no solicitaste este cambio, ignora este correo.</p>
    ";
    $mail->AltBody = "Recibimos una solicitud para restablecer tu contraseña en DistriSync.\n\n"
        . "Abre este enlace para crear una nueva contraseña: {$link}\n\n"
        . "Este enlace expira en 1 hora. Si no solicitaste este cambio, ignora este correo.";

    $mail->send();

    json_response(200, [
        "success" => true,
        "message" => "Si el correo existe, enviaremos un enlace de recuperación"
    ]);
} catch (Exception $e) {
    error_log("PHPMailer error: " . $mail->ErrorInfo);

    json_response(500, [
        "success" => false,
        "message" => "No se pudo enviar el correo de recuperación"
    ]);
}

$conn->close();

?>
