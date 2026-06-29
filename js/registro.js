console.log("🔥 ESTE ES EL REGISTRO CORRECTO 🔥");

document.getElementById("registroForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const rol = document.getElementById("rol") ? document.getElementById("rol").value : "cliente";

    if (!nombre || !email || !password) {
        alert("Todos los campos son obligatorios");
        return;
    }

    try {
        const response = await fetch("../php/registro.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                nombre,
                apellido,
                email,
                password,
                rol
            })
        });

        const data = await response.json();

        if (data.success) {
            alert("Registro exitoso");
            window.location.href = "LoginDistriSync.html";
        } else {
            alert(data.message || "Error en registro");
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión, revisa consola");
    }
});