<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flappy Bird</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="game-container">
        <canvas id="game-canvas"></canvas>
        <div id="ui">
            <div id="score">0</div>
            <div id="best-score">Mejor: <span id="best-value">0</span></div>
            <div id="start-screen" class="screen">
                <h1>Flappy Bird</h1>
                <p>Presiona ESPACIO o CLICK para jugar</p>
                <button id="start-btn">Iniciar</button>
            </div>
            <div id="game-over-screen" class="screen hidden">
                <h1>Game Over</h1>
                <div id="final-score">Puntuación: 0</div>
                <button id="restart-btn">Reiniciar</button>
            </div>
        </div>
    </div>
    <script src="game.js"></script>
</body>
</html>