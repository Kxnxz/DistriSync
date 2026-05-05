const API_PRODUCTO = 'php/productos_crud.php';
let productosDashboard = [];

window.mostrarModal = function(tipo, producto = null) {
    const modal = document.getElementById('modalProducto');
    const titulo = document.getElementById('modalTitulo');
    const form = document.getElementById('formProducto');
    const prodId = document.getElementById('prodId');

    if (tipo === 'crear') {
        titulo.textContent = '➕ Agregar Nuevo Producto';
        form.reset();
        prodId.value = '';
    } else if (tipo === 'editar' && producto) {
        titulo.textContent = '✏️ Editar Producto';
        prodId.value = producto.id_producto;
        document.getElementById('prodNombre').value = producto.nombre;
        document.getElementById('prodPrecio').value = producto.precio;
        document.getElementById('prodStock').value = producto.stock;
        document.getElementById('prodCategoria').value = producto.categoria || '';
    }

    modal.style.display = 'flex';
    modal.classList.add('active');
}

window.cerrarModal = function() {
    const modal = document.getElementById('modalProducto');
    modal.classList.remove('active');
    modal.style.display = 'none';
}

window.editarProducto = function(id) {
    const producto = productosDashboard.find(p => p.id_producto == id);
    if (!producto) return alert('Producto no encontrado');
    window.mostrarModal('editar', producto);
}

window.eliminarProducto = function(id) {
    if (!confirm('¿Eliminar producto ID ' + id + '?')) return;

    const form = new FormData();
    form.append('action', 'eliminar');
    form.append('id', id);

    fetch(API_PRODUCTO, {
        method: 'POST',
        body: form
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Producto eliminado');
            window.cargarProductos();
        } else {
            alert('Error al eliminar: ' + (data.error || 'Desconocido'));
        }
    })
    .catch(err => {
        console.error(err);
        alert('Error al conectar con el servidor');
    });
}

window.cargarProductos = function() {
    fetch(API_PRODUCTO + '?action=listar')
        .then(res => res.json())
        .then(data => {
            productosDashboard = data;
            const tbody = document.querySelector('#tablaProductos tbody');
            tbody.innerHTML = '';

            if (!Array.isArray(data) || data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px;">No hay productos registrados.</td></tr>';
                return;
            }

            data.forEach(p => {
                tbody.innerHTML += `
                    <tr>
                        <td>${p.id_producto}</td>
                        <td>${p.nombre}</td>
                        <td>${p.categoria}</td>
                        <td>$${Number(p.precio).toFixed(2)}</td>
                        <td>${p.stock}</td>
                        <td>
                            <button onclick="editarProducto(${p.id_producto})">Editar</button>
                            <button onclick="eliminarProducto(${p.id_producto})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(err => {
            console.error('Error cargando productos:', err);
        });
}

function guardarProducto() {
    const id = document.getElementById('prodId').value;
    const nombre = document.getElementById('prodNombre').value.trim();
    const precio = parseFloat(document.getElementById('prodPrecio').value);
    const stock = parseInt(document.getElementById('prodStock').value, 10);
    const categoria = document.getElementById('prodCategoria').value;

    if (!nombre || isNaN(precio) || isNaN(stock) || !categoria) {
        return alert('Completa todos los campos correctamente');
    }

    const form = new FormData();
    form.append('nombre', nombre);
    form.append('precio', precio);
    form.append('stock', stock);
    form.append('categoria', categoria);
    form.append('imagen', 'v1.png');

    if (id) {
        form.append('action', 'editar');
        form.append('id', id);
    } else {
        form.append('action', 'crear');
    }

    fetch(API_PRODUCTO, {
        method: 'POST',
        body: form
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Producto guardado correctamente');
            window.cargarProductos();
            window.cerrarModal();
        } else {
            alert('Error al guardar: ' + (data.error || 'Desconocido'));
        }
    })
    .catch(err => {
        console.error('Error guardando producto:', err);
        alert('Error al conectar con el servidor');
    });
}

// Form submit
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formProducto');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            guardarProducto();
        }
    }
});

// Sidebar navigation
window.cambiarSeccion = function(seccion, elemento) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(seccion).classList.add('active');
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    if (elemento) elemento.classList.add('active');
    if (seccion === 'productos') window.cargarProductos();
}

// Cerrar modal click fuera
document.addEventListener('click', function(e) {
    const modal = document.getElementById('modalProducto');
    if (e.target === modal) window.cerrarModal();
});
