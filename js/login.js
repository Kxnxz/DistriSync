document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch("php/login.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem("usuarioActivo", JSON.stringify(data.usuario));
            alert("Bienvenido " + data.usuario.nombre);
            window.location.href = "catalogoProductos.html";
        } else {
            alert(data.message || "Datos incorrectos");
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión, revisa consola");
    }
});