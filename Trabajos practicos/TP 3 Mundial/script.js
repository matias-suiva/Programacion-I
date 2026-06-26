function registrarDT() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const capitan = document.getElementById('capitan').value;
    const mensajes = [];

    if (!nombre) {
        mensajes.push('Por favor ingrese su nombre completo.');
    }

    if (!email) {
        mensajes.push('Por favor ingrese su correo electrónico.');
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        mensajes.push('Por favor ingrese un correo válido.');
    }

    if (!capitan) {
        mensajes.push('Por favor seleccione un capitán.');
    }

    if (mensajes.length > 0) {
        alert(mensajes.join('\n'));
        return;
    }

    alert(`¡Candidatura registrada!\n\nNombre: ${nombre}\nCorreo: ${email}\nCapitán elegido: ${capitan}`);
    document.getElementById('form1').reset();
}
