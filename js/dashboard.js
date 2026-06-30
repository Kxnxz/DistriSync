const API_PRODUCTO = '../php/productos_crud.php';

const categoriaMap = {
    1: 'Piel sensible',
    2: 'Noche',
    3: 'Sérum',
    4: 'Exfoliantes'
};

const imagenesPorNombre = {
    'Aura Botanical Serum': 'aura.png',
    'Velvet Skin Sérum': 'velvet.png',
    'Pure Glow Exfoliante': 'glow.png',
    'Crema Hidratante': 'crema.png',
    'Crema de Noche': 'cremanoche.png',
    'Aceite de Lavanda': 'lavanda.png',
    'Sérum Facial': 'serum.png',
    'Exfoliante Verde': 'exfoliante.png'
};

let productosDashboard = [];

function cambiarSeccion(id, elemento) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));

    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    if (elemento) elemento.classList.add('active');
}

function mapCategoriaNombre(categoria) {
    const num = typeof categoria === 'string' && categoria.trim() !== '' ? Number(categoria) : categoria;
    return categoriaMap[num] || categoria || 'Sin categoría';
}

function mapImagen(producto) {
    const imgDb = producto.imagen ? String(producto.imagen).trim() : '';

    if (imgDb) {
        if (imgDb.startsWith('imagenes/')) return imgDb;
        return `imagenes/${imgDb}`;
    }

    const archivo = imagenesPorNombre[producto.nombre];
    return archivo ? `imagenes/${archivo}` : 'imagenes/v1.png';
}

async function cargarProductos() {
    try {
        const response = await fetch('../php/producto.php?action=listar');
        if (!response.ok) throw new Error(`Error HTTP productos: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('El servidor no devolvió un arreglo de productos');

        productosDashboard = data.map(p => ({
            ...p,
            categoriaNombre: mapCategoriaNombre(p.categoria),
            imagen: mapImagen(p)
        }));

        renderProductos(productosDashboard);
    } catch (err) {
        console.error('Error cargando productos:', err);

    }
}

function renderProductos(lista) {
    const tbody = document.querySelector('#tablaProductos tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!lista || lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">No hay productos</td>
            </tr>
        `;
        return;
    }

    lista.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id_producto}</td>
                <td>${p.nombre}</td>
                <td>${p.categoriaNombre}</td>
                <td>$${Number(p.precio).toFixed(2)}</td>
                <td>${p.stock}</td>
                <td>
                    <button class="btn-table" onclick="editarProducto(${p.id_producto})">Editar</button>
                    <button class="btn-table btn-delete" onclick="eliminarProducto(${p.id_producto})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

async function cargarClientes() {
    try {
        const response = await fetch('../php/clientes.php');
        if (!response.ok) throw new Error(`Error HTTP clientes: ${response.status}`);

        const data = await response.json();
        const tbody = document.querySelector('#tablaClientes tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (!Array.isArray(data) || data.length === 0) {
            tbody.innerHTML = `
                <tr><td colspan="5" style="text-align:center;">No hay clientes</td></tr>
            `;
            return;
        }

        data.forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td>${c.id_usuario ?? ''}</td>
                    <td>${c.nombre ?? ''} ${c.apellido ?? ''}</td>
                    <td>${c.email ?? ''}</td>
                    <td>${c.compras ?? 0}</td>
                    <td>$${Number(c.totalGastado ?? 0).toFixed(2)}</td>
                </tr>
            `;
        });
    } catch (err) {
        console.error('Error cargando clientes:', err);
    }
}

async function cargarVentas() {
    try {
        const response = await fetch('../php/pedidos.php?action=listar');
        if (!response.ok) throw new Error(`Error HTTP ventas: ${response.status}`);

        const data = await response.json();
        const tbody = document.querySelector('#tablaVentas tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (!Array.isArray(data) || data.length === 0) {
            tbody.innerHTML = `
                <tr><td colspan="5" style="text-align:center;">No hay ventas</td></tr>
            `;
            return;
        }

        data.forEach(v => {
            tbody.innerHTML += `
                <tr>
                    <td>${v.id_venta ?? ''}</td>
                    <td>${v.cliente ?? ''}</td>
                    <td>${v.productos ?? ''}</td>
                    <td>$${Number(v.total ?? 0).toFixed(2)}</td>
                    <td>${v.estado ?? ''}</td>
                </tr>
            `;
        });
    } catch (err) {
        console.error('Error cargando ventas:', err);
    }
}

async function cargarEstadisticas() {
    try {
        const response = await fetch('../php/dashboard.php?action=estadisticas');
        if (!response.ok) throw new Error(`Error HTTP stats: ${response.status}`);

        const data = await response.json();

// MÓDULO: Estadísticas
// Módulo de mapeo de resultados desde PHP hacia los elementos del dashboard (valores mostrados en pantalla).
        const totalSales = document.getElementById('totalSales');
        const totalOrdenes = document.getElementById('totalOrdenes');
        const totalClientes = document.getElementById('totalClientes');
        const ingresosMes = document.getElementById('ingresosMes');
        const productosStock = document.getElementById('productosStock');
        const ordenesPendientes = document.getElementById('ordenesPendientes');

        if (totalSales) totalSales.textContent = `$${Number(data.ingresosTotales ?? 0).toFixed(2)}`;
        if (totalOrdenes) totalOrdenes.textContent = `${Number(data.totalVentas ?? 0)}`;

        // Esto no lo trae el endpoint actual; lo dejamos en 0 hasta que tengamos endpoint.
        // Pero en vez de dejar vacío, lo completamos desde clientes.php.
        if (totalClientes) totalClientes.textContent = '...';
        if (ingresosMes) ingresosMes.textContent = `$${Number(data.ventasMes ?? 0).toFixed(2)}`;

        // Productos en stock: lo calculamos desde productos
        if (productosStock) {
            const r = await fetch('../php/producto.php?action=listar');
            const productos = await r.json();
            const stockTotal = Array.isArray(productos)
                ? productos.reduce((acc, p) => acc + Number(p.stock ?? 0), 0)
                : 0;
            productosStock.textContent = `${stockTotal}`;
        }

        if (ordenesPendientes) ordenesPendientes.textContent = '0';

        // Total clientes desde clientes.php
        if (totalClientes) {
            const rc = await fetch('../php/clientes.php');
            const clientes = await rc.json();
            totalClientes.textContent = `${Array.isArray(clientes) ? clientes.length : 0}`;
        }
    } catch (err) {
        console.error('Error cargando estadísticas:', err);
    }
}

// ===================== MODAL / CRUD PRODUCTOS =====================
window.mostrarModal = function (tipo, producto = null) {
    const modal = document.getElementById('modalProducto');
    const titulo = document.getElementById('modalTitulo');
    const form = document.getElementById('formProducto');

    if (!modal || !titulo || !form) return;

    form.reset();
    document.getElementById('prodId').value = '';

    if (tipo === 'crear') {
        titulo.textContent = 'Agregar producto';

    } else if (tipo === 'editar' && producto) {
        titulo.textContent = 'Editar producto';

        document.getElementById('prodId').value = producto.id_producto;
        document.getElementById('prodNombre').value = producto.nombre;
        document.getElementById('prodPrecio').value = producto.precio;
        document.getElementById('prodStock').value = producto.stock;
        document.getElementById('prodCategoria').value = producto.categoria;
    }

    modal.style.display = 'flex';
};

window.cerrarModal = function () {
    const modal = document.getElementById('modalProducto');
    if (modal) modal.style.display = 'none';
};

window.editarProducto = function (id) {
    const producto = productosDashboard.find(p => p.id_producto == id);
    if (!producto) {
        alert('Producto no encontrado');
        return;
    }
    window.mostrarModal('editar', producto);
};

window.eliminarProducto = async function (id) {
    if (!confirm('¿Eliminar producto?')) return;

    try {
        const response = await fetch(API_PRODUCTO, {
            method: 'POST',
            body: new URLSearchParams({ action: 'eliminar', id })
        });

        const data = await response.json();
        if (data.success) {
            cargarProductos();
        } else {
            alert(data.error || 'Error eliminando producto');
        }
    } catch (err) {
        console.error('❌ Error eliminando producto:', err);
        alert('Error eliminando producto');
    }
};

async function guardarProducto() {
    const id = document.getElementById('prodId').value;
    const nombre = document.getElementById('prodNombre').value.trim();
    const precio = document.getElementById('prodPrecio').value;
    const stock = document.getElementById('prodStock').value;
    const categoria = document.getElementById('prodCategoria').value;

    if (!nombre || precio === '' || stock === '' || !categoria) {
        alert('Completa todos los campos');
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
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        const data = await response.json();
        if (data.success) {
            window.cerrarModal();
            cargarProductos();
        } else {
            alert(data.error || 'Error guardando producto');
        }
    } catch (err) {
        console.error('❌ Error guardando producto:', err);
        alert('Error de conexión');
    }
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (!usuario || usuario.rol !== 'admin') {
        window.location.href = 'catalogo.html';
        return;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('usuarioActivo');
            window.location.href = 'login.html';
        });
    }

    const form = document.getElementById('formProducto');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            guardarProducto();
        });
    }

    // Cargar todo desde BD
    cargarEstadisticas();
    cargarProductos();
    cargarClientes();
    cargarVentas();
});

