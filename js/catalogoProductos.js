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

let filtroProveedor = 'todos';
let proveedores = [];

// Tabs de proveedores NO se usan en el modo catálogo (solo cards en proveedoresGrid).
function renderTabsProveedores() {
    const container = document.getElementById('proveedorTabs');
    if (!container) return;
    container.style.display = 'none';
}



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
    // Cargar productos (incluye proveedor_nombre si existe)
    console.log("Iniciando carga de productos...");

    try {
        const response = await fetch("../php/producto.php?action=listar");
        const data = await response.json();

        console.log("PRODUCTOS:", data);

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

        // Inicializar filtros de proveedor
        const nombresProveedores = Array.from(
            new Set(
                data.map(p => (p.proveedor_nombre ? String(p.proveedor_nombre).trim() : '').trim())
            ).values()
        ).filter(Boolean);
        proveedores = nombresProveedores;



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
                    ? `../${imgFromDb}`
                    : `../imagenes/${imgFromDb}`;
            }

            // Fallback 2: por NOMBRE (prioridad para evitar que se repitan)
            if (!imagen) {
                const archivoPorNombre = imagenesPorNombre[producto.nombre];
                imagen = archivoPorNombre ? `../imagenes/${archivoPorNombre}` : '';
            }

            // Fallback 3: por categoría (último recurso antes del final)
            if (!imagen) {
                const archivoCategoria = imagenPorCategoria[categoriaNombre];
                imagen = archivoCategoria ? `../imagenes/${archivoCategoria}` : '';
            }

            // Fallback final
            if (!imagen) imagen = '../imagenes/v1.png';

            return {
                ...producto,
                categoriaNombre,
                imagen,
                proveedorNombre: producto.proveedor_nombre || 'Sin proveedor'
            };
        });


        // En catálogo mostramos SOLO proveedores. No renderizamos las cards de productos.
        // (El proveedor -> proveedorProductos.html ya renderiza sus productos.)

        proveedores = nombresProveedores;
        renderTabsProveedores();

        // Top 3 (productos más “vendidos”/disponibles por stock)
        const destacados = [...data]
            .sort((a,b) => (Number(b.stock)||0) - (Number(a.stock)||0))
            .slice(0,3);

        const featuredGrid = document.getElementById('featuredGrid');
        if (featuredGrid) {
            featuredGrid.innerHTML = destacados.map(prod => {
                const categoriaNombre = categoriaMap[prod.categoria] || prod.categoria || 'Sin categoría';
                const imgFromDb = prod.imagen ? String(prod.imagen).trim() : '';
                const esV1 = !imgFromDb || imgFromDb === 'v1.png' || imgFromDb === 'v1' || imgFromDb === 'v1.png ';
                let imagen = '';
                if (!esV1) {
                    imagen = imgFromDb.startsWith('imagenes/') ? `../${imgFromDb}` : `../imagenes/${imgFromDb}`;
                }
                if (!imagen) imagen = '../imagenes/v1.png';

                return `
                    <div class="featured-card">
                        <h3>${prod.nombre}</h3>
                        <p>${categoriaNombre} · $${Number(prod.precio).toFixed(2)}</p>
                        <p>${Number(prod.stock) > 0 ? `Stock: ${prod.stock}` : 'Sin stock'}</p>
                        <button class="btn-card" style="width:100%;" onclick="verDetalleProducto(${prod.id_producto})">Ver detalle</button>
                    </div>
                `;
            }).join('');
        }

        // CTA modo proveedores
        window.setModoProveedores = function(modo){

            filtroProveedor = 'todos';

            const btnProveedores = document.getElementById('btnProveedores');
            const btnMejores = document.getElementById('btnMejores');

            if (btnProveedores) btnProveedores.classList.toggle('active', modo === 'todos');
            if (btnMejores) btnMejores.classList.toggle('active', modo === 'mejores');

            renderProveedoresCards(modo);
        }

        function renderProveedoresCards(modo){
            const gridProv = document.getElementById('proveedoresGrid');
            if (!gridProv) return;

            if (!proveedores.length) {
                gridProv.innerHTML = `
                    <div class="empty-message">
                        <p>No hay proveedores disponibles.</p>
                    </div>
                `;
                return;
            }

            // Para “mejores proveedores” sin tabla extra, usamos heurística: total de stock por proveedor.
            const stockPorProveedor = proveedores.reduce((acc, prov) => {
                const prods = productos.todos.filter(x => (x.proveedorNombre || '') === prov);
                const totalStock = prods.reduce((s, x) => s + (Number(x.stock) || 0), 0);
                acc[prov] = totalStock;
                return acc;
            }, {});

            let lista = [...proveedores];
            if (modo === 'mejores') {
                lista = lista
                    .sort((a,b) => (stockPorProveedor[b] || 0) - (stockPorProveedor[a] || 0))
                    .slice(0, 6);
            }

            // Foto: no tenemos imagen de proveedor en el JSON, así que usamos avatar con iniciales.
            gridProv.innerHTML = lista.map(p => {
                const inicial = String(p).trim().slice(0,1).toUpperCase();
                return `
                    <div class="provider-card" onclick="irAProveedor('${p}')" role="button" tabindex="0">
                        <div class="provider-card-inner">
                            <div class="provider-card-top">
                                <div class="provider-avatar">${inicial}</div>
                                <div>
                                    <div class="provider-card-name">${p}</div>
                                    <div class="provider-card-sub">Ver productos</div>
                                </div>
                            </div>
                            <div class="provider-card-bot">
                                <span class="provider-card-sub">Stock total: ${stockPorProveedor[p] || 0}</span>
                                <span class="provider-card-btn">Ir</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Render inicial
        renderProveedoresCards('todos');




    } catch (err) {
        console.error("ERROR:", err);
        if (typeof mostrarError === 'function') {
            mostrarError("Error cargando productos");
        }
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
                <img src="${producto.imagen || '../imagenes/v1.png'}" alt="${producto.nombre}">
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
    // Filtrar por categoría (existe ya)

    filtroCategoria = categoria;
    const botones = document.querySelectorAll('.tab-btn');

    botones.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === categoria.toLowerCase());
    });

    aplicarFiltros();
}

function buscarProductos(query) {
    filtroBusqueda = query;
    aplicarFiltros();
}

function filtrarPorProveedor(proveedor) {
    filtroProveedor = proveedor;
    // En modo catálogo (solo proveedores) no aplicamos filtros de productos.
}


// Redirect: proveedor -> su propia vista
function irAProveedor(proveedor) {
    filtroProveedor = proveedor;
    // Guardamos en localStorage para que el HTML destino cargue el proveedor
    localStorage.setItem('proveedorSeleccionado', JSON.stringify(proveedor));
    window.location.href = 'proveedorProductos.html';
}


function aplicarFiltros() {
    const busqueda = filtroBusqueda.trim().toLowerCase();

    const listaFiltrada = productos.todos.filter(prod => {
        const categoriaMatch = filtroCategoria === 'todos' || prod.categoriaNombre.toLowerCase() === filtroCategoria.toLowerCase();
        const proveedorMatch = filtroProveedor === 'todos' || (prod.proveedorNombre || '').toLowerCase() === filtroProveedor.toLowerCase();
        const texto = `${prod.nombre} ${prod.descripcion || ''} ${prod.categoriaNombre}`.toLowerCase();
        const busquedaMatch = !busqueda || texto.includes(busqueda);
        return categoriaMatch && proveedorMatch && busquedaMatch;
    });

    // Render por secciones (proveedor)
    mostrarProductosAgrupadosPorProveedor(listaFiltrada);
}

function mostrarProductosAgrupadosPorProveedor(lista) {


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

    // Agrupar por proveedor
    const mapa = new Map();
    lista.forEach(p => {
        const prov = p.proveedorNombre || 'Sin proveedor';
        if (!mapa.has(prov)) mapa.set(prov, []);
        mapa.get(prov).push(p);
    });

    // Ordenar secciones por stock total (opcional, pero queda “bonito”)
    const secciones = Array.from(mapa.entries()).sort((a, b) => {
        const stockA = a[1].reduce((sum, x) => sum + (x.stock || 0), 0);
        const stockB = b[1].reduce((sum, x) => sum + (x.stock || 0), 0);
        return stockB - stockA;
    });

    grid.innerHTML = secciones.map(([proveedor, productosProv]) => {

        // Tarjetas internas
        const cards = productosProv.map(producto => `
            <div class="product-card product-card-compact">
                <div class="product-img">
                    <img src="${producto.imagen || '../imagenes/v1.png'}" alt="${producto.nombre}">
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

        return `
            <section class="provider-block">
                <header class="provider-header">
                    <div class="provider-title">
                        <span class="provider-label">PROVEEDOR</span>
                        <h2 class="provider-name">${proveedor}</h2>
                    </div>
                    <div class="provider-stats">
                        <span class="provider-count">${productosProv.length} productos</span>
                        <span class="provider-stock">Stock total: ${productosProv.reduce((s, x) => s + (x.stock || 0), 0)}</span>
                    </div>
                </header>
                <div class="provider-products-grid">
                    ${cards}
                </div>
            </section>
        `;
    }).join('');

    mostrarDestacados(lista);
}


// DETALLE PRODUCTO
function verDetalleProducto(id) {
    const producto = productos.todos.find(p => p.id_producto == id);
    if (!producto) return;

    localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
    window.location.href = "detalle.html";
}

// AGREGAR CARRITO
function agregarAlCarritoSimple(id) {
    const producto = productos.todos.find(p => p.id_producto == id);
    if (!producto) return;

    if (typeof agregarAlCarrito === "function") {
        agregarAlCarrito(producto);
    } else if (typeof mostrarError === 'function') {
        mostrarError("Carrito no disponible");
    } else {
        alert("Carrito no disponible");
    }
}


