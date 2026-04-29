const productos = {
    todos: []
};

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

// 🔥 CARGAR DESDE TU SERVER
function cargarProductos() {
    fetch("php/producto.php")
    .then(res => res.json())
    .then(data => {
        console.log("RESPUESTA:", data);
        productos.todos = data;
        mostrarProductos(data);
    })
    .catch(err => console.error("Error:", err));
}

// 🔥 MOSTRAR PRODUCTOS
function mostrarProductos(lista) {
    const contenedor = document.getElementById("contenedorProductos");
    contenedor.innerHTML = "";

    if (!lista || lista.length === 0) {
        contenedor.innerHTML = "<p>No hay productos</p>";
        return;
    }

    lista.forEach(p => {
        contenedor.innerHTML += `
            <div class="card">
                <img src="${p.imagen || 'v1.png'}">
                <h4>${p.nombre}</h4>
                <p>$${Number(p.precio).toFixed(2)}</p>

                <button onclick="verDetalleProducto(${p.id_producto})">
                    Ver más
                </button>

                <button onclick="agregarAlCarritoSimple(${p.id_producto})"
                    ${p.stock <= 0 ? "disabled" : ""}>
                    ${p.stock > 0 ? "Agregar" : "Agotado"}
                </button>
            </div>
        `;
    });
}

// 🔥 DETALLE
function verDetalleProducto(id) {
    const producto = productos.todos.find(p => p.id_producto == id);

    if (!producto) return;

    localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
    window.location.href = "productoDetalle.html";
}

// 🔥 CARRITO
function agregarAlCarritoSimple(id) {
    const producto = productos.todos.find(p => p.id_producto == id);

    if (typeof agregarAlCarrito === "function") {
        agregarAlCarrito(producto);
    } else {
        alert("Carrito no disponible");
    }
}