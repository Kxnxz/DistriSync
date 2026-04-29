document.addEventListener('DOMContentLoaded', function() {

    // 🔥 USAR LA CLAVE CORRECTA
    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (!usuario) {
        alert('No hay sesión activa');
        window.location.href = 'LoginDistriSync.html';
        return;
    }

    // Mostrar datos
    document.getElementById('perfilNombre').textContent = usuario.nombre;
    document.getElementById('perfilEmail').textContent = usuario.email;
    document.getElementById('perfilRol').textContent = usuario.admin ? 'Administrador' : 'Cliente';

    // Admin
    const dashboardLink = document.getElementById('dashboardLink');
    if (usuario.admin && dashboardLink) {
        dashboardLink.style.display = 'block';
    }

    // 🔥 CARGAR PEDIDOS DESDE PHP
    cargarPedidos(usuario.id_usuario);

    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
});


// 🔌 PEDIDOS DESDE PHP
function cargarPedidos(idUsuario) {

    fetch(`http://localhost:3000/DistriV4/php/mis_compras.php?id_usuario=${idUsuario}`)
        .then(res => res.json())
        .then(data => {

            const tabla = document.getElementById('ordersTable');

            if (!data || data.length === 0) {
                tabla.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align:center;">No tienes pedidos</td>
                    </tr>
                `;
                return;
            }

            tabla.innerHTML = '';

            data.forEach(venta => {
                tabla.innerHTML += `
                    <tr>
                        <td>#${venta.id_venta}</td>
                        <td>${venta.fecha || '---'}</td>
                        <td>$${Number(venta.total).toFixed(2)}</td>
                        <td>Procesando</td>
                    </tr>
                `;
            });
        })
        .catch(err => console.log(err));
}


// 🔥 EDITAR PERFIL (AHORA CON PHP)
function guardarCambiosPerfil() {

    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));

    const nombre = document.getElementById('editNombre').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const password = document.getElementById('editPassword').value.trim();

    if (!nombre || !email) {
        alert('Nombre y Email obligatorios');
        return;
    }

    fetch(`http://localhost:3000/DistriV4/php/editar_usuario.php`, {
        method: "POST",
        body: new URLSearchParams({
            id_usuario: usuario.id_usuario,
            nombre,
            email,
            password
        })
    })
    .then(res => res.json())
    .then(data => {

        if (data.success) {
            usuario.nombre = nombre;
            usuario.email = email;

            localStorage.setItem('usuarioActivo', JSON.stringify(usuario));

            alert("Perfil actualizado");
            location.reload();
        } else {
            alert("Error al actualizar");
        }
    })
    .catch(err => console.log(err));
}
 
 const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

document.getElementById("perfilRol").textContent = usuario.rol;

// LOGOUT
function logout() {
    localStorage.removeItem('usuarioActivo');
    alert('Sesión cerrada');
    window.location.href = 'LoginDistriSync.html';
}