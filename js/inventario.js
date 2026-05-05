document.addEventListener('DOMContentLoaded', function() {
    const inventario = [
        { id: 1, nombre: 'Maquillaje Professional', stock: 15, precio: 45.99 },
        { id: 2, nombre: 'Skincare Premium', stock: 8, precio: 55.99 },
        { id: 3, nombre: 'Hidratación Intensiva', stock: 20, precio: 35.99 },
        { id: 4, nombre: 'Limpieza Facial Suave', stock: 12, precio: 29.99 }
    ];

    const totalProductos = inventario.length;
    const stockTotal = inventario.reduce((sum, item) => sum + item.stock, 0);
    const valorTotal = inventario.reduce((sum, item) => sum + item.stock * item.precio, 0);

    document.getElementById('totalItems').textContent = totalProductos;
    document.getElementById('stockTotal').textContent = stockTotal;
    document.getElementById('valorInventario').textContent = `$${valorTotal.toFixed(2)}`;

    const tbody = document.querySelector('#tablaInventario tbody');
    tbody.innerHTML = inventario.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.nombre}</td>
            <td>${item.stock}</td>
            <td>$${item.precio.toFixed(2)}</td>
        </tr>
    `).join('');
});
