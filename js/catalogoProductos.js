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
function cargarProductos() {

    console.log("🚀 Iniciando carga de productos...");

    fetch("php/producto.php?action=listar")

    .then(res => {

        console.log("📡 STATUS:", res.status);
        console.log("📡 HEADERS:", res.headers.get("content-type"));

        return res.text();
    })

    .then(data => {

        console.log("📦 RESPUESTA RAW:");
        console.log(data);

        try {

            const json = JSON.parse(data);

            console.log("✅ JSON PARSEADO:");
            console.log(json);

            productos.todos = json;

            mostrarProductos(json);

        } catch(err) {

            console.error("❌ ERROR PARSEANDO JSON:");
            console.error(err);

        }

    })

    .catch(err => {

        console.error("💀 ERROR FETCH:");
        console.error(err);

    });

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

