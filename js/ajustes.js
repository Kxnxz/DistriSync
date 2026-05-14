document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formAjustes');
    form.addEventListener('submit', guardarAjustes);
});

async function guardarAjustes(event) {
    event.preventDefault();

    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (!usuario) {
        alert('No hay sesión activa');
        return;
    }

    const tema = document.getElementById('tema').value;
    const notificaciones = document.getElementById('notificaciones').value;

    try {
        const response = await fetch('php/ajustes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id_usuario: usuario.id_usuario,
                tema,
                notificaciones
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('Ajustes guardados correctamente.');
        } else {
            alert(data.message || 'Error guardando ajustes');
        }
    } catch (err) {
        console.error(err);
        alert('Error de conexión');
    }
}
