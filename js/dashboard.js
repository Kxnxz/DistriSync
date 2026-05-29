const API_PRODUCTO = 'php/productos_crud.php';

const categoriaMap = {
    1: 'Piel sensible',
    2: 'Noche',
    3: 'Sérum',
    4: 'Exfoliantes'
};

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

    document.getElementById(seccion)
        .classList.add('active');

    document.querySelectorAll('.sidebar li')
        .forEach(li => li.classList.remove('active'));

    if (elemento) elemento.classList.add('active');

    if (seccion === 'productos') {
        cargarProductos();
    }
}

// 🔥 CARGAR PRODUCTOS
window.cargarProductos = async function() {

    console.log("🚀 Cargando productos...");

    try {
        const response = await fetch(API_PRODUCTO + '?action=listar');
        const data = await response.json();

        console.log("📦 PRODUCTOS MYSQL:");
        console.log(data);

        productosDashboard = data;

        renderProductos(data);

    } catch (err) {

        console.error("❌ ERROR CARGANDO:");
        console.error(err);

    };

}

// 🔥 RENDER PRODUCTOS
function renderProductos(lista) {

    const tbody = document.querySelector('#tablaProductos tbody');

    tbody.innerHTML = '';

    if (!lista || lista.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    No hay productos
                </td>
            </tr>
        `;

        return;
    }

    lista.forEach(p => {
        const nombreCategoria = categoriaMap[p.categoria] || p.categoria;

        tbody.innerHTML += `
            <tr>
                <td>${p.id_producto}</td>
                <td>${p.nombre}</td>
                <td>${nombreCategoria}</td>
                <td>$${Number(p.precio).toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>
                    <button class="btn-table" onclick="editarProducto(${p.id_producto})">
                        Editar
                    </button>

                    <button class="btn-table btn-delete" onclick="eliminarProducto(${p.id_producto})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}

// 🔥 MODAL CREAR/EDITAR
window.mostrarModal = function(tipo, producto = null) {

    const modal = document.getElementById('modalProducto');

    const titulo = document.getElementById('modalTitulo');

    const form = document.getElementById('formProducto');

    form.reset();

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
}

// 🔥 CERRAR MODAL
window.cerrarModal = function() {

    document.getElementById('modalProducto').style.display = 'none';
}

// 🔥 EDITAR
window.editarProducto = function(id) {

    const producto = productosDashboard.find(p => p.id_producto == id);

    if (!producto) return;

    mostrarModal('editar', producto);
}

// 🔥 ELIMINAR
window.eliminarProducto = async function(id) {

    if (!confirm('¿Eliminar producto?')) return;

    try {
        const response = await fetch(API_PRODUCTO, {
            method: 'POST',
            body: new URLSearchParams({
                action: 'eliminar',
                id: id
            })
        });

        const data = await response.json();

        console.log(data);

        if (data.success) {
            cargarProductos();
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('Error eliminando producto');
    }
}

// 🔥 GUARDAR PRODUCTO
async function guardarProducto() {

    const id = document.getElementById('prodId').value;

    const nombre = document.getElementById('prodNombre').value.trim();

    const precio = document.getElementById('prodPrecio').value;

    const stock = document.getElementById('prodStock').value;

    const categoria = document.getElementById('prodCategoria').value;

    if (!nombre || !precio || !stock || !categoria) {

        alert("Completa todos los campos");

        return;
    }

    try {
        const params = new URLSearchParams({
            nombre,
            precio,
            stock,
            categoria,
            imagen: 'v1.png'
        });

        if (id) {
            params.append('action', 'editar');
            params.append('id', id);
        } else {
            params.append('action', 'crear');
        }

        const response = await fetch(API_PRODUCTO, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const data = await response.json();

        console.log("💾 RESPUESTA SERVER:");
        console.log(data);

        if (data.success) {
            cerrarModal();
            cargarProductos();
        } else {
            alert(data.error || 'Error guardando producto');
        }
    } catch (err) {
        console.error(err);
        alert('Error de conexión');
    }
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