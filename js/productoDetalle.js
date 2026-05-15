document.addEventListener('DOMContentLoaded', function () {

    const producto = JSON.parse(localStorage.getItem('productoSeleccionado'));

    if (!producto) {
        alert("Producto no encontrado");
        window.location.href = "catalogoProductos.html";
        return;
    }

    cargarDetalle(producto);
});

function cargarDetalle(producto) {

    const categoriaMap = {
        1: 'Piel sensible',
        2: 'Noche',
        3: 'Sérum',
        4: 'Exfoliantes'
    };

    document.getElementById('detalleNombre').textContent = producto.nombre;
    document.getElementById('detalleImagen').src = producto.imagen || 'v1.png';
    document.getElementById('detallePrecio').textContent = `$${Number(producto.precio).toFixed(2)}`;
    document.getElementById('detalleCategoria').textContent = categoriaMap[producto.categoria] || producto.categoria || "Sin categoría";
    document.getElementById('detalleDescripcion').textContent = producto.descripcion || "Sin descripción";

    // 🔥 STOCK BIEN
    const stockEl = document.getElementById('detalleStock');

    if (producto.stock > 0) {
        stockEl.textContent = `Disponible: ${producto.stock}`;
        stockEl.style.color = "green";
    } else {
        stockEl.textContent = "Agotado ❌";
        stockEl.style.color = "red";
    }

    // 🔥 BOTÓN CARRITO
    const btnAgregar = document.getElementById('btnAgregarCarrito');

    btnAgregar.addEventListener('click', () => {
        if (producto.stock <= 0) {
            alert("Sin stock");
            return;
        }

        if (typeof agregarAlCarrito === "function") {
            agregarAlCarrito(producto);
            alert("Producto agregado");
        } else {
            alert("Carrito no disponible");
        }
    });

    // 🔥 IR AL CARRITO
    document.getElementById('btnIrCarrito').addEventListener('click', () => {
        window.location.href = "carrito.html";
    });
}