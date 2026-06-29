document.addEventListener('DOMContentLoaded', async function () {
  await cargarInventario();

  const btn = document.getElementById('btnExportCsv');
  if (btn) btn.addEventListener('click', exportarCsv);
});

async function cargarInventario() {
  try {
    const response = await fetch('../php/inventario.php?action=listar');
    const data = await response.json();

    document.getElementById('totalItems').textContent = data.totalProductos;
    document.getElementById('stockTotal').textContent = data.stockTotal;
    document.getElementById('valorInventario').textContent = `$${Number(data.valorTotal).toFixed(2)}`;

    const tbody = document.querySelector('#tablaInventario tbody');
    tbody.innerHTML = data.productos
      .map(
        (item) => `
            <tr>
                <td>${item.id_producto}</td>
                <td>${item.nombre}</td>
                <td>${item.stock}</td>
                <td>$${Number(item.precio).toFixed(2)}</td>
            </tr>
        `
      )
      .join('');
  } catch (err) {
    console.error('Error cargando inventario:', err);
    alert('Error cargando inventario');
  }
}

async function exportarCsv() {
  try {
    const res = await fetch('../php/inventario.php?action=csv');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventario.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error exportando CSV:', err);
    alert('Error al exportar CSV');
  }
}

