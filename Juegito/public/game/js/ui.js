/**
 * ui.js — Gestión de la interfaz de usuario, minimapa y notificaciones
 */

const UI = (() => {
    let minimapCanvas = null;
    let minimapCtx = null;
    let encounterBannerTimer = null;

    function initUI() {
        minimapCanvas = document.getElementById('minimap-canvas');
        if (minimapCanvas) {
            minimapCtx = minimapCanvas.getContext('2d');
        }
    }

    /**
     * Muestra una pantalla específica y oculta las demás.
     */
    function showScreen(screenId) {
        document.querySelectorAll('.game-screen').forEach(s => {
            s.classList.remove('active');
        });
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add('active');
        }
    }

    /**
     * Actualiza el progreso de la barra de carga.
     */
    function setLoadingProgress(percent) {
        const fill = document.getElementById('loading-bar-fill');
        if (fill) {
            fill.style.width = Math.min(100, Math.max(0, percent)) + '%';
        }
    }

    /**
     * Actualiza el texto del objetivo actual.
     */
    function setObjective(text) {
        const el = document.getElementById('objective-text');
        if (el) el.textContent = text;
    }

    /**
     * Actualiza el nombre de la zona.
     */
    function setZoneLabel(text) {
        const el = document.getElementById('zone-label');
        if (el) el.textContent = text;
    }

    /**
     * Muestra un banner animado de encuentro con enemigos.
     */
    function showEncounterBanner(text = '¡Aparecieron enemigos!', durationMs = 2000) {
        const banner = document.getElementById('encounter-banner');
        if (!banner) return;

        const inner = banner.querySelector('.banner-inner');
        if (inner) inner.textContent = text;

        banner.classList.remove('hidden');

        if (encounterBannerTimer) clearTimeout(encounterBannerTimer);
        encounterBannerTimer = setTimeout(() => {
            banner.classList.add('hidden');
        }, durationMs);
    }

    /**
     * Renderiza el minimapa estilo pergamino en el canvas dedicado.
     */
    function renderMinimap(playerTileX, playerTileY, playerDir) {
        if (!minimapCtx || !minimapCanvas) return;

        const dungeonData = Dungeon.getDimensions();
        if (!dungeonData || !dungeonData.layout) return;

        const { width, height, layout } = dungeonData;
        const cWidth = minimapCanvas.width;
        const cHeight = minimapCanvas.height;

        // Fondo pergamino envejecido
        minimapCtx.fillStyle = '#bfa580';
        minimapCtx.fillRect(0, 0, cWidth, cHeight);

        // Calcular escala para centrar el mapa
        const padding = 10;
        const mapAreaW = cWidth - padding * 2;
        const mapAreaH = cHeight - padding * 2;
        const tileScaleX = mapAreaW / width;
        const tileScaleY = mapAreaH / height;
        const tileSize = Math.min(tileScaleX, tileScaleY);

        const offsetX = (cWidth - width * tileSize) / 2;
        const offsetY = (cHeight - height * tileSize) / 2;

        // 1. Dibujar habitaciones y pasillos
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell = layout[y][x];
                const px = offsetX + x * tileSize;
                const py = offsetY + y * tileSize;

                if (cell === 1) {
                    // Pared de piedra del minimapa
                    minimapCtx.fillStyle = '#4a3826';
                    minimapCtx.fillRect(px, py, tileSize, tileSize);
                } else {
                    // Suelo / camino
                    minimapCtx.fillStyle = '#edd6b1';
                    minimapCtx.fillRect(px, py, tileSize, tileSize);

                    // Borde sutil de casillas
                    minimapCtx.strokeStyle = 'rgba(100, 70, 40, 0.2)';
                    minimapCtx.lineWidth = 0.5;
                    minimapCtx.strokeRect(px, py, tileSize, tileSize);
                }
            }
        }

        // 2. Salida en el minimapa (cuadrado dorado)
        const exitPos = Dungeon.getExitPos();
        if (exitPos) {
            const exPx = offsetX + exitPos.x * tileSize;
            const exPy = offsetY + exitPos.y * tileSize;
            minimapCtx.fillStyle = '#ffd700';
            minimapCtx.fillRect(exPx + 1, exPy + 1, tileSize - 2, tileSize - 2);
            minimapCtx.strokeStyle = '#b8860b';
            minimapCtx.lineWidth = 1;
            minimapCtx.strokeRect(exPx + 1, exPy + 1, tileSize - 2, tileSize - 2);
        }

        // 3. Spawns de enemigos activos (puntos rojos sutiles)
        const mapEnemies = EnemyManager.getMapEnemies();
        mapEnemies.forEach(e => {
            if (e.activo) {
                const epX = offsetX + e.tileX * tileSize + tileSize / 2;
                const epY = offsetY + e.tileY * tileSize + tileSize / 2;
                minimapCtx.fillStyle = '#991b1b';
                minimapCtx.beginPath();
                minimapCtx.arc(epX, epY, Math.max(2, tileSize * 0.25), 0, Math.PI * 2);
                minimapCtx.fill();
            }
        });

        // 4. Marcador del Jugador (Flecha / Triángulo rojo estilo Dragon Quest)
        const pCenterX = offsetX + playerTileX * tileSize + tileSize / 2;
        const pCenterY = offsetY + playerTileY * tileSize + tileSize / 2;
        const markerSize = Math.max(5, tileSize * 0.65);

        minimapCtx.save();
        minimapCtx.translate(pCenterX, pCenterY);

        // Rotar triángulo según dirección
        if (playerDir === 'up') minimapCtx.rotate(0);
        else if (playerDir === 'right') minimapCtx.rotate(Math.PI / 2);
        else if (playerDir === 'down') minimapCtx.rotate(Math.PI);
        else if (playerDir === 'left') minimapCtx.rotate(-Math.PI / 2);

        // Triángulo rojo con borde negro
        minimapCtx.fillStyle = '#dc2626';
        minimapCtx.beginPath();
        minimapCtx.moveTo(0, -markerSize);
        minimapCtx.lineTo(markerSize * 0.7, markerSize * 0.7);
        minimapCtx.lineTo(-markerSize * 0.7, markerSize * 0.7);
        minimapCtx.closePath();
        minimapCtx.fill();

        minimapCtx.strokeStyle = '#450a0a';
        minimapCtx.lineWidth = 1.2;
        minimapCtx.stroke();

        minimapCtx.restore();
    }

    return {
        initUI,
        showScreen,
        setLoadingProgress,
        setObjective,
        setZoneLabel,
        showEncounterBanner,
        renderMinimap,
    };
})();
