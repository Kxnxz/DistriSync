window.tos = window.tos || function() {
    console.warn('tos() no está definida, se ignora.');
};

const productos = {
    todos: []
};

let filtroCategoria = 'todos';
let filtroBusqueda = '';

const categoriaMap = {
    1: 'Piel sensible',
    2: 'Noche',
    3: 'Sérum',
    4: 'Exfoliantes'
};

document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
    const dashboardLink = document.getElementById("dashboardLink");

    if (usuario && usuario.rol === "admin") {
        dashboardLink.style.display = "inline";
    }

    if (window.location.protocol === 'file:') {
        const grid = document.getElementById("productosGrid");
        if (grid) {
            grid.innerHTML = `
                <div class="empty-message">
                    <p>Abre este catálogo desde tu servidor local (http://localhost/DistriV4) para cargar los productos PHP.</p>
                </div>
            `;
        }
        return;
    }

    cargarProductos();
});

// CARGAR DESDE SERVER
// CARGAR DESDE SERVER
async function cargarProductos() {
    console.log("🚀 Iniciando carga de productos...");

    try {
        const response = await fetch("php/producto.php?action=listar");
        const data = await response.json();

        console.log("📦 PRODUCTOS:", data);

        // Relación nombre del producto -> imagen
        // Nota: aquí deben coincidir EXACTO los nombres que devuelve la BD (producto.nombre)
        const imagenesPorNombre = {
            'Místico Crema de Noche': 'cremanoche.png',
            'Minimal Sérum Facial': 'serum.png',
            'Lavanda Dreams Aceite': 'lavanda.png',
            'Antracita Exfoliante': 'exfoliante.png',
            'Aura Hidratante': 'aura.png',
            'Velvet Skin Sérum': 'velvet.png',
            'Pure Glow Exfoliante': 'glow.png',
            'Crema sin imagen': 'crema.png'
        };

        productos.todos = data.map(producto => {
            const categoriaNombre =
                categoriaMap[producto.categoria]
                || producto.categoria
                || 'Sin categoría';

            const imgFromDb = producto.imagen ? String(producto.imagen).trim() : '';

            // Defaults por categoría (si la BD trae v1.png o una imagen vacía)
            const imagenPorCategoria = {
                'Piel sensible': 'crema.png',
                'Noche': 'cremanoche.png',
                'Sérum': 'serum.png',
                'Exfoliantes': 'exfoliante.png'
            };

            // 1) Si la BD trae una ruta o un nombre de archivo válido, lo respetamos
            // 2) Si trae v1.png o viene vacío, resolvemos con fallback por NOMBRE (prioridad)
            const esV1 = !imgFromDb || imgFromDb === 'v1.png' || imgFromDb === 'v1' || imgFromDb === 'v1.png ';

            let imagen = '';

            if (!esV1) {
                imagen = imgFromDb.startsWith('imagenes/')
                    ? imgFromDb
                    : `imagenes/${imgFromDb}`;
            }

            // Fallback 2: por NOMBRE (prioridad para evitar que se repitan)
            if (!imagen) {
                const archivoPorNombre = imagenesPorNombre[producto.nombre];
                imagen = archivoPorNombre ? `imagenes/${archivoPorNombre}` : '';
            }

            // Fallback 3: por categoría (último recurso antes del final)
            if (!imagen) {
                const archivoCategoria = imagenPorCategoria[categoriaNombre];
                imagen = archivoCategoria ? `imagenes/${archivoCategoria}` : '';
            }

            // Fallback final
            if (!imagen) imagen = 'imagenes/v1.png';

            return {
                ...producto,
                categoriaNombre,
                imagen
            };
        });


        // Si hay filtros, aplicarlos; si no existe aplicarFiltros, renderizamos directo.
        if (typeof aplicarFiltros === 'function') {
            aplicarFiltros();
        } else {
            mostrarProductos(productos.todos);
            mostrarDestacados(productos.todos);
        }

    } catch (err) {


        console.error("❌ ERROR:", err);

        alert("Error cargando productos");
    }
}

function mostrarProductos(lista) {
    const grid = document.getElementById("productosGrid");

    if (!grid) return;

    if (!lista || lista.length === 0) {
        grid.innerHTML = `
            <div class="empty-message">
                <p>No hay productos para mostrar.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = lista.map(producto => `
        <div class="product-card">
            <div class="product-img">
                <img src="${producto.imagen || 'v1.png'}" alt="${producto.nombre}">
            </div>
            <div class="product-info">
                <span class="product-category">${producto.categoriaNombre}</span>
                <h3 class="product-title">${producto.nombre}</h3>
                <p class="product-price">${Number(producto.precio).toFixed(2)}</p>
                <p class="stock">${producto.stock > 0 ? `Disponible: ${producto.stock}` : 'Agotado'}</p>
                <p class="product-description">${producto.descripcion || 'Sin descripción disponible.'}</p>
                <button class="btn-card" onclick="verDetalleProducto(${producto.id_producto})">Ver detalle</button>
                <button class="btn-card" onclick="agregarAlCarritoSimple(${producto.id_producto})">Agregar al carrito</button>
            </div>
        </div>
    `).join('');
    mostrarDestacados(lista);
}

function mostrarDestacados(lista) {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;

    const destacados = [...lista]
        .sort((a, b) => b.stock - a.stock)
        .slice(0, 4);

    if (destacados.length === 0) {
        grid.innerHTML = `<p style="color:#6e4d80; text-align:center; width:100%;">No hay productos destacados por ahora.</p>`;
        return;
    }

    grid.innerHTML = destacados.map(producto => {
        const badge = getBadge(producto);
        return `
            <div class="featured-card">
                ${badge ? `<span class="product-badge ${badge.class}">${badge.label}</span>` : ''}
                <h3>${producto.nombre}</h3>
                <p>${producto.categoriaNombre} · $${Number(producto.precio).toFixed(2)}</p>
                <p>${producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin stock'}</p>
                <button class="btn-card" style="width:100%;" onclick="verDetalleProducto(${producto.id_producto})">Ver detalle</button>
            </div>
        `;
    }).join('');
}

function getBadge(producto) {
    if (producto.stock === 0) {
        return { label: 'Agotado', class: 'agotado' };
    }
    if (producto.precio <= 25) {
        return { label: 'Oferta', class: 'oferta' };
    }
    if (producto.categoriaNombre === 'Sérum') {
        return { label: 'Top', class: 'nuevo' };
    }
    return null;
}

function filtrarProductos(categoria) {
    filtroCategoria = categoria;
    const botones = document.querySelectorAll('.tab-btn');

    botones.forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim() === categoria || (categoria === 'todos' && btn.textContent.trim().includes('Todos')));
    });

    aplicarFiltros();
}

function buscarProductos(query) {
    filtroBusqueda = query;
    aplicarFiltros();
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
    if (!producto) return;

    if (typeof agregarAlCarrito === "function") {
        agregarAlCarrito(producto);
    } else {
        alert("Carrito no disponible");
    }
}

