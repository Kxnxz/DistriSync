const productos = {
    todos: []
};

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

// 🔥 CARGAR DESDE TU SERVER (Se mantiene igual)
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

// 🔥 MOSTRAR PRODUCTOS (Aquí inyectamos el diseño pro)
function mostrarProductos(lista) {
    // IMPORTANTE: Asegúrate que en tu HTML el ID sea "productosGrid"
    const contenedor = document.getElementById("productosGrid");
    contenedor.innerHTML = "";

    if (!lista || lista.length === 0) {
        contenedor.innerHTML = "<p class='empty-message'>No hay productos disponibles por ahora.</p>";
        return;
    }

    lista.forEach(p => {
        // Creamos la estructura de la tarjeta con tus colores y el diseño de tu compañera
        contenedor.innerHTML += `
            <div class="product-card">
                <div class="product-img">
                    <img src="${p.imagen || 'v1.png'}" alt="${p.nombre}">
                </div>
                <div class="product-info">
                    <span class="product-category">${p.categoria || 'Cosmético'}</span>
                    <h4 class="product-title">${p.nombre}</h4>
                    <p class="product-price">$${Number(p.precio).toLocaleString()}</p>
                    
                    <div class="buttons" style="display: flex; gap: 8px;">
                        <button class="btn-card" style="background: #E7DAF8; color: #4B0082;" 
                                onclick="verDetalleProducto(${p.id_producto})">
                            Ver más
                        </button>
                        
                        <button class="btn-card" 
                                style="background: ${p.stock > 0 ? '#4B0082' : '#ccc'}; color: white;"
                                onclick="agregarAlCarritoSimple(${p.id_producto})"
                                ${p.stock <= 0 ? "disabled" : ""}>
                            ${p.stock > 0 ? "Agregar" : "Agotado"}
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// 🔥 DETALLE (Mantenemos tu lógica de LocalStorage)
function verDetalleProducto(id) {
    const producto = productos.todos.find(p => p.id_producto == id);
    if (!producto) return;

    localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
    window.location.href = "productoDetalle.html";
}

// 🔥 CARRITO (Mantenemos tu lógica de Carrito)
function agregarAlCarritoSimple(id) {
    const producto = productos.todos.find(p => p.id_producto == id);
    if (typeof agregarAlCarrito === "function") {
        agregarAlCarrito(producto);
    } else {
        alert("Carrito no disponible");
    }
}
