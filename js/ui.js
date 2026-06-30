function mostrarToast(message, type = 'info', duration = 3200) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('visible'), 10);

    setTimeout(() => {
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}

function mostrarError(message) {
    mostrarToast(message, 'error');
}

function mostrarExito(message) {
    mostrarToast(message, 'success');
}

function confirmDialog(message) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';

        dialog.innerHTML = `
            <p>${message}</p>
            <div class="confirm-actions">
                <button class="cancel">Cancelar</button>
                <button class="confirm">Aceptar</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        const cancelBtn = dialog.querySelector('.cancel');
        const confirmBtn = dialog.querySelector('.confirm');

        const cleanup = () => {
            overlay.remove();
        };

        cancelBtn.addEventListener('click', () => {
            cleanup();
            resolve(false);
        });

        confirmBtn.addEventListener('click', () => {
            cleanup();
            resolve(true);
        });
    });
}
