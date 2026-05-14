const productos = {
    todos: []
};

document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
    const dashboardLink = document.getElementById("dashboardLink");
    if (usuario && usuario.rol === "admin") {
        dashboardLink.style.display = "inline";
    }
    tos();
});

// CARGAR DESDE SERVER
async function cargarProductos() {
    console.log("🚀 Iniciando carga de productos...");

    try {
        const response = await fetch("php/producto.php?action=listar");
        const data = await response.json();

        console.log("📦 PRODUCTOS:", data);

        productos.todos = data;
        mostrarProductos(data);
    } catch (err) {
        console.error("❌ ERROR:", err);
        alert("Error cargando productos");
    }
}

// DETALLE PRODUCTO
function verDetalleProducto(id) {
    const producto = productos.todos.find(p => p.id_producto == id);
    if (!producto) return;

    localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
    window.location.href = "productoDetalle.html";
}

// AGREGAR CARRITO
function agregarAlCarritoSimple(id) {
    const producto = productos.todos.find(p => p.id_producto == id);
    if (typeof agregarAlCarrito === "function") {
        agregarAlCarrito(producto);
    } else {
        alert("Carrito no disponible");
    }
}

