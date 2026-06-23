let carrito = [];

function $(id) {
  return document.getElementById(id);
}

function showAlert(msg, ok = false) {
  const alerta = $('alertaPago');
  if (!alerta) return;
  alerta.style.display = 'block';
  alerta.style.background = ok ? '#eaffea' : '#ffe9e9';
  alerta.style.borderColor = ok ? '#95e195' : '#ffb3b3';
  alerta.style.color = ok ? '#0b6b0b' : '#a30000';
  alerta.textContent = msg;
}

function hideAlert() {
  const alerta = $('alertaPago');
  if (!alerta) return;
  alerta.style.display = 'none';
  alerta.textContent = '';
}

function calcularTotales() {
  const subtotalEl = $('subtotal');
  const impuestoEl = $('impuesto');
  const totalEl = $('total');

  const subtotal = carrito.reduce((acc, item) => acc + (Number(item.precio) * item.cantidad), 0);
  const impuesto = subtotal * 0.19;
  const total = subtotal + impuesto;

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (impuestoEl) impuestoEl.textContent = `$${impuesto.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

  return { subtotal, impuesto, total };
}

function cargarCarritoLocal() {
  carrito = JSON.parse(localStorage.getItem('carrito')) || [];
}

function validarForm() {
  const nombre = $('billNombre')?.value?.trim();
  const email = $('billEmail')?.value?.trim();

  if (!nombre) return 'Completa el nombre completo';
  if (!email || !email.includes('@')) return 'Completa el email';

  return null;
}

function obtenerMetodo() {
  const radios = document.querySelectorAll('input[name="metodo"]');
  return Array.from(radios).find(r => r.checked)?.value || 'tarjeta';
}

async function procesarPago() {
  hideAlert();

  cargarCarritoLocal();

  if (!carrito || carrito.length === 0) {
    showAlert('Tu carrito está vacío. Agrega productos antes de pagar.');
    return;
  }

  const errorForm = validarForm();
  if (errorForm) {
    showAlert(errorForm);
    return;
  }

  const { total } = calcularTotales();
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));

  if (!usuario) {
    showAlert('Debes iniciar sesión para pagar.');
    return;
  }

  const metodo = obtenerMetodo();

  // (Demo) Tarjeta/PSE: para no cambiar diseño, el backend usa el mismo endpoint de compra.
  // Guardamos la venta igual.
  try {
    $('btnPagar') && ($('btnPagar').disabled = true);
    $('btnPagar') && ($('btnPagar').textContent = 'Procesando...');

    const response = await fetch('php/pasarela_pago.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        id_usuario: usuario.id_usuario,
        total: total,
        productos: JSON.stringify(carrito),
        metodo: metodo
      })
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      // No intentamos leer response.text() acá para evitar "body stream already read".
      throw new Error('Respuesta no-JSON del servidor');
    }

    if (!data || !data.success) {
      showAlert(data?.message || 'Error al procesar el pago.');
      return;
    }



    // Limpia carrito y vuelve al catálogo (o puedes ir al historial)
    localStorage.setItem('carrito', JSON.stringify([]));
    carrito = [];

    showAlert('Pago aprobado ✅', true);

    setTimeout(() => {
      window.location.href = 'catalogoProductos.html';
    }, 1200);
  } catch (err) {
    console.error(err);
    showAlert('Error de conexión.');
  } finally {
    $('btnPagar') && ($('btnPagar').disabled = false);
    $('btnPagar') && ($('btnPagar').textContent = 'Pagar ahora');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarCarritoLocal();
  calcularTotales();

  const btn = $('btnPagar');
  if (btn) btn.addEventListener('click', procesarPago);

  // Si el usuario selecciona PSE, en esta demo seguimos dejando el formulario igual.
});

