// Función que valida el formulario del laboratorio Tesla
function validarFormulario() {
  // Obtenemos los valores de los campos
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();

  // Validación básica de campos vacíos
  if (nombre === '' || email === '') {
    alert('🚫 Por favor, completá todos los campos.');
    return false; // Previene el envío del formulario
  }

  // Validación básica del email (estructura básica)
  if (!email.includes('@') || !email.includes('.')) {
    alert('📧 Ingresá un email válido.');
    return false;
  }

  // Si todo está bien
  alert('✅ Bienvenido, ' + nombre + '! Ahora podés activar las bombillas.');
  return false; // Prevenimos envío real para control manual con el rayo
}

// Función que enciende o apaga las bombillas al tocar el rayo
function encenderSistema() {

  // Seleccionamos todas las bombillas
  // document.querySelectorAll() para seleccionar todos los elementos del HTML 
  // que tengan la clase CSS .bombilla.
  const bombillas = document.querySelectorAll('.bombilla');

  // Recorremos cada bombilla y alternamos la clase "encendida"
  // Recorre cada una de las bombillas de la lista con un bucle .forEach().
  // Ejecuta una función para cada bombilla individual, nombrándola temporalmente como bombilla.
  // Alterna (activa o desactiva) la clase CSS "encendida" en cada bombilla.
  // ✔️ Si ya estaba encendida → la apaga - ❌ Si estaba apagada → la enciende
  
  // classList.toggle()
  // Es un método de JavaScript que permite agregar o quitar una clase CSS a un elemento HTML, 
  // según si ya la tiene o no.
  bombillas.forEach(bombilla => { bombilla.classList.toggle('encendida'); });

  // Efecto adicional en el fondo del body (descarga eléctrica)
  // Aplica una transición suave de 0.2 segundos al color de fondo del sitio (body).
  document.body.style.transition = 'background-color 0.2s';
  document.body.style.backgroundColor = '#1f1f1f';

  // setTimeout Ejecuta un bloque de código después de 200 milisegundos.
  setTimeout(() => {
    document.body.style.backgroundColor = '#000000';
  }, 200);
}

/*
  function encenderSistema()	Define una función para controlar el sistema eléctrico
  querySelectorAll('.bombilla')	Recolecta todas las bombillas activas del DOM
  forEach(...)	Recorre cada bombilla una por una
  classList.toggle('encendida')	Enciende o apaga visualmente cada bombilla
  style.transition + backgroundColor	Simula una descarga eléctrica en el fondo
  setTimeout(...)	Espera 200ms y vuelve el fondo a negro
*/