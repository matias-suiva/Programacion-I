<?php
// Estas variables guardan los datos que luego se mostrarán en la página.
$nombre = '';
$prod = null;

// El bloque solo se ejecuta después de enviar el formulario mediante POST.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Se leen los valores enviados; ?? evita errores si algún campo no existe.
    $nombre = trim($_POST['nombre'] ?? '');
    $num1 = $_POST['num1'] ?? null;
    $num2 = $_POST['num2'] ?? null;

    // Solo se calcula la multiplicación cuando ambos valores son números válidos.
    if (is_numeric($num1) && is_numeric($num2)) {
        $prod = (float) $num1 * (float) $num2;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulario</title>
    <style>
        :root {
            --color-fondo: #eef4f1;
            --color-panel: #ffffff;
            --color-texto: #18312b;
            --color-secundario: #58736a;
            --color-acento: #d86f45;
            --color-acento-hover: #b95732;
            --color-borde: #cbdad4;
            --sombra: 0 18px 45px rgba(24, 49, 43, 0.12);
        }

        * {
            box-sizing: border-box;
        }

        body {
            min-height: 100vh;
            margin: 0;
            display: grid;
            place-items: center;
            padding: 24px;
            background: linear-gradient(135deg, #dcebe5, var(--color-fondo));
            color: var(--color-texto);
            font-family: Georgia, "Times New Roman", serif;
        }

        main {
            width: min(100%, 480px);
            padding: 40px;
            background: var(--color-panel);
            border: 1px solid rgba(203, 218, 212, 0.8);
            border-radius: 8px;
            box-shadow: var(--sombra);
        }

        h1 {
            margin: 0 0 28px;
            font-size: clamp(2rem, 6vw, 3rem);
            line-height: 1;
        }

        form {
            display: grid;
            gap: 20px;
        }

        form div {
            display: grid;
            gap: 8px;
        }

        label {
            color: var(--color-secundario);
            font-size: 0.95rem;
            font-weight: bold;
        }

        input {
            width: 100%;
            padding: 13px 14px;
            border: 1px solid var(--color-borde);
            border-radius: 4px;
            background: #fbfdfc;
            color: var(--color-texto);
            font: inherit;
            font-family: Arial, sans-serif;
        }

        input:focus {
            outline: 3px solid rgba(216, 111, 69, 0.2);
            border-color: var(--color-acento);
        }

        button {
            margin-top: 4px;
            padding: 14px 20px;
            border: 0;
            border-radius: 4px;
            background: var(--color-acento);
            color: #ffffff;
            cursor: pointer;
            font: inherit;
            font-weight: bold;
            transition: background-color 160ms ease, transform 160ms ease;
        }

        button:hover {
            background: var(--color-acento-hover);
            transform: translateY(-1px);
        }

        button:focus-visible {
            outline: 3px solid rgba(216, 111, 69, 0.35);
            outline-offset: 3px;
        }

        @media (max-width: 480px) {
            main {
                padding: 28px 22px;
            }
        }
    </style>
</head>
<body>
    <main>
        <h1>Formulario de multiplicación</h1>

        <!--
            Se vuelve a abrir PHP porque aquí empieza código dinámico dentro del HTML.
            El HTML crea la estructura y PHP decide si se muestra el resultado.
            La sintaxis alternativa if: ... endif; permite mezclar ambos lenguajes.
        -->
        <?php if ($prod !== null): ?>
            <section aria-live="polite">
                <!-- htmlspecialchars muestra el texto sin interpretar código HTML enviado. -->
                <p>Nombre: <?= htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8') ?></p>
                <p>Producto: <?= htmlspecialchars((string) $prod, ENT_QUOTES, 'UTF-8') ?></p>
            </section>
        <?php endif; ?>

        <form action="backend.php" method="POST">
            <div>
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" required>
            </div>

            <div>
                <label for="num1">Número 1:</label>
                <input type="number" id="num1" name="num1" required>
            </div>

            <div>
                <label for="num2">Número 2:</label>
                <input type="number" id="num2" name="num2" required>
            </div>

            <button type="submit">Enviar</button>
        </form>
    </main>
</body>
</html>
