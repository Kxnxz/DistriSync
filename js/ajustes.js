document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formAjustes');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Ajustes guardados correctamente.');
    });
});
