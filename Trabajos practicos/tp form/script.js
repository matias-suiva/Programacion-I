// Espera a que la página termine de cargar antes de buscar sus elementos.
window.onload = function () {
	const formulario = document.getElementById("formulario");
	const mensaje = document.getElementById("mensaje");

	// Intercepta el envío para validar los datos antes de llamar al PHP.
	formulario.addEventListener("submit", function (evento) {
		evento.preventDefault();
		limpiarErrores();

		const apellido = document.getElementById("apellido");
		const nombre = document.getElementById("nombre");
		const email = document.getElementById("email");
		const sistema = document.getElementById("sistema");
		const comentario = document.getElementById("comentario");
		const interes = document.querySelector('input[name="interes"]:checked');
		// Expresión regular básica: texto@texto.dominio
		const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		let formularioValido = true;

		// Comprueba que apellido y nombre no estén vacíos.
		if (apellido.value.trim() === "") {
			mostrarError(apellido, "Ingresá tu apellido.");
			formularioValido = false;
		}
		if (nombre.value.trim() === "") {
			mostrarError(nombre, "Ingresá tu nombre.");
			formularioValido = false;
		}
		// Comprueba que el correo exista y tenga un formato válido.
		if (email.value.trim() === "") {
			mostrarError(email, "Ingresá tu correo electrónico.");
			formularioValido = false;
		} else if (!emailValido.test(email.value.trim())) {
			mostrarError(email, "Ingresá un correo electrónico válido.");
			formularioValido = false;
		}
		// Comprueba que se haya elegido una opción de la lista.
		if (sistema.value === "") {
			mostrarError(sistema, "Seleccioná un sistema operativo.");
			formularioValido = false;
		}
		// Comprueba que se haya seleccionado uno de los radio buttons.
		if (!interes) {
			document.getElementById("error-interes").textContent = "Elegí una opción.";
			formularioValido = false;
		}
		// Comprueba que el área de comentario tenga contenido.
		if (comentario.value.trim() === "") {
			mostrarError(comentario, "Escribí un comentario.");
			formularioValido = false;
		}

		// Si todo está correcto, envía los datos al servidor PHP.
		if (formularioValido) {
			mensaje.className = "mensaje correcto";
			mensaje.textContent = "Datos correctos. Enviando formulario...";
			formulario.submit();
		} else {
			mensaje.textContent = "Revisá los campos marcados antes de enviar.";
		}
	});

	// Limpia los errores cuando se presiona el botón Restablecer.
	formulario.addEventListener("reset", function () {
		limpiarErrores();
		mensaje.textContent = "";
	});

	// Marca visualmente un campo y escribe su mensaje de error.
	function mostrarError(campo, texto) {
		campo.classList.add("invalido");
		document.getElementById("error-" + campo.id).textContent = texto;
	}

	// Quita todos los mensajes y marcas de error anteriores.
	function limpiarErrores() {
		document.querySelectorAll(".error").forEach(function (elemento) {
			elemento.textContent = "";
		});
		document.querySelectorAll(".invalido").forEach(function (elemento) {
			elemento.classList.remove("invalido");
		});
	}
};
