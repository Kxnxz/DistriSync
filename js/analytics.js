document.addEventListener('DOMContentLoaded', async function() {
    await cargarAnalytics();
});

async function cargarAnalytics() {
    try {
        const response = await fetch('php/analytics.php?action=estadisticas');
        const data = await response.json();

        document.getElementById('ventasTotales').textContent = `$${Number(data.ventasTotales).toFixed(2)}`;
        document.getElementById('clientesActivos').textContent = data.clientesActivos;
        document.getElementById('productosVendidos').textContent = data.productosVendidos;
        document.getElementById('mesActual').textContent = `${Number(data.crecimiento).toFixed(1)}%`;
        document.getElementById('crecimiento').textContent = `${Number(data.crecimiento).toFixed(1)}%`;
        document.getElementById('ticketPromedio').textContent = `$${Number(data.ticketPromedio).toFixed(2)}`;
    } catch (err) {
        console.error('Error cargando analytics:', err);
        alert('Error cargando estadísticas');
    }
}
