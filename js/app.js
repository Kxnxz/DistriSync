// 🔒 PROTEGER DASHBOARD (solo admin)
document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

    const esDashboard = window.location.pathname.includes("dashboard.html");

    if (esDashboard) {
        if (!usuario || usuario.rol !== "admin") {
            window.location.href = "catalogoProductos.html";
            return;
        }
    }

    // Inicializar
    actualizarEstadisticas();
    renderProductos();
    renderClientes();
    renderVentas();
});


// Datos del sistema
let productos = [
    { id: 1, nombre: "Maquillaje Professional", categoria: "maquillaje", precio: 45.99, stock: 15 },
    { id: 2, nombre: "Skincare Premium", categoria: "skincare", precio: 55.99, stock: 8 },
    { id: 3, nombre: "Hidratación Intensiva", categoria: "hidratacion", precio: 35.99, stock: 20 },
    { id: 4, nombre: "Limpieza Facial Suave", categoria: "limpieza_facial", precio: 29.99, stock: 12 },
    { id: 5, nombre: "Champú Capilar", categoria: "limpieza_capilar", precio: 32.99, stock: 18 },
    { id: 6, nombre: "Spa Treatment", categoria: "spa", precio: 65.99, stock: 5 },
    { id: 7, nombre: "Cuidado Facial Express", categoria: "cuidado_facial", precio: 48.99, stock: 10 },
    { id: 8, nombre: "Belleza Natural", categoria: "belleza_natural", precio: 42.99, stock: 14 }
];

let clientes = [
    { id: 1, nombre: "Juan Pérez", email: "juan@example.com", compras: 5, totalGastado: 245.50 },
    { id: 2, nombre: "María García", email: "maria@example.com", compras: 3, totalGastado: 128.75 },
    { id: 3, nombre: "Carlos López", email: "carlos@example.com", compras: 8, totalGastado: 432.20 },
    { id: 4, nombre: "Ana Martínez", email: "ana@example.com", compras: 2, totalGastado: 95.40 },
    { id: 5, nombre: "Roberto Silva", email: "roberto@example.com", compras: 6, totalGastado: 318.90 }
];

let ventas = [
    { id: 1001, cliente: "Juan Pérez", productos: 2, total: 85.99, fecha: "2025-03-20", estado: "Entregado" },
    { id: 1002, cliente: "María García", productos: 1, total: 55.99, fecha: "2025-03-21", estado: "Enviado" },
    { id: 1003, cliente: "Carlos López", productos: 3, total: 142.50, fecha: "2025-03-22", estado: "Procesando" },
    { id: 1004, cliente: "Ana Martínez", productos: 1, total: 45.99, fecha: "2025-03-23", estado: "Entregado" },
    { id: 1005, cliente: "Roberto Silva", productos: 2, total: 98.50, fecha: "2025-03-24", estado: "Pendiente" }
];

let productoEnEdicion = null;


// === CAMBIAR SECCIÓN ===
function cambiarSeccion(seccion, elemento) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(seccion).classList.add('active');

    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    if (elemento) elemento.classList.add('active');

    if (seccion === 'productos') renderProductos();
    if (seccion === 'clientes') renderClientes();
    if (seccion === 'ventas') renderVentas();
}


// === ESTADÍSTICAS ===
function actualizarEstadisticas() {
    const totalSales = ventas.reduce((sum, v) => sum + v.total, 0);
    const totalOrdenes = ventas.length;
    const totalClientes = clientes.length;
    const ingresosMes = totalSales;
    const productosStock = productos.reduce((sum, p) => sum + p.stock, 0);
    const ordenesPendientes = ventas.filter(v => v.estado === 'Pendiente' || v.estado === 'Procesando').length;

    document.getElementById('totalSales').textContent = `$${totalSales.toFixed(2)}`;
    document.getElementById('totalOrdenes').textContent = totalOrdenes;
    document.getElementById('totalClientes').textContent = totalClientes;
    document.getElementById('ingresosMes').textContent = `$${ingresosMes.toFixed(2)}`;
    document.getElementById('productosStock').textContent = productosStock;
    document.getElementById('ordenesPendientes').textContent = ordenesPendientes;
}


// === PRODUCTOS ===
function renderProductos() {
    const tabla = document.querySelector('#tablaProductos tbody');
    tabla.innerHTML = '';

    productos.forEach((p) => {
        tabla.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.nombre}</td>
                <td>${p.categoria}</td>
                <td>$${p.precio}</td>
                <td>${p.stock}</td>
                <td>
                    <button onclick="editarProducto(${p.id})">Editar</button>
                    <button onclick="eliminarProducto(${p.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function guardarProducto() {
    const nombre = document.getElementById('prodNombre').value.trim();
    const categoria = document.getElementById('prodCategoria').value.trim();
    const precio = parseFloat(document.getElementById('prodPrecio').value);
    const stock = parseInt(document.getElementById('prodStock').value);

    if (!nombre || !categoria || isNaN(precio) || isNaN(stock)) {
        alert("Campos inválidos");
        return;
    }

    if (productoEnEdicion) {
        Object.assign(productoEnEdicion, { nombre, categoria, precio, stock });
    } else {
        const id = productos.length + 1;
        productos.push({ id, nombre, categoria, precio, stock });
    }

    renderProductos();
}


// === CLIENTES ===
function renderClientes() {
    const tabla = document.querySelector('#tablaClientes tbody');
    tabla.innerHTML = '';

    clientes.forEach(c => {
        tabla.innerHTML += `
            <tr>
                <td>${c.id}</td>
                <td>${c.nombre}</td>
                <td>${c.email}</td>
                <td>${c.compras}</td>
                <td>$${c.totalGastado}</td>
            </tr>
        `;
    });
}


// === VENTAS ===
function renderVentas() {
    const tabla = document.querySelector('#tablaVentas tbody');
    tabla.innerHTML = '';

    ventas.forEach(v => {
        tabla.innerHTML += `
            <tr>
                <td>${v.id}</td>
                <td>${v.cliente}</td>
                <td>${v.productos}</td>
                <td>$${v.total}</td>
                <td>${v.estado}</td>
            </tr>
        `;
    });
}


// === FUNCIONES AUX ===
function mostrarProductos() {
    cambiarSeccion('productos');
}

function mostrarClientes() {
    cambiarSeccion('clientes');
}

function mostrarVentas() {
    cambiarSeccion('ventas');
}