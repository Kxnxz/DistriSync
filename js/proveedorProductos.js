window.tos = window.tos || function() {
  console.warn('tos() no está definida, se ignora.');
};

const productos = { todos: [] };

let filtroCategoria = 'todos';
let filtroBusqueda = '';
let filtroProveedor = 'todos';

const categoriaMap = {
  1: 'Piel sensible',
  2: 'Noche',
  3: 'Sérum',
  4: 'Exfoliantes'
};

document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
  const dashboardLink = document.getElementById('dashboardLink');

  if (usuario && usuario.rol === 'admin') {
    dashboardLink.style.display = 'inline';
  }

  if (window.location.protocol === 'file:') {
    const grid = document.getElementById('productosGrid');
    if (grid) {
      grid.innerHTML = `
        <div class="empty-message">
          <p>Abre este catálogo desde tu servidor local (http://localhost/DistriSync) para cargar los productos PHP.</p>
        </div>
      `;
    }
    return;
  }

  const proveedorSeleccionado = localStorage.getItem('proveedorSeleccionado');
  try {
    filtroProveedor = proveedorSeleccionado ? JSON.parse(proveedorSeleccionado) : 'todos';
  } catch {
    filtroProveedor = proveedorSeleccionado || 'todos';
  }

  const titulo = document.getElementById('proveedorTitulo');
  if (titulo) {
    titulo.textContent = filtroProveedor && filtroProveedor !== 'todos'
      ? `Proveedor: ${filtroProveedor}`
      : 'Proveedor: (no definido)';
  }

  cargarProductos();
});

async function cargarProductos() {
  try {
    // Filtramos por el proveedor seleccionado en localStorage (si existe)
    const proveedorSeleccionado = localStorage.getItem('proveedorSeleccionado');
    let proveedorId = '';
    try {
      const parsed = proveedorSeleccionado ? JSON.parse(proveedorSeleccionado) : '';
      // soporta: { id_usuario: 13 } | 13 | '13'
      if (parsed && typeof parsed === 'object' && parsed.id_usuario) proveedorId = parsed.id_usuario;
      else if (parsed !== null && parsed !== undefined) proveedorId = parsed;
    } catch {
      proveedorId = proveedorSeleccionado;
    }

    const url = proveedorId && proveedorId !== 'todos'
      ? `../php/producto.php?action=listar&proveedorId=${encodeURIComponent(proveedorId)}`
      : '../php/producto.php?action=listar';

    const response = await fetch(url);
    const data = await response.json();

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

    const imagenPorCategoria = {
      'Piel sensible': 'crema.png',
      'Noche': 'cremanoche.png',
      'Sérum': 'serum.png',
      'Exfoliantes': 'exfoliante.png'
    };

    productos.todos = data.map(producto => {
      const categoriaNombre =
        categoriaMap[producto.categoria] ||
        producto.categoria ||
        'Sin categoría';

      const imgFromDb = producto.imagen ? String(producto.imagen).trim() : '';
      const esV1 = !imgFromDb || imgFromDb === 'v1.png' || imgFromDb === 'v1' || imgFromDb === 'v1.png ';

      let imagen = '';
      if (!esV1) {
        imagen = imgFromDb.startsWith('imagenes/')
          ? `../${imgFromDb}`
          : `../imagenes/${imgFromDb}`;
      }

      if (!imagen) {
        const archivoPorNombre = imagenesPorNombre[producto.nombre];
        imagen = archivoPorNombre ? `../imagenes/${archivoPorNombre}` : '';
      }

      if (!imagen) {
        const archivoCategoria = imagenPorCategoria[categoriaNombre];
        imagen = archivoCategoria ? `../imagenes/${archivoCategoria}` : '';
      }

      if (!imagen) imagen = '../imagenes/v1.png';

      return {
        ...producto,
        categoriaNombre,
        imagen,
        proveedorNombre: producto.proveedor_nombre || 'Sin proveedor'
      };
    });

    aplicarFiltros();
  } catch (err) {
    console.error(err);
  }
}

function filtrarProductos(categoria) {
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

function aplicarFiltros() {
  const busqueda = filtroBusqueda.trim().toLowerCase();

  const listaFiltrada = productos.todos.filter(prod => {
    const categoriaMatch = filtroCategoria === 'todos' || prod.categoriaNombre.toLowerCase() === filtroCategoria.toLowerCase();
    const proveedorMatch = filtroProveedor === 'todos' || (prod.proveedorNombre || '').toLowerCase() === String(filtroProveedor).toLowerCase();
    const texto = `${prod.nombre} ${prod.descripcion || ''} ${prod.categoriaNombre}`.toLowerCase();
    const busquedaMatch = !busqueda || texto.includes(busqueda);
    return categoriaMatch && proveedorMatch && busquedaMatch;
  });

  mostrarProductosEnGrid(listaFiltrada);
}

function mostrarProductosEnGrid(lista) {
  const grid = document.getElementById('productosGrid');
  if (!grid) return;

  if (!lista || lista.length === 0) {
    grid.innerHTML = `
      <div class="empty-message">
        <p>No hay productos para mostrar en este proveedor.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = `
    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
      ${lista.map(producto => `
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
      `).join('')}
    </div>
  `;
}

function verDetalleProducto(id) {
  const producto = productos.todos.find(p => p.id_producto == id);
  if (!producto) return;

  localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
  window.location.href = 'detalle.html';
}

function agregarAlCarritoSimple(id) {
  const producto = productos.todos.find(p => p.id_producto == id);
  if (!producto) return;

  if (typeof agregarAlCarrito === 'function') {
    agregarAlCarrito(producto);
  } else {
    alert('Carrito no disponible');
  }
}

