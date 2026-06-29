const API_PRODUCTO = '../php/productos_crud.php';

let productosDashboard = [];

// 🔒 PROTEGER DASHBOARD
document.addEventListener("DOMContentLoaded", () => {

    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuario || usuario.rol !== "admin") {

        window.location.href = "catalogoProductos.html";
        return;
    }

    cargarProductos();
});

// 🔥 CAMBIAR SECCIÓN
window.cambiarSeccion = function(seccion, elemento) {

    document.querySelectorAll('.section')
        .forEach(sec => sec.classList.remove('active'));

    const section = document.getElementById(seccion);

    if (section) {
        section.classList.add('active');
    }

    document.querySelectorAll('.sidebar li')
        .forEach(li => li.classList.remove('active'));

    if (elemento) {
        elemento.classList.add('active');
    }

    if (seccion === 'productos') {
        cargarProductos();
    }
};

// 🔥 CARGAR PRODUCTOS
async function cargarProductos() {

    console.log("🚀 Cargando productos...");

    try {
        const response = await fetch(API_PRODUCTO + '?action=listar');
        const data = await response.json();

        console.log("📦 PRODUCTOS MYSQL:");
        console.log(data);

        productosDashboard = data;

        renderProductos(productosDashboard);

    } catch (err) {

        console.error("❌ ERROR CARGANDO:");
        console.error(err);

    };
}

// 🔥 RENDER PRODUCTOS
function renderProductos(lista) {

    const tbody = document.querySelector('#tablaProductos tbody');

    if (!tbody) {
        console.error("❌ No existe #tablaProductos tbody");
        return;
    }

    tbody.innerHTML = '';

    if (!lista || lista.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No hay productos
                </td>
            </tr>
        `;

        return;
    }

    lista.forEach(p => {

        tbody.innerHTML += `
            <tr>
                <td>${p.id_producto}</td>
                <td>${p.nombre}</td>
                <td>${p.categoria}</td>
                <td>$${Number(p.precio).toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>

                    <button onclick="editarProducto(${p.id_producto})">
                        Editar
                    </button>

                    <button onclick="eliminarProducto(${p.id_producto})">
                        Eliminar
                    </button>

                </td>
            </tr>
        `;
    });
}

// 🔥 MOSTRAR MODAL
window.mostrarModal = function(tipo, producto = null) {

    const modal = document.getElementById('modalProducto');

    const titulo = document.getElementById('modalTitulo');

    document.getElementById('formProducto').reset();

    document.getElementById('prodId').value = '';

    if (tipo === 'crear') {

        titulo.textContent = '➕ Agregar Producto';

    } else if (tipo === 'editar' && producto) {

        titulo.textContent = '✏️ Editar Producto';

        document.getElementById('prodId').value = producto.id_producto;

        document.getElementById('prodNombre').value = producto.nombre;

        document.getElementById('prodPrecio').value = producto.precio;

        document.getElementById('prodStock').value = producto.stock;

        document.getElementById('prodCategoria').value = producto.categoria;
    }

    modal.style.display = 'flex';
};

// 🔥 CERRAR MODAL
window.cerrarModal = function() {

    document.getElementById('modalProducto').style.display = 'none';
};

// 🔥 EDITAR PRODUCTO
window.editarProducto = function(id) {

    const producto = productosDashboard.find(p => p.id_producto == id);

    if (!producto) {
        alert("Producto no encontrado");
        return;
    }

    mostrarModal('editar', producto);
};

// 🔥 ELIMINAR PRODUCTO
window.eliminarProducto = function(id) {

    if (!confirm("¿Eliminar producto?")) return;

    const form = new FormData();

    form.append('action', 'eliminar');

    form.append('id', id);

    fetch(API_PRODUCTO, {
        method: 'POST',
        body: form
    })

    .then(res => res.json())

    .then(data => {

        console.log("🗑️ RESPUESTA:");
        console.log(data);

        if (data.success) {

            cargarProductos();

        } else {

            alert(data.error || "Error eliminando");
        }

    })

    .catch(err => {

        console.error(err);

    });
};

// 🔥 GUARDAR PRODUCTO
function guardarProducto() {

    const id = document.getElementById('prodId').value;

    const nombre = document.getElementById('prodNombre').value.trim();

    const precio = document.getElementById('prodPrecio').value;

    const stock = document.getElementById('prodStock').value;

    const categoria = document.getElementById('prodCategoria').value;

    if (!nombre || !precio || !stock || !categoria) {

        alert("Completa todos los campos");
        return;
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

        console.log("💾 RESPUESTA:");
        console.log(data);

        if (data.success) {

            cerrarModal();

            cargarProductos();

        } else {

            alert(data.error || "Error guardando");
        }

    })

    .catch(err => {

        console.error(err);

    });
}

// 🔥 SUBMIT FORM
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById('formProducto');

    if (form) {

        form.addEventListener('submit', function(e) {

            e.preventDefault();

            guardarProducto();
        });
    }
});