document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

fetch("php/login.php", {
        method: "POST",
        body: new URLSearchParams({
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);

        if (data.success) {
            // 🔥 guardar sesión correctamente
            localStorage.setItem("usuarioActivo", JSON.stringify(data.usuario));

            alert("Bienvenido " + data.usuario.nombre);

            window.location.href = "catalogoProductos.html";
        } else {
            alert(data.message || "Datos incorrectos");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Error real, revisa consola");
    });
});