document.getElementById("recoverForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    try {
        const response = await fetch("../php/recuperar.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message || "Revisa tu correo para continuar con la recuperación.");
        } else {
            alert(data.message || "No se pudo enviar el correo de recuperación.");
        }
    } catch (error) {
        console.error(error);
        alert("Ocurrió un error.");
    }
});
