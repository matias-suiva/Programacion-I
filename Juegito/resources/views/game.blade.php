<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="RPG Web - Mazmorra Antigua - Juego de rol por turnos estilo Dragon Quest">
    <title>RPG Mazmorra Antigua</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Nunito:wght@600;700;800&family=Press+Start+2P&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/game/css/game.css">
</head>
<body>
    <div id="game-container">

        <!-- Pantalla de la mazmorra (exploración) -->
        <div id="dungeon-screen" class="game-screen">
            <!-- Canvas del mapa -->
            <canvas id="dungeon-canvas"></canvas>

            <!-- UI overlay sobre el mapa -->
            <div id="zone-label" class="fantasy-box">Mazmorra Antigua - Piso 1</div>

            <div id="minimap-container" class="parchment-box">
                <canvas id="minimap-canvas" width="180" height="135"></canvas>
            </div>

            <div id="objective-panel" class="fantasy-box">
                <div id="objective-title">Objetivo</div>
                <div id="objective-text">Explora la mazmorra y encuentra la salida.</div>
            </div>

            <!-- Banner de encuentro al chocar enemigo -->
            <div id="encounter-banner" class="encounter-banner hidden">
                <div class="banner-inner">¡Aparecieron enemigos!</div>
            </div>

            <!-- Controles de ayuda en esquina inferior -->
            <div id="controls-hint" class="controls-hint">
                <span>[WASD / Flechas] Moverse &nbsp;|&nbsp; [Espacio / E] Abrir Cofres / Interactuar</span>
            </div>
        </div>

        <!-- Pantalla de batalla (combate por turnos) -->
        <div id="battle-screen" class="game-screen">
            <!-- Fondo y Área de Enemigos -->
            <div id="battle-arena">
                <canvas id="battle-canvas"></canvas>
            </div>

            <!-- UI de Batalla Inferior -->
            <div id="battle-ui">
                <!-- Tarjetas del Grupo (4 personajes) -->
                <div id="party-container">
                    <!-- Las tarjetas se generan dinámicamente en battle.js -->
                </div>

                <!-- Panel de Comandos y Descripción -->
                <div id="action-panel">
                    <div id="action-menu" class="fantasy-box">
                        <ul>
                            <li class="action-option active" data-action="attack"><span class="cursor">▶</span> Atacar</li>
                            <li class="action-option" data-action="skills"><span class="cursor"></span> Habilidades</li>
                            <li class="action-option" data-action="magic"><span class="cursor"></span> Magia</li>
                            <li class="action-option" data-action="items"><span class="cursor"></span> Objetos</li>
                            <li class="action-option" data-action="defend"><span class="cursor"></span> Defender</li>
                        </ul>
                    </div>
                    <div id="action-description" class="fantasy-box">
                        <div id="desc-title">Atacar</div>
                        <div id="desc-text">Realiza un ataque normal contra 1 enemigo.</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pantalla de carga -->
        <div id="loading-screen" class="game-screen active">
            <div id="loading-content">
                <h1 class="game-title">⚔️ RPG Mazmorra Antigua</h1>
                <p class="loading-subtitle">Cargando datos del juego...</p>
                <div id="loading-bar">
                    <div id="loading-bar-fill"></div>
                </div>
            </div>
        </div>

    </div>

    <!-- Scripts del juego -->
    <script src="/game/js/player.js"></script>
    <script src="/game/js/enemy.js"></script>
    <script src="/game/js/ui.js"></script>
    <script src="/game/js/dungeon.js"></script>
    <script src="/game/js/battle.js"></script>
    <script src="/game/js/main.js"></script>
</body>
</html>
