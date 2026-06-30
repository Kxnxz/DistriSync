let usuarioActivo = null;

document.addEventListener('DOMContentLoaded', function() {
    usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (!usuarioActivo) {
        if (typeof mostrarError === 'function') {
            mostrarError('No hay sesión activa');
        }
        window.location.href = 'login.html';
        return;
    }

    mostrarPerfil(usuarioActivo);

    const dashboardLink = document.getElementById('dashboardLink');
    if ((usuarioActivo.admin || usuarioActivo.rol === 'admin') && dashboardLink) {
        dashboardLink.style.display = 'block';
    }

    cargarPedidos(usuarioActivo.id_usuario);

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});

function mostrarPerfil(usuario) {
    document.getElementById('perfilNombre').textContent = usuario.nombre || '-';
    document.getElementById('perfilEmail').textContent = usuario.email || '-';
    document.getElementById('perfilRol').textContent = usuario.admin || usuario.rol === 'admin' ? 'Administrador' : (usuario.rol || 'Cliente');
}

async function cargarPedidos(idUsuario) {
    try {
        const response = await fetch(`../php/mis_compras.php?id_usuario=${idUsuario}`);
        const data = await response.json();
        const tabla = document.getElementById('ordersTable');

        if (!tabla) return;

        if (!Array.isArray(data) || data.length === 0) {
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
                    <td>${venta.productos || '---'}</td>
                    <td>$${Number(venta.total).toFixed(2)}</td>
                    <td>${venta.estado || 'Procesando'}</td>
                </tr>
            `;
        });
    } catch (err) {
        console.error('Error cargando pedidos:', err);
    }
}

function mostrarFormEditar() {
    document.getElementById('editNombre').value = usuarioActivo.nombre || '';
    document.getElementById('editEmail').value = usuarioActivo.email || '';
    document.getElementById('editPassword').value = '';
    document.getElementById('editarCard').style.display = 'block';
}

function cancelarEditar() {
    document.getElementById('editarCard').style.display = 'none';
}

async function guardarCambiosPerfil() {
    const nombre = document.getElementById('editNombre').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const password = document.getElementById('editPassword').value.trim();

    if (!nombre || !email) {
        if (typeof mostrarError === 'function') {
            mostrarError('Nombre y Email obligatorios');
        }
        return;
    }

    try {
        const response = await fetch('../php/editar_usuario.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id_usuario: usuarioActivo.id_usuario,
                nombre,
                email,
                password
            })
        });

        const data = await response.json();

        if (data.success) {
            usuarioActivo.nombre = nombre;
            usuarioActivo.email = email;
            localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
            mostrarPerfil(usuarioActivo);
            cancelarEditar();
            if (typeof mostrarExito === 'function') {
                mostrarExito('Perfil actualizado');
            }
        } else {
            if (typeof mostrarError === 'function') {
                mostrarError(data.message || 'Error actualizando perfil');
            }
        }
    } catch (err) {
        console.error(err);
        if (typeof mostrarError === 'function') {
            mostrarError('Error de conexión');
        }
    }
}

function logout() {
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'login.html';
}

