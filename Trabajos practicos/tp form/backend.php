<?php
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

// Demostración de comprobaciones y conversiones de tipos sobre datos reales (lo que pide el TP).
$esPostArray = is_array($_POST);
$apellidoEsString = is_string($datos['apellido']);
$nombreEsString = is_string($datos['nombre']);
$emailEsString = is_string($datos['email']);
$comentarioEsString = is_string($datos['comentario']);
$apellidoNumerico = is_numeric($datos['apellido']); // false, es texto
$comentarioNumerico = is_numeric($datos['comentario']); // false, es texto
$apellidoInt = intval($datos['apellido']); // 0, no es número
$emailFloat = floatval($datos['email']); // 0.0
$apellidoStr = strval($datos['apellido']);
$cantidadCampos = count($datos);
$cantidadInt = intval($cantidadCampos);
$cantidadFloat = floatval($cantidadCampos);
$cantidadStr = strval($cantidadInt);
$esInt = is_int($cantidadInt);
$esFloat = is_float($cantidadFloat);
settype($cantidadStr, 'string');

// Si hay errores, devuelve un mensaje y no procesa los datos.
if (count($errores) > 0) {
	http_response_code(422);
	echo "Errores: " . implode(", ", $errores);
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
	<link rel="stylesheet" href="css/estilos.css">
</head>
<body>
	<main class="pagina">
		<section class="presentacion">
			<p class="etiqueta">Envío exitoso</p>
			<h1>¡Gracias, <?= htmlspecialchars($datos['nombre']) ?>!</h1>
			<p>Recibimos tu opinión correctamente.</p>
		</section>
		<section class="resumen">
			<p><strong>Nombre:</strong> <?= htmlspecialchars($datos['nombre']) ?></p>
			<p><strong>Apellido:</strong> <?= htmlspecialchars($datos['apellido']) ?></p>
			<p><strong>Correo:</strong> <?= htmlspecialchars($datos['email']) ?></p>
			<p><strong>Sistema operativo:</strong> <?= htmlspecialchars($datos['sistema']) ?></p>
			<p><strong>Experiencia web:</strong> <?= htmlspecialchars($datos['experiencia'] ?? 'No indicada') ?></p>
			<p><strong>Interés:</strong> <?= htmlspecialchars($datos['interes']) ?></p>
			<p><strong>Comentario:</strong> <?= nl2br(htmlspecialchars($datos['comentario'])) ?></p>
			<p><a href="index.html">Cargar otra respuesta</a></p>
		</section>
	</main>
</body>
</html>
