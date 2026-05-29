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
async function cargarPedidos(idUsuario) {
    try {
        const response = await fetch(`php/mis_compras.php?id_usuario=${idUsuario}`);
        const data = await response.json();

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
    } catch (err) {
        console.error('Error cargando pedidos:', err);
    }
}


// 🔥 EDITAR PERFIL (AHORA CON PHP)
async function guardarCambiosPerfil() {
    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));

    const nombre = document.getElementById('editNombre').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const password = document.getElementById('editPassword').value.trim();

    if (!nombre || !email) {
        alert('Nombre y Email obligatorios');
        return;
    }

    try {
        const response = await fetch('php/editar_usuario.php', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id_usuario: usuario.id_usuario,
                nombre,
                email,
                password
            })
        });

        const data = await response.json();

        if (data.success) {
            usuario.nombre = nombre;
            usuario.email = email;
            localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
            alert("Perfil actualizado");
        } else {
            alert(data.message || "Error actualizando perfil");
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión");
    }
}
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