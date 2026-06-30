document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch("../php/login.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                email,
                password
            })
        });

        const data = await response.json();

        if (data.success) {
            const isAdminLogin = document.body.dataset.admin === 'true';
            if (isAdminLogin && data.usuario.rol !== 'admin') {
                if (typeof mostrarError === 'function') {
                    mostrarError('Acceso restringido: esta página es solo para administradores.');
                } else {
                    alert('Acceso restringido: esta página es solo para administradores.');
                }
                return;
            }

            localStorage.setItem("usuarioActivo", JSON.stringify(data.usuario));
            if (typeof mostrarExito === 'function') {
                mostrarExito(`Bienvenido ${data.usuario.nombre}`);
            }

            const redirect = data.usuario.rol === 'admin' ? 'dashboard.html' : 'catalogo.html';
            setTimeout(() => {
                window.location.href = redirect;
            }, 900);
        } else {
            if (typeof mostrarError === 'function') {
                mostrarError(data.message || "Datos incorrectos");
            } else {
                alert(data.message || "Datos incorrectos");
            }
        }
    } catch (err) {
        console.error(err);
        if (typeof mostrarError === 'function') {
            mostrarError("Error de conexión, revisa consola");
        } else {
            alert("Error de conexión, revisa consola");
        }
    }
});
