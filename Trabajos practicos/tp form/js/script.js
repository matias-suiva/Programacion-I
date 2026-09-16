// Espera a que la página termine de cargar antes de buscar sus elementos.
window.onload = function () {
	// Busca el formulario para poder controlar su envío.
	const formulario = document.getElementById("formulario");

	// Ejecuta las validaciones cuando el usuario intenta enviar el formulario.
	formulario.addEventListener("submit", function (evento) {
		// Evita que el navegador envíe el formulario automáticamente.
		evento.preventDefault();
		// Borra los mensajes y estilos de error de un intento anterior.
		limpiarErrores();

		// Obtiene los campos de texto, la lista desplegable y el área de comentario.
		const apellido = document.getElementById("apellido");
		const nombre = document.getElementById("nombre");
		const email = document.getElementById("email");
		const sistema = document.getElementById("sistema");
		const comentario = document.getElementById("comentario");
		// Obtiene la opción de interés seleccionada, si existe.
		const interes = document.querySelector('input[name="interes"]:checked');
		// Define una expresión regular para comprobar el formato del correo.
		const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		// Supone que el formulario es válido hasta encontrar un error.
		let formularioValido = true;

		// Comprueba que se haya escrito un apellido.
		if (apellido.value.trim() === "") {
			mostrarError(apellido, "Ingresá tu apellido.");
			formularioValido = false;
		}
		// Comprueba que se haya escrito un nombre.
		if (nombre.value.trim() === "") {
			mostrarError(nombre, "Ingresá tu nombre.");
			formularioValido = false;
		}
		// Comprueba que el correo no esté vacío y tenga un formato válido.
		if (email.value.trim() === "") {
			mostrarError(email, "Ingresá tu correo electrónico.");
			formularioValido = false;
		} else if (!emailValido.test(email.value.trim())) {
			mostrarError(email, "Ingresá un correo electrónico válido.");
			formularioValido = false;
		}
		// Comprueba que se haya elegido un sistema operativo.
		if (sistema.value === "") {
			mostrarError(sistema, "Seleccioná un sistema operativo.");
			formularioValido = false;
		}
		// Comprueba que se haya seleccionado una opción de interés.
		if (!interes) {
			document.getElementById("error-interes").textContent = "Elegí una opción.";
			formularioValido = false;
		}
		// Comprueba que el usuario haya escrito un comentario.
		if (comentario.value.trim() === "") {
			mostrarError(comentario, "Escribí un comentario.");
			formularioValido = false;
		}

		// Envía el formulario solamente si todas las validaciones fueron correctas.
		if (formularioValido) {
			formulario.submit();
		}
	});

	// Muestra un mensaje de error y marca visualmente el campo indicado.
	function mostrarError(campo, texto) {
		campo.classList.add("invalido");
		document.getElementById("error-" + campo.id).textContent = texto;
	}

	// Limpia todos los mensajes y marcas de error antes de validar nuevamente.
	function limpiarErrores() {
		// Vacía el texto de cada elemento destinado a mostrar errores.
		document.querySelectorAll(".error").forEach(function (elemento) {
			elemento.textContent = "";
		});
		// Quita la clase que resalta los campos inválidos.
		document.querySelectorAll(".invalido").forEach(function (elemento) {
			elemento.classList.remove("invalido");
		});
	}
};
