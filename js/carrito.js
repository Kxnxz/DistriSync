
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
});

// Cargar y mostrar carrito
function cargarCarrito() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');

    if (!cartItems || !emptyCart) return;

    if (carrito.length === 0) {
        cartItems.style.display = 'none';
        emptyCart.style.display = 'block';
    } else {
        cartItems.style.display = 'flex';
        emptyCart.style.display = 'none';
        mostrarItems();
    }

    actualizarTotales();
}

// Mostrar items en el carrito
function mostrarItems() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';

    carrito.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';

        itemElement.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.imagen || '../imagenes/v1.png'}" alt="${item.nombre}">
            </div>

            <div class="cart-item-details">
                <div class="cart-item-name">${item.nombre}</div>
                <div class="cart-item-price">$${Number(item.precio).toFixed(2)}</div>

                <div class="cantidad-control">
                    <button onclick="disminuirCantidad(${index})">-</button>
                    <input type="number" value="${item.cantidad}" readonly>
                    <button onclick="aumentarCantidad(${index})">+</button>
                </div>
            </div>

            <div class="cart-item-subtotal">
                <div class="subtotal-price">
                    $${(Number(item.precio) * item.cantidad).toFixed(2)}
                </div>

                <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">
                    Eliminar
                </button>
            </div>
        `;

        cartItems.appendChild(itemElement);
    });
}

// Aumentar cantidad
function aumentarCantidad(index) {
    carrito[index].cantidad++;
    guardarCarrito();
    cargarCarrito();
}

// Disminuir cantidad
function disminuirCantidad(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
    } else {
        eliminarDelCarrito(index);
    }
    guardarCarrito();
    cargarCarrito();
}

// Eliminar del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    cargarCarrito();
    mostrarNotificacion('Producto eliminado');
}

// Limpiar carrito
function limpiarCarrito() {
    if (confirm('¿Estás seguro de que quieres limpiar el carrito?')) {
        carrito = [];
        guardarCarrito();
        cargarCarrito();
        mostrarNotificacion('Carrito limpiado');
    }
}

// Actualizar carrito
function actualizarCarrito() {
    guardarCarrito();
    cargarCarrito();
    mostrarNotificacion('Carrito actualizado');
}

// Totales
function actualizarTotales() {
    const subtotal = carrito.reduce((sum, item) => sum + (Number(item.precio) * item.cantidad), 0);
    const impuesto = subtotal * 0.19;
    const total = subtotal + impuesto;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('impuesto').textContent = `$${impuesto.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Guardar en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// 🔥 AGREGAR DESDE CATÁLOGO
function agregarAlCarrito(producto) {
    const existe = carrito.find(item => item.id_producto == producto.id_producto);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    guardarCarrito();
    mostrarNotificacion(`${producto.nombre} agregado al carrito 🛒`);
}

// Notificación
function mostrarNotificacion(msg) {
    const notif = document.createElement('div');

    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4B0082;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 1000;
    `;

    notif.textContent = msg;
    document.body.appendChild(notif);

    setTimeout(() => notif.remove(), 2000);
}

// Cantidad total
function obtenerCantidadCarrito() {
    return carrito.reduce((sum, item) => sum + item.cantidad, 0);
}

// 🔥 FINALIZAR COMPRA (YA CON PHP)
async function finalizarCompra() {
    const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (!usuario) {
        mostrarNotificacion("Debes iniciar sesión");
        return;
    }

    if (carrito.length === 0) {
        mostrarNotificacion("El carrito está vacío");
        return;
    }

    const total = carrito.reduce((sum, item) => sum + (Number(item.precio) * item.cantidad), 0);

    try {
        const response = await fetch("../php/detalle_compra.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id_usuario: usuario.id_usuario,
                total: total,
                productos: JSON.stringify(carrito)
            })
        });

        const data = await response.json();

        if (data.success) {
            carrito = [];
            guardarCarrito();
            cargarCarrito();
            mostrarNotificacion("Compra realizada 🧾");
        } else {
            mostrarNotificacion(data.message || "Error al guardar la compra");
        }
    } catch (err) {
        console.error(err);
        mostrarNotificacion("Error de conexión");
    }
}