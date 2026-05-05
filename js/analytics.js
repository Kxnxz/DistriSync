document.addEventListener('DOMContentLoaded', function() {
    const ventas = 8420.50;
    const clientesActivos = 128;
    const productosVendidos = 432;
    const crecimiento = 12.4;
    const promedio = 45.25;

    document.getElementById('ventasTotales').textContent = `$${ventas.toFixed(2)}`;
    document.getElementById('clientesActivos').textContent = clientesActivos;
    document.getElementById('productosVendidos').textContent = productosVendidos;
    document.getElementById('mesActual').textContent = `${crecimiento.toFixed(1)}%`;
    document.getElementById('crecimiento').textContent = `${crecimiento.toFixed(1)}%`;
    document.getElementById('ticketPromedio').textContent = `$${promedio.toFixed(2)}`;
});
