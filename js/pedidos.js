document.addEventListener('DOMContentLoaded', function() {
    const pedidos = [
        { id: 101, cliente: 'Ana Martínez', total: 89.99, estado: 'Entregado', fecha: '2026-05-02' },
        { id: 102, cliente: 'Carlos López', total: 120.90, estado: 'Pendiente', fecha: '2026-05-03' },
        { id: 103, cliente: 'María García', total: 55.99, estado: 'Enviado', fecha: '2026-05-04' }
    ];

    const totalPedidos = pedidos.length;
    const pendientes = pedidos.filter(p => p.estado === 'Pendiente').length;
    const entregados = pedidos.filter(p => p.estado === 'Entregado').length;

    document.getElementById('totalPedidos').textContent = totalPedidos;
    document.getElementById('pedidosPendientes').textContent = pendientes;
    document.getElementById('pedidosEntregados').textContent = entregados;

    const tbody = document.querySelector('#tablaPedidos tbody');
    tbody.innerHTML = pedidos.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.cliente}</td>
            <td>$${p.total.toFixed(2)}</td>
            <td>${p.estado}</td>
            <td>${p.fecha}</td>
        </tr>
    `).join('');
});
