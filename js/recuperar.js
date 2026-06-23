

document.getElementById("recoverForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;

    try {

        const response = await fetch("php/recuperar.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        console.log(data);

        if (data.success) {

            alert("Se generó correctamente el enlace de recuperación.");

            const qrContainer = document.getElementById("qrcode");

            qrContainer.innerHTML = "";

            new QRCode(qrContainer, {
                text: data.link,
                width: 220,
                height: 220
            });

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Ocurrió un error.");

    }

});