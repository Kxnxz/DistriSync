document.addEventListener('DOMContentLoaded', async function() {
    await cargarPedidos();
});

async function cargarPedidos() {
    try {
        const response = await fetch('php/pedidos.php?action=listar');
        const pedidos = await response.json();

        const totalPedidos = pedidos.length;
        const pendientes = pedidos.filter(p => p.estado === 'Pendiente').length;
        const entregados = pedidos.filter(p => p.estado === 'Entregado').length;

        document.getElementById('totalPedidos').textContent = totalPedidos;
        document.getElementById('pedidosPendientes').textContent = pendientes;
        document.getElementById('pedidosEntregados').textContent = entregados;

        const tbody = document.querySelector('#tablaPedidos tbody');
        tbody.innerHTML = pedidos.map(p => `
            <tr>
                <td>${p.id_venta}</td>
                <td>${p.cliente}</td>
                <td>$${Number(p.total).toFixed(2)}</td>
                <td>${p.estado}</td>
                <td>${p.fecha}</td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Error cargando pedidos:', err);
        alert('Error cargando pedidos');
    }
}
