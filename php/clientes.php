<?php
header("Content-Type: application/json");
include("conexion.php");

$sql = "
SELECT 
    u.id_usuario,
    u.nombre,
    u.apellido,
    CONCAT(u.nombre, ' ', u.apellido) AS nombre_completo,
    u.email,
    COUNT(v.id_venta) AS compras,
    COALESCE(SUM(v.total), 0) AS total_gastado
FROM usuarios u
LEFT JOIN ventas v ON u.id_usuario = v.id_usuario
WHERE u.rol = 'cliente'
GROUP BY u.id_usuario, u.nombre, u.apellido, u.email
ORDER BY u.nombre ASC
";

$result = $conn->query($sql);

$data = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            "id_usuario" => $row["id_usuario"],
            "nombre" => $row["nombre"],
            "apellido" => $row["apellido"],

            "email" => $row["email"],
            "compras" => (int)$row["compras"],
            "totalGastado" => (float)$row["total_gastado"]
        ];
    }
}

echo json_encode($data);
$conn->close();
?>