document.addEventListener('DOMContentLoaded', async function() {
    await cargarInventario();
});

async function cargarInventario() {
    try {
        const response = await fetch('php/inventario.php?action=listar');
        const data = await response.json();

        document.getElementById('totalItems').textContent = data.totalProductos;
        document.getElementById('stockTotal').textContent = data.stockTotal;
        document.getElementById('valorInventario').textContent = `$${Number(data.valorTotal).toFixed(2)}`;

        const tbody = document.querySelector('#tablaInventario tbody');
        tbody.innerHTML = data.productos.map(item => `
            <tr>
                <td>${item.id_producto}</td>
                <td>${item.nombre}</td>
                <td>${item.stock}</td>
                <td>$${Number(item.precio).toFixed(2)}</td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Error cargando inventario:', err);
        alert('Error cargando inventario');
    }
}
