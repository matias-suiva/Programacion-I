<?php
// Inicia o recupera la sesion. Ahora la sesion solo se usa para mensajes
// temporales; el perfil, el saldo y los vehiculos se guardan en MySQL.
session_start();

// Conexion inicial a MySQL de XAMPP. Por defecto, XAMPP usa root sin password.
$host = 'localhost';
$usuarioMysql = 'root';
$passwordMysql = '';
$nombreBase = 'seom_lab';

try {
    // Primero se conecta al servidor sin elegir una base para poder crearla.
    $conexion = new PDO(
        'mysql:host=' . $host . ';charset=utf8mb4',
        $usuarioMysql,
        $passwordMysql
    );
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conexion->exec('CREATE DATABASE IF NOT EXISTS ' . $nombreBase . ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');

    // Desde este punto las consultas se realizan dentro de seom_lab.
    $conexion = new PDO(
        'mysql:host=' . $host . ';dbname=' . $nombreBase . ';charset=utf8mb4',
        $usuarioMysql,
        $passwordMysql
    );
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Crea las tablas automaticamente la primera vez que se ejecuta el archivo.
    $conexion->exec(
        'CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(50) NOT NULL DEFAULT "",
            apellido VARCHAR(50) NOT NULL DEFAULT "",
            dni VARCHAR(20) NOT NULL DEFAULT "",
            telefono VARCHAR(30) NOT NULL DEFAULT "",
            tarjeta VARCHAR(30) NULL,
            saldo DECIMAL(10,2) NOT NULL DEFAULT 2500,
            estacionamiento_activo TINYINT(1) NOT NULL DEFAULT 0
        ) ENGINE=InnoDB'
    );
    $conexion->exec(
        'CREATE TABLE IF NOT EXISTS vehiculos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario_id INT NOT NULL,
            patente VARCHAR(10) NOT NULL,
            UNIQUE KEY vehiculo_usuario (usuario_id, patente),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        ) ENGINE=InnoDB'
    );

    // Esta primera version trabaja con un unico usuario de prueba, identificado por 1.
    $conexion->exec(
        'INSERT INTO usuarios (id, saldo)
         SELECT 1, 2500
         WHERE NOT EXISTS (SELECT id FROM usuarios WHERE id = 1)'
    );
    $conexion->exec(
        'INSERT INTO vehiculos (usuario_id, patente)
         SELECT 1, "ABC 123"
         WHERE NOT EXISTS (SELECT id FROM vehiculos WHERE usuario_id = 1)'
    );
} catch (PDOException $error) {
    // Si Apache no tiene MySQL activo o las credenciales son incorrectas,
    // se muestra una indicacion clara para revisar XAMPP.
    exit('No se pudo conectar con MySQL. Inicia Apache y MySQL en XAMPP. Detalle: ' . $error->getMessage());
}

// Busca en MySQL los datos que se muestran en la aplicacion.
$consultaUsuario = $conexion->query('SELECT * FROM usuarios WHERE id = 1');
$usuario = $consultaUsuario->fetch(PDO::FETCH_ASSOC);
$consultaVehiculos = $conexion->query('SELECT patente FROM vehiculos WHERE usuario_id = 1 ORDER BY id');
$vehiculos = $consultaVehiculos->fetchAll(PDO::FETCH_COLUMN);

// $_GET obtiene el valor enviado en la URL, por ejemplo: index.php?pagina=saldo.
// Si no existe, se muestra la pantalla de inicio.
$pagina = isset($_GET['pagina']) ? $_GET['pagina'] : 'inicio';
// Guarda el mensaje de la sesion para mostrarlo una sola vez.
$mensaje = isset($_SESSION['mensaje']) ? $_SESSION['mensaje'] : '';
$_SESSION['mensaje'] = '';

// Los formularios utilizan el metodo POST. Esta condicion evita procesar acciones
// cuando el usuario solamente esta consultando una pagina.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Identifica que formulario fue enviado mediante un campo oculto.
    $accion = isset($_POST['accion']) ? $_POST['accion'] : '';

    // Proceso para iniciar un nuevo estacionamiento.
    if ($accion === 'iniciar_estacionamiento') {
        // trim() elimina espacios y strtoupper() convierte la patente a mayusculas.
        $patente = strtoupper(trim($_POST['patente']));
        // Costo fijo utilizado en esta primera version del programa.
        $costo = 500;

        // No se permite continuar si el usuario no ingreso una patente.
        if ($patente === '') {
            $_SESSION['mensaje'] = 'Ingresa la patente del vehiculo.';
        // Se compara el saldo que vino desde MySQL con el costo.
        } elseif ($usuario['saldo'] < $costo) {
            $_SESSION['mensaje'] = 'No tienes saldo suficiente para iniciar el estacionamiento.';
        // Si las validaciones se superan, se actualiza la sesion.
        } else {
            // Resta el costo y activa el estacionamiento directamente en MySQL.
            $consulta = $conexion->prepare(
                'UPDATE usuarios SET saldo = saldo - ?, estacionamiento_activo = 1 WHERE id = 1'
            );
            $consulta->execute(array($costo));
            // htmlspecialchars() evita que la patente se interprete como HTML.
            $_SESSION['mensaje'] = 'Estacionamiento iniciado para la patente ' . htmlspecialchars($patente, ENT_QUOTES, 'UTF-8') . '.';
        }

        // Redirige a la pantalla de estacionamiento y detiene el archivo.
        header('Location: index.php?pagina=estacionar');
        exit;
    }

    // Proceso para finalizar el estacionamiento actual.
    if ($accion === 'finalizar_estacionamiento') {
        // Guarda en MySQL que ya no hay un estacionamiento activo.
        $conexion->exec('UPDATE usuarios SET estacionamiento_activo = 0 WHERE id = 1');
        $_SESSION['mensaje'] = 'Estacionamiento finalizado correctamente.';
        header('Location: index.php?pagina=estacionar');
        exit;
    }

    // Proceso para agregar una patente a la lista de vehiculos.
    if ($accion === 'agregar_vehiculo') {
        $patente = strtoupper(trim($_POST['patente']));

        // Primera validacion: la patente no puede estar vacia.
        if ($patente === '') {
            $_SESSION['mensaje'] = 'Ingresa una patente.';
        // Busca en MySQL si la patente ya existe para este usuario.
        } else {
            $consulta = $conexion->prepare(
                'SELECT id FROM vehiculos WHERE usuario_id = 1 AND patente = ?'
            );
            $consulta->execute(array($patente));

            if ($consulta->fetch()) {
            $_SESSION['mensaje'] = 'Ese vehiculo ya esta registrado.';
            } else {
                // Guarda la nueva patente en la tabla vehiculos.
                $consulta = $conexion->prepare(
                    'INSERT INTO vehiculos (usuario_id, patente) VALUES (1, ?)'
                );
                $consulta->execute(array($patente));
                $_SESSION['mensaje'] = 'Vehiculo agregado correctamente.';
            }
        }

        // Vuelve a la pantalla donde se muestra la lista de vehiculos.
        header('Location: index.php?pagina=vehiculos');
        exit;
    }

    // Proceso para sumar dinero al saldo disponible.
    if ($accion === 'agregar_saldo') {
        // El monto llega desde el formulario y se convierte a numero decimal.
        $monto = isset($_POST['monto']) ? str_replace(',', '.', trim($_POST['monto'])) : '';

        // El monto debe ser numerico y mayor que cero.
        if ($monto === '' || !is_numeric($monto) || (float) $monto <= 0) {
            $_SESSION['mensaje'] = 'Ingresa un monto valido mayor que cero.';
        } else {
            // El saldo se incrementa directamente en la base de datos.
            $consulta = $conexion->prepare('UPDATE usuarios SET saldo = saldo + ? WHERE id = 1');
            $consulta->execute(array((float) $monto));
            $_SESSION['mensaje'] = 'Saldo agregado correctamente.';
        }

        header('Location: index.php?pagina=saldo');
        exit;
    }

    // Proceso para guardar los datos escritos en la pantalla Perfil.
    if ($accion === 'guardar_perfil') {
        // Actualiza todos los datos del perfil en una sola consulta.
        $consulta = $conexion->prepare(
            'UPDATE usuarios SET nombre = ?, apellido = ?, dni = ?, telefono = ?, tarjeta = ? WHERE id = 1'
        );
        $consulta->execute(array(
            trim($_POST['nombre']),
            trim($_POST['apellido']),
            trim($_POST['dni']),
            trim($_POST['telefono']),
            trim($_POST['tarjeta']) !== '' ? trim($_POST['tarjeta']) : null
        ));
        $_SESSION['mensaje'] = 'Perfil guardado correctamente.';

        header('Location: index.php?pagina=perfil');
        exit;
    }
}

// Funcion reutilizable para construir cada enlace de la navegacion inferior.
// paginaActual indica donde esta el usuario y pagina indica el destino.
function mostrar_estado($paginaActual, $pagina, $texto)
{
    // Si es la pantalla actual, el enlace recibe la clase CSS "activo".
    $clase = $paginaActual === $pagina ? 'activo' : '';
    // echo imprime en el navegador el enlace HTML generado.
    echo '<a class="nav-item ' . $clase . '" href="index.php?pagina=' . $pagina . '">' . $texto . '</a>';
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Permite mostrar correctamente caracteres y adapta la pagina a celulares. -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEOM LAB</title>
    <style>
        /* box-sizing facilita calcular el ancho real de los elementos. */
        * { box-sizing: border-box; }
        /* Estilos generales de la pagina y del texto. */
        body { margin: 0; background: #e9e9e9; color: #222; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        /* .telefono representa el marco de celular del wireframe. */
        .telefono { width: 100%; max-width: 420px; min-height: 100vh; margin: 0 auto; background: #fff; border: 1px solid #555; border-radius: 32px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.15); display: flex; flex-direction: column; }
        @media (max-width: 430px) { .telefono { width: 100%; min-height: 100vh; margin: 0; border: 0; border-radius: 0; box-shadow: none; } }
        /* main ocupa el espacio central entre contenido y navegacion. */
        main { flex: 1; padding: 34px 28px 24px; }
        /* Clases visuales de la marca y del encabezado. */
        .marca { text-align: center; padding: 20px 0; }
        .auto { font-size: 48px; line-height: 1; margin-bottom: 8px; }
        h1 { margin: 0; font-size: 32px; font-weight: 400; letter-spacing: 1px; }
        .subtitulo { margin: 6px 0 20px; font-size: 13px; letter-spacing: 1px; }
        .linea { width: 60px; border-top: 2px solid #222; margin: 0 auto 22px; }
        /* Tarjeta que muestra el dinero disponible. */
        .saldo { border: 1px solid #555; border-radius: 16px; padding: 20px 16px; text-align: center; margin-bottom: 24px; background: #f8f8f8; }
        .saldo strong { display: block; font-size: 17px; font-weight: 400; margin-bottom: 8px; color: #222; }
        .monto { font-size: 38px; letter-spacing: 1px; color: #222; }
        /* Estilos compartidos por botones y enlaces con apariencia de boton. */
        .boton, .enlace-boton { display: block; width: 100%; padding: 15px 12px; border: 1px solid #333; border-radius: 10px; background: #f1f1f1; color: #222; text-align: center; text-decoration: none; font-size: 16px; cursor: pointer; }
        .principal { background: #d5d5d5; margin-bottom: 12px; }
        .secundario { margin-top: 8px; }
        .mensaje { padding: 10px; border: 1px solid #777; border-radius: 8px; margin-bottom: 16px; text-align: center; font-size: 13px; background: #fafafa; }
        /* .tarjeta agrupa formularios e informacion relacionada. */
        .tarjeta { border: 1px solid #777; border-radius: 12px; padding: 20px; margin-bottom: 20px; background: #fafafa; }
        .boton-pequeno { padding: 12px; font-size: 15px; margin-top: 18px; }
        label { display: block; margin: 14px 0 7px; font-size: 14px; }
        input { width: 100%; padding: 10px; border: 1px solid #555; border-radius: 6px; font-size: 15px; text-transform: uppercase; margin-bottom: 8px; }
        .lista { padding-left: 20px; line-height: 2; }
        h2 { font-size: 24px; font-weight: 400; margin-top: 0; }
        .volver { display: inline-block; margin-bottom: 16px; color: #222; font-size: 13px; text-decoration: none; border-bottom: 1px dashed #555; padding-bottom: 4px; }
        /* La navegacion inferior se divide en cuatro enlaces iguales. */
        nav { display: flex; border-top: 1px solid #555; background: #fafafa; padding: 6px 0; }
        .nav-item { flex: 1; padding: 12px 2px; color: #333; text-decoration: none; text-align: center; font-size: 12px; font-weight: 500; }
        .nav-item::first-line { font-size: 16px; }
        .nav-item.activo { font-weight: bold; background: #e5e5e5; color: #222; }
        /* En pantallas angostas, el marco ocupa todo el ancho disponible. */
        @media (max-width: 430px) { .telefono { width: 100%; min-height: 100vh; margin: 0; border: 0; border-radius: 0; } }
    </style>
</head>
<body>
<!-- Contenedor principal que simula la pantalla de la aplicacion. -->
<div class="telefono">
    <main>
        <!-- Muestra el mensaje generado por una accion anterior, si existe. -->
        <?php if ($mensaje !== ''): ?>
            <div class="mensaje"><?php echo $mensaje; ?></div>
        <?php endif; ?>

        <!-- Pantalla de inicio: resume el saldo y ofrece las acciones principales. -->
        <?php if ($pagina === 'inicio'): ?>
            <section class="marca">
                <div class="auto">&#128663;</div>
                <h1>SEOM LAB</h1>
                <p class="subtitulo">SISTEMA DE ESTACIONAMIENTO MEDIDO</p>
                <div class="linea"></div>
            </section>
            <section class="saldo">
                <strong>SALDO DISPONIBLE</strong>
                <div class="monto">$ <?php echo number_format($usuario['saldo'], 2, ',', '.'); ?></div>
            </section>
            <a class="enlace-boton principal" href="index.php?pagina=estacionar">&#128664; &nbsp; INICIAR ESTACIONAMIENTO</a>
            <a class="enlace-boton secundario" href="index.php?pagina=saldo">&#128179; &nbsp; CONSULTAR SALDO</a>
            <a class="enlace-boton secundario" href="index.php?pagina=vehiculos">&#128663; &nbsp; MIS VEHICULOS</a>
        <!-- Pantalla para iniciar o finalizar un estacionamiento. -->
        <?php elseif ($pagina === 'estacionar'): ?>
            <a class="volver" href="index.php">&larr; Volver al inicio</a>
            <h2>Estacionamiento</h2>
            <!-- Si el valor es true, se muestra la opcion de finalizar. -->
            <?php if ($usuario['estacionamiento_activo']): ?>
                <div class="tarjeta">Hay un estacionamiento activo.</div>
                <form method="post">
                    <input type="hidden" name="accion" value="finalizar_estacionamiento">
                    <button class="boton principal" type="submit">FINALIZAR ESTACIONAMIENTO</button>
                </form>
            <!-- Si el valor es false, se muestra el formulario para iniciar. -->
            <?php else: ?>
                <div class="tarjeta">
                    <p>El costo de inicio es de $ 500.</p>
                    <form method="post">
                        <input type="hidden" name="accion" value="iniciar_estacionamiento">
                        <label for="patente">Patente del vehiculo</label>
                        <input id="patente" name="patente" maxlength="10" required>
                        <button class="boton principal" type="submit">INICIAR</button>
                    </form>
                </div>
            <?php endif; ?>
        <!-- Pantalla que consulta y muestra el saldo actual. -->
        <?php elseif ($pagina === 'saldo'): ?>
            <a class="volver" href="index.php">&larr; Volver al inicio</a>
            <h2>Saldo disponible</h2>
            <section class="saldo">
                <strong>SALDO ACTUAL</strong>
                <div class="monto">$ <?php echo number_format($usuario['saldo'], 2, ',', '.'); ?></div>
            </section>
            <?php if (isset($_GET['agregar'])): ?>
                <!-- El formulario aparece despues de hacer clic en Agregar saldo. -->
                <div class="tarjeta">
                    <form method="post">
                        <input type="hidden" name="accion" value="agregar_saldo">
                        <label for="monto">Cuanto saldo quieres agregar?</label>
                        <input id="monto" name="monto" type="number" min="1" step="0.01" required>
                        <button class="boton principal boton-pequeno" type="submit">CONFIRMAR CARGA</button>
                    </form>
                </div>
            <?php else: ?>
                <!-- Este enlace funciona como el primer boton del proceso de carga. -->
                <a class="enlace-boton principal" href="index.php?pagina=saldo&agregar=1">AGREGAR SALDO</a>
            <?php endif; ?>
        <!-- Pantalla que lista y permite agregar vehiculos. -->
        <?php elseif ($pagina === 'vehiculos'): ?>
            <a class="volver" href="index.php">&larr; Volver al inicio</a>
            <h2>Mis vehiculos</h2>
            <div class="tarjeta">
                <ul class="lista">
                    <!-- foreach repite un elemento li por cada vehiculo del arreglo. -->
                    <?php foreach ($vehiculos as $vehiculo): ?>
                        <li><?php echo htmlspecialchars($vehiculo, ENT_QUOTES, 'UTF-8'); ?></li>
                    <?php endforeach; ?>
                </ul>
                <form method="post">
                    <input type="hidden" name="accion" value="agregar_vehiculo">
                    <label for="nueva_patente">Agregar patente</label>
                    <input id="nueva_patente" name="patente" maxlength="10" required>
                    <button class="boton secundario" type="submit">AGREGAR VEHICULO</button>
                </form>
            </div>
        <!-- Si la pagina no coincide con las anteriores, se muestra el perfil. -->
        <?php else: ?>
            <a class="volver" href="index.php">&larr; Volver al inicio</a>
            <h2>Perfil</h2>
            <?php if (isset($_GET['editar'])): ?>
                <!-- El formulario aparece solamente despues de pulsar Editar perfil. -->
                <div class="tarjeta">
                    <form method="post">
                        <input type="hidden" name="accion" value="guardar_perfil">

                        <label for="nombre">Nombre</label>
                        <input id="nombre" name="nombre" value="<?php echo htmlspecialchars($usuario['nombre'], ENT_QUOTES, 'UTF-8'); ?>" required>

                        <label for="apellido">Apellido</label>
                        <input id="apellido" name="apellido" value="<?php echo htmlspecialchars($usuario['apellido'], ENT_QUOTES, 'UTF-8'); ?>" required>

                        <label for="dni">DNI</label>
                        <input id="dni" name="dni" value="<?php echo htmlspecialchars($usuario['dni'], ENT_QUOTES, 'UTF-8'); ?>" required>

                        <label for="telefono">Telefono</label>
                        <input id="telefono" name="telefono" type="tel" value="<?php echo htmlspecialchars($usuario['telefono'], ENT_QUOTES, 'UTF-8'); ?>" required>

                        <label for="tarjeta">Tarjeta de credito (opcional)</label>
                        <input id="tarjeta" name="tarjeta" type="text" value="<?php echo htmlspecialchars($usuario['tarjeta'] ?? '', ENT_QUOTES, 'UTF-8'); ?>">

                        <button class="boton principal boton-pequeno" type="submit">GUARDAR PERFIL</button>
                    </form>
                </div>
            <?php else: ?>
                <!-- Vista de consulta: muestra los datos sin permitir modificarlos. -->
                <div class="tarjeta">
                    <p><strong>Nombre:</strong> <?php echo htmlspecialchars($usuario['nombre'] !== '' ? $usuario['nombre'] : 'Sin completar', ENT_QUOTES, 'UTF-8'); ?></p>
                    <p><strong>Apellido:</strong> <?php echo htmlspecialchars($usuario['apellido'] !== '' ? $usuario['apellido'] : 'Sin completar', ENT_QUOTES, 'UTF-8'); ?></p>
                    <p><strong>DNI:</strong> <?php echo htmlspecialchars($usuario['dni'] !== '' ? $usuario['dni'] : 'Sin completar', ENT_QUOTES, 'UTF-8'); ?></p>
                    <p><strong>Telefono:</strong> <?php echo htmlspecialchars($usuario['telefono'] !== '' ? $usuario['telefono'] : 'Sin completar', ENT_QUOTES, 'UTF-8'); ?></p>
                    <p><strong>Tarjeta:</strong> <?php echo !empty($usuario['tarjeta']) ? 'Cargada' : 'No cargada'; ?></p>
                </div>
                <a class="enlace-boton principal" href="index.php?pagina=perfil&editar=1">EDITAR PERFIL</a>
            <?php endif; ?>
        <?php endif; ?>
    </main>
    <!-- Barra de navegacion ubicada al pie de la pantalla. -->
    <nav>
        <?php mostrar_estado($pagina, 'inicio', '&#8962;<br>INICIO'); ?>
        <?php mostrar_estado($pagina, 'estacionar', '&#128664;<br>ESTACIONAR'); ?>
        <?php mostrar_estado($pagina, 'saldo', '$<br>SALDO'); ?>
        <?php mostrar_estado($pagina, 'perfil', '&#128100;<br>PERFIL'); ?>
    </nav>
</div>
</body>
</html>
