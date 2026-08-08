document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formContacto');
    const btnInfo = document.getElementById('btnInfo');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const capitan = document.getElementById('capitan').value;

            if (nombre === '' || email === '' || capitan === '') {
                alert('Advertencia: Debe completar todos los campos antes de registrar.');
            } else {
                alert('Director técnico: ' + nombre + '\nCapitán seleccionado: ' + capitan + '\nConfirmación: Tu participación rumbo al Mundial 2026 quedó registrada correctamente.');
                form.reset();
            }
        });
    }

    if (btnInfo) {
        btnInfo.addEventListener('click', () => {
            alert('El Mundial 2026 será una competencia internacional de fútbol con las mejores selecciones del mundo. Se disputará en Norteamérica y promete una edición histórica.');
        });
    }
});
