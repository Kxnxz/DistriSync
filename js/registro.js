console.log("🔥 ESTE ES EL REGISTRO CORRECTO 🔥");


document.getElementById("registroForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!nombre || !email || !password) {
        alert("Todos los campos son obligatorios");
        return;
    }

    fetch("http://localhost:3000/php/registro.php", {
        method: "POST",
        body: new URLSearchParams({
            nombre,
            apellido,
            email,
            password
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);

        if (data.success) {
            alert("Registro exitoso");
            window.location.href = "LoginDistriSync.html";
        } else {
            alert(data.message || "Error en registro");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Error real, revisa consola");

        const rol = document.getElementById("rol").value;

fetch("http://localhost:3000/php/registro.php", {
    method: "POST",
    body: new URLSearchParams({
        nombre,
        apellido,
        email,
        password,
        rol 
    })
})
    });
});