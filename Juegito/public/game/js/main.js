/**
 * main.js — Loop principal, captura de teclado y control del juego
 */

(() => {
    let lastTime = 0;
    let keysDown = {};
    let isGameRunning = false;
    let encounterCooldown = 0;

    /**
     * Inicialización del juego y carga de recursos.
     */
    async function initGame() {
        console.log('⚔️ Iniciando RPG Mazmorra Antigua...');

        try {
            UI.initUI();
            UI.setLoadingProgress(15);

            // 1. Cargar héroes del grupo
            await PlayerManager.loadParty();
            UI.setLoadingProgress(40);

            // 2. Cargar tipos de enemigo
            await EnemyManager.loadEnemyTypes();
            UI.setLoadingProgress(65);

            // 3. Cargar datos de la mazmorra
            const mazmorra = await Dungeon.loadMazmorra(1);
            UI.setLoadingProgress(85);

            // 4. Inicializar motores gráficos y posiciones
            Dungeon.initCanvas();
            const tileSize = Dungeon.getTileSize();
            PlayerManager.initMapPosition(Dungeon.getEntryPos(), tileSize);
            EnemyManager.initMapSpawns(mazmorra.spawns || []);

            // 5. Configurar UI
            UI.setZoneLabel(`${mazmorra.nombre} - Piso ${mazmorra.piso}`);
            UI.setObjective(mazmorra.objetivo || 'Explora la mazmorra y encuentra la salida.');

            // 6. Registrar controles de teclado
            setupKeyboardInput();

            UI.setLoadingProgress(100);
            await new Promise(resolve => setTimeout(resolve, 400));

            // 7. Mostrar pantalla de exploración y arrancar loop
            UI.showScreen('dungeon-screen');
            isGameRunning = true;
            lastTime = performance.now();
            requestAnimationFrame(gameLoop);

            console.log('✅ Mazmorra lista para explorar');

        } catch (error) {
            console.error('❌ Error fatal al inicializar el juego:', error);
            const loadingContent = document.getElementById('loading-content');
            if (loadingContent) {
                loadingContent.innerHTML = `
                    <h1 class="game-title" style="color: #e53e3e;">⚠️ Error de Carga</h1>
                    <p class="loading-subtitle">No se pudieron obtener los datos de la API.</p>
                    <p style="color: #a0aec0; font-size: 0.85rem; margin-top: 10px;">${error.message}</p>
                `;
            }
        }
    }

    /**
     * Configuración del manejador de teclado (WASD y Flechas).
     */
    function setupKeyboardInput() {
        window.addEventListener('keydown', (e) => {
            const screen = document.getElementById('battle-screen');
            if (screen && screen.classList.contains('active')) {
                if (window.Battle && typeof window.Battle.handleInput === 'function') {
                    window.Battle.handleInput(e.key);
                } else if (typeof Battle !== 'undefined' && Battle.handleInput) {
                    Battle.handleInput(e.key);
                }
                e.preventDefault();
                return;
            }

            const key = e.key.toLowerCase();
            const blockedKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd', 'e', 'enter'];

            if (blockedKeys.includes(key)) {
                e.preventDefault();
            }

            // Interacción con cofres o entorno (Espacio, E, Enter)
            if (key === ' ' || key === 'e' || key === 'enter') {
                if (isGameRunning && !PlayerManager.isMoving()) {
                    const playerTilePos = PlayerManager.getTilePos();
                    const playerDir = PlayerManager.getDirection();
                    const result = Dungeon.checkInteraction(playerTilePos.x, playerTilePos.y, playerDir);
                    if (result) {
                        if (result.type === 'chest_looted') {
                            UI.showEncounterBanner(`🎁 ¡Cofre Abierto! ${result.loot.text}`, 3000);
                        } else if (result.type === 'chest_empty') {
                            UI.showEncounterBanner(`📦 ${result.text}`, 2000);
                        } else if (result.type === 'exit_reached') {
                            UI.showEncounterBanner(`🏆 ¡Escalera al Piso 2! Has completado el Piso 1.`, 4000);
                        }
                    }
                }
            }

            keysDown[key] = true;
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            keysDown[key] = false;
        });
    }

    /**
     * Reanuda el juego tras una batalla.
     */
    window.resumeExploration = function() {
        isGameRunning = true;
        encounterCooldown = 2.0; // Breve invulnerabilidad al volver
        lastTime = performance.now();
        keysDown = {}; // Limpiar estado del teclado
        requestAnimationFrame(gameLoop);
    };

    /**
     * Procesa los inputs continuos del jugador.
     */
    function processInput() {
        if (PlayerManager.isMoving()) return;

        if (keysDown['arrowup'] || keysDown['w']) {
            PlayerManager.tryMove('up');
        } else if (keysDown['arrowdown'] || keysDown['s']) {
            PlayerManager.tryMove('down');
        } else if (keysDown['arrowleft'] || keysDown['a']) {
            PlayerManager.tryMove('left');
        } else if (keysDown['arrowright'] || keysDown['d']) {
            PlayerManager.tryMove('right');
        }
    }

    /**
     * Loop principal de renderizado y lógica (60 FPS).
     */
    function gameLoop(currentTime) {
        if (!isGameRunning) return;

        const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1); // Delta time en segundos
        lastTime = currentTime;

        // 1. Manejo de inputs del teclado
        processInput();

        // 2. Actualizar posición del jugador
        const tileSize = Dungeon.getTileSize();
        PlayerManager.update(deltaTime, tileSize);

        const playerPixelPos = PlayerManager.getPixelPos();
        const playerTilePos = PlayerManager.getTilePos();
        const playerDir = PlayerManager.getDirection();
        const isMoving = PlayerManager.isMoving();

        // 3. Actualizar cámara para seguir al jugador
        Dungeon.updateCamera(playerPixelPos.x, playerPixelPos.y);

        // 4. Renderizar el mundo en el canvas
        Dungeon.render(deltaTime, playerPixelPos, playerDir, isMoving);

        // 5. Renderizar minimapa en tiempo real
        UI.renderMinimap(playerTilePos.x, playerTilePos.y, playerDir);

        // 6. Detección de colisiones contra enemigos
        if (encounterCooldown > 0) {
            encounterCooldown -= deltaTime;
        } else if (isGameRunning) {
            const collidedEnemy = EnemyManager.checkPlayerCollision(playerTilePos.x, playerTilePos.y);
            if (collidedEnemy) {
                // Detener el juego (exploración) temporalmente
                isGameRunning = false;
                encounterCooldown = 5.0; // Evita múltiples triggers
                
                // Quitamos al enemigo del mapa para no volver a chocar
                EnemyManager.removeEnemy(collidedEnemy);
                
                UI.showEncounterBanner(`¡Aparecieron enemigos!`, 2000);
                console.log(`⚔️ [Encuentro] Batalla iniciada contra ${collidedEnemy.nombre}`);

                // Transición a la pantalla de batalla después de la animación del banner
                setTimeout(() => {
                    Battle.initBattleUI(PlayerManager.getParty(), collidedEnemy.tipo_id);
                    UI.showScreen('battle-screen');
                }, 1500);
            }
        }

        requestAnimationFrame(gameLoop);
    }

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        initGame();
    }
})();
