document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formContacto');
    const btnInfo = document.getElementById('btnInfo');

    // 👉 URL de la API de Laravel. Cambiala el día que subas el backend a un servidor real.
    const API_URL = 'http://127.0.0.1:8000/api/registros';

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const capitan = document.getElementById('capitan').value;

            if (nombre === '' || email === '' || capitan === '') {
                alert('Advertencia: Debe completar todos los campos antes de registrar.');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registrando...';

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ nombre, email, capitan })
                });

                const data = await response.json();

                if (!response.ok) {
                    // Si Laravel rechaza los datos (422), manda el detalle en data.errors
                    const primerError = data.errors
                        ? Object.values(data.errors)[0][0]
                        : (data.mensaje || 'Ocurrió un error al guardar el registro.');
                    alert('No se pudo registrar: ' + primerError);
                    return;
                }

                alert('Director técnico: ' + nombre + '\nCapitán seleccionado: ' + capitan + '\nConfirmación: Tu participación rumbo al Mundial 2026 quedó registrada correctamente.');
                form.reset();
            } catch (error) {
                console.error(error);
                alert('No se pudo conectar con el servidor. Verificá que el backend esté corriendo (php artisan serve).');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Registrar';
            }
        });
    }

    if (btnInfo) {
        btnInfo.addEventListener('click', () => {
            alert('El Mundial 2026 será una competencia internacional de fútbol con las mejores selecciones del mundo. Se disputará en Norteamérica y promete una edición histórica.');
        });
    }
});