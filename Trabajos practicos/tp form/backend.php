<?php
// Convierte cualquier valor recibido en texto seguro para mostrarlo en HTML.
function escapar($valor)
{
	return htmlspecialchars(strval($valor), ENT_QUOTES, 'UTF-8');
}

// El archivo solo acepta datos enviados desde el formulario mediante POST.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	exit('El formulario debe enviarse mediante el método POST.');
}

// Guarda todos los campos recibidos. Si falta uno, se guarda como null.
$datos = [
	'apellido' => $_POST['apellido'] ?? null,
	'nombre' => $_POST['nombre'] ?? null,
	'email' => $_POST['email'] ?? null,
	'sistema' => $_POST['sistema'] ?? null,
	'experiencia' => $_POST['experiencia'] ?? null,
	'interes' => $_POST['interes'] ?? null,
	'comentario' => $_POST['comentario'] ?? null,
];

// Array donde se acumulan los problemas encontrados en la validación.
$errores = [];

// Verifica existencia, contenido y tipo de los campos obligatorios.
foreach (['apellido', 'nombre', 'email', 'sistema', 'interes', 'comentario'] as $campo) {
	if (!isset($datos[$campo]) || is_null($datos[$campo]) || empty($datos[$campo])) {
		$errores[] = 'El campo ' . $campo . ' es obligatorio.';
	} elseif (!is_string($datos[$campo])) {
		$errores[] = 'El campo ' . $campo . ' debe ser texto.';
	}
}

// El checkbox es opcional, pero si llega debe ser un texto.
if (isset($datos['experiencia']) && !is_null($datos['experiencia']) && !is_string($datos['experiencia'])) {
	$errores[] = 'El valor de experiencia no es válido.';
}

// Validación adicional del formato del correo en el servidor.
if (!empty($datos['email']) && !filter_var($datos['email'], FILTER_VALIDATE_EMAIL)) {
	$errores[] = 'El correo electrónico no tiene un formato válido.';
}

// Ejemplos de conversiones y comprobaciones de tipos solicitadas en el TP.
$cantidadCampos = count($datos);
$cantidadCamposEntera = intval($cantidadCampos);
$cantidadCamposTexto = strval($cantidadCamposEntera);
$cantidadCamposFlotante = floatval($cantidadCamposEntera);
$esCantidadEntera = is_int($cantidadCamposEntera);
$esCantidadFlotante = is_float($cantidadCamposFlotante);
$esCantidadNumerica = is_numeric($cantidadCamposTexto);
$esPostArray = is_array($_POST);
$cantidadComoTexto = $cantidadCamposTexto;
settype($cantidadComoTexto, 'string');

// Si hay errores, devuelve un mensaje y no procesa los datos.
if (count($errores) > 0) {
	http_response_code(422);
	?>
	<!DOCTYPE html>
	<html lang="es">
	<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Error de validación</title><link rel="stylesheet" href="estilos.css"></head>
	<body><main class="pagina"><section class="presentacion"><p class="etiqueta">Formulario no enviado</p><h1>Revisá los datos</h1><p><?= escapar(implode(' ', $errores)) ?></p><p><a href="index.html">Volver al formulario</a></p></section></main></body>
	</html>
	<?php
	exit;
}
?>
<!-- Página que se muestra cuando la validación fue exitosa -->
<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Formulario recibido</title>
	<link rel="stylesheet" href="estilos.css">
</head>
<body>
	<main class="pagina">
		<!-- Encabezado de confirmación -->
		<section class="presentacion">
			<p class="etiqueta">Envío exitoso</p>
			<h1>¡Gracias, <?= escapar($datos['nombre']) ?>!</h1>
			<p>Recibimos tu opinión correctamente.</p>
		</section>
		<!-- Resumen de los datos recibidos y escapados de forma segura -->
		<section class="resumen">
			<p><strong>Apellido:</strong> <?= escapar($datos['apellido']) ?></p>
			<p><strong>Correo:</strong> <?= escapar($datos['email']) ?></p>
			<p><strong>Sistema operativo:</strong> <?= escapar($datos['sistema']) ?></p>
			<p><strong>Experiencia web:</strong> <?= escapar($datos['experiencia'] ?? 'No indicada') ?></p>
			<p><strong>Interés:</strong> <?= escapar($datos['interes']) ?></p>
			<p><strong>Comentario:</strong> <?= nl2br(escapar($datos['comentario'])) ?></p>
			<p><a href="index.html">Cargar otra respuesta</a></p>
		</section>
	</main>
</body>
</html>
