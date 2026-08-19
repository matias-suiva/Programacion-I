/**
 * dungeon.js — Motor de renderizado del mapa de mazmorra en Canvas
 * Estilo Dragon Quest / Final Fantasy clásico
 */

const Dungeon = (() => {
    let canvas = null;
    let ctx = null;
    let mazmorraData = null;
    let layout = [];
    let widthInTiles = 20;
    let heightInTiles = 15;
    const TILE_SIZE = 54; // Tamaño de cada tile en píxeles

    // Cámara
    let cameraX = 0;
    let cameraY = 0;

    // Decoraciones y antorchas
    let torches = [];
    let decorList = [];
    let exitPos = { x: 16, y: 12 };
    let entryPos = { x: 2, y: 2 };

    // Tiempo acumulado para animaciones de fuego/luces
    let animTimer = 0;

    /**
     * Carga los datos de la mazmorra desde la API.
     */
    async function loadMazmorra(id = 1) {
        const response = await fetch(`/api/mazmorras/${id}`);
        if (!response.ok) throw new Error('Error cargando mazmorra');
        mazmorraData = await response.json();
        layout = mazmorraData.layout;
        widthInTiles = mazmorraData.ancho;
        heightInTiles = mazmorraData.alto;

        parseDungeonFeatures();
        return mazmorraData;
    }

    /**
     * Analiza el mapa para extraer antorchas, cofres, barriles y salidas.
     */
    function parseDungeonFeatures() {
        torches = [];
        decorList = [];

        // Generar antorchas en paredes adyacentes a suelos
        for (let y = 0; y < heightInTiles; y++) {
            for (let x = 0; x < widthInTiles; x++) {
                const cell = layout[y][x];

                // Entrada
                if (cell === 3) {
                    entryPos = { x, y };
                }
                // Salida
                if (cell === 4) {
                    exitPos = { x, y };
                }

                // Decoración tipo 2 (cofres de tesoro, barriles, vasijas)
                if (cell === 2) {
                    let decorType = 'pot';
                    let loot = null;
                    if ((x === 3 && y === 4) || (x === 17 && y === 4) || (x === 17 && y === 10) || (x === 3 && y === 13)) {
                        decorType = 'chest';
                        if (x === 3 && y === 4) {
                            loot = { itemId: 'pocion_hp', count: 2, gold: 30, text: '2 Pociones de Salud y 30 Monedas de Oro' };
                        } else if (x === 17 && y === 4) {
                            loot = { itemId: 'eter_mp', count: 2, gold: 40, text: '2 Éteres Mágicos y 40 Monedas de Oro' };
                        } else if (x === 17 && y === 10) {
                            loot = { itemId: 'pluma_fenix', count: 1, gold: 50, text: '1 Pluma de Fénix y 50 Monedas de Oro' };
                        } else {
                            loot = { itemId: 'bomba_fuego', count: 2, gold: 25, text: '2 Bombas de Fuego y 25 Monedas de Oro' };
                        }
                    } else if (x === 2 && y === 9 || x === 9 && y === 10) {
                        decorType = 'barrel';
                    } else {
                        decorType = (x % 2 === 0) ? 'pot' : 'barrel';
                    }
                    decorList.push({ x, y, type: decorType, loot, opened: false });
                }

                // Colocar antorchas en paredes que dan al suelo
                if (cell === 1 && y < heightInTiles - 1 && (layout[y + 1][x] === 0 || layout[y + 1][x] === 2)) {
                    if (x % 4 === 1 || x % 4 === 3) {
                        torches.push({ x, y, flicker: Math.random() * Math.PI * 2 });
                    }
                }
            }
        }

        // Si hay pocos, agregar antorchas decorativas clave
        if (torches.length < 3) {
            torches.push({ x: 2, y: 1, flicker: 0 });
            torches.push({ x: 6, y: 1, flicker: 1.5 });
            torches.push({ x: 14, y: 1, flicker: 3 });
        }
    }

    /**
     * Inicializa el canvas.
     */
    function initCanvas() {
        canvas = document.getElementById('dungeon-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    /**
     * Verifica si una coordenada de tile es sólida / transitable.
     */
    function isWalkable(tileX, tileY) {
        if (tileX < 0 || tileX >= widthInTiles || tileY < 0 || tileY >= heightInTiles) {
            return false;
        }
        const cell = layout[tileY][tileX];
        // 0 = suelo, 3 = entrada, 4 = salida son transitables
        // 1 = pared, 2 = decoración sólida
        return cell === 0 || cell === 3 || cell === 4;
    }

    /**
     * Actualiza la cámara para seguir al jugador de forma suave.
     */
    function updateCamera(targetPixelX, targetPixelY) {
        if (!canvas) return;
        const targetCamX = targetPixelX - canvas.width / 2;
        const targetCamY = targetPixelY - canvas.height / 2;

        // Suavizado de cámara
        cameraX += (targetCamX - cameraX) * 0.15;
        cameraY += (targetCamY - cameraY) * 0.15;
    }

    /**
     * Renderizado principal de la mazmorra.
     */
    function render(deltaTime, playerPixelPos, playerDir, isMoving) {
        if (!ctx || !canvas || !layout.length) return;
        animTimer += deltaTime;

        // Limpiar pantalla
        ctx.fillStyle = '#050608';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(-Math.round(cameraX), -Math.round(cameraY));

        // 1. Dibujar Suelos y Paredes
        drawDungeonTiles();

        // 2. Dibujar Decoraciones fijas (cofres, barriles, vasijas)
        drawDecorations();

        // 3. Dibujar Entrada y Salida
        drawSpecialTiles();

        // 4. Dibujar Enemigos del mapa (desde enemy.js)
        EnemyManager.renderMapEnemies(ctx, TILE_SIZE, animTimer, playerPixelPos);

        // 5. Dibujar al Jugador (desde player.js)
        PlayerManager.renderPlayer(ctx, TILE_SIZE, animTimer, isMoving);

        // 6. Dibujar Capa de Iluminación y Antorchas
        drawLighting(playerPixelPos);

        ctx.restore();
    }

    /**
     * Dibuja los tiles del mapa (suelo de piedra y paredes con profundidad).
     */
    function drawDungeonTiles() {
        for (let y = 0; y < heightInTiles; y++) {
            for (let x = 0; x < widthInTiles; x++) {
                const cell = layout[y][x];
                const px = x * TILE_SIZE;
                const py = y * TILE_SIZE;

                // Suelo de piedra (para celdas de suelo o base bajo decoraciones)
                if (cell !== 1) {
                    drawFloorTile(px, py, x, y);
                }

                // Pared de piedra
                if (cell === 1) {
                    drawWallTile(px, py, x, y);
                }
            }
        }
    }

    /**
     * Dibuja un tile de suelo de losa de piedra con textura.
     */
    function drawFloorTile(px, py, tx, ty) {
        // Base de piedra oscura con variación sutil
        const seed = (tx * 73 + ty * 37) % 10;
        let baseColor = '#1f2427';
        if (seed > 6) baseColor = '#1c2023';
        else if (seed < 3) baseColor = '#242a2e';

        ctx.fillStyle = baseColor;
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        // Grid / juntas de adoquines
        ctx.strokeStyle = '#121518';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(px + 0.5, py + 0.5, TILE_SIZE, TILE_SIZE);

        // Patrón interno de 4 baldosas
        const half = TILE_SIZE / 2;
        ctx.strokeStyle = 'rgba(18, 21, 24, 0.6)';
        ctx.beginPath();
        ctx.moveTo(px + half, py);
        ctx.lineTo(px + half, py + TILE_SIZE);
        ctx.moveTo(px, py + half);
        ctx.lineTo(px + TILE_SIZE, py + half);
        ctx.stroke();

        // Pequeños toques de musgo verdoso procedural
        if ((tx + ty * 3) % 7 === 0) {
            ctx.fillStyle = 'rgba(40, 70, 45, 0.35)';
            ctx.fillRect(px + 4, py + 4, 10, 6);
        } else if ((tx * 2 + ty) % 11 === 0) {
            ctx.fillStyle = 'rgba(45, 75, 50, 0.3)';
            ctx.fillRect(px + half + 4, py + half + 2, 8, 8);
        }
    }

    /**
     * Dibuja un tile de pared de piedra con cara superior e iluminación 2.5D.
     */
    function drawWallTile(px, py, tx, ty) {
        // ¿Hay pared debajo?
        const hasWallBelow = (ty < heightInTiles - 1 && layout[ty + 1][tx] === 1);

        // Cara superior de la pared (borde superior más claro)
        ctx.fillStyle = '#3a4247';
        ctx.fillRect(px, py, TILE_SIZE, 14);

        ctx.fillStyle = '#4f5a60';
        ctx.fillRect(px, py, TILE_SIZE, 3); // Highlight superior

        // Cara frontal de bloques de piedra
        ctx.fillStyle = '#22272b';
        ctx.fillRect(px, py + 14, TILE_SIZE, TILE_SIZE - 14);

        // Bloques de piedra frontales (ladrillos tallados)
        ctx.strokeStyle = '#14181a';
        ctx.lineWidth = 1.5;

        // Línea horizontal de bloques
        ctx.beginPath();
        ctx.moveTo(px, py + 34);
        ctx.lineTo(px + TILE_SIZE, py + 34);
        ctx.stroke();

        // Líneas verticales alternadas de ladrillos
        ctx.beginPath();
        const offset = (ty % 2 === 0) ? 0 : TILE_SIZE / 2;
        ctx.moveTo(px + (TILE_SIZE / 2 + offset) % TILE_SIZE, py + 14);
        ctx.lineTo(px + (TILE_SIZE / 2 + offset) % TILE_SIZE, py + 34);

        ctx.moveTo(px + (TILE_SIZE / 4 + offset) % TILE_SIZE, py + 34);
        ctx.lineTo(px + (TILE_SIZE / 4 + offset) % TILE_SIZE, py + TILE_SIZE);
        ctx.stroke();

        // Sombra de pared en el suelo inferior si no hay pared abajo
        if (!hasWallBelow) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.fillRect(px, py + TILE_SIZE - 3, TILE_SIZE, 4);
        }
    }

    /**
     * Dibuja decoraciones fijas (cofres de tesoro, barriles de madera, vasijas).
     */
    function drawDecorations() {
        decorList.forEach(d => {
            const px = d.x * TILE_SIZE;
            const py = d.y * TILE_SIZE;

            if (d.type === 'chest') {
                drawChest(px + 8, py + 10, TILE_SIZE - 16, TILE_SIZE - 18, d.opened);
            } else if (d.type === 'barrel') {
                drawBarrel(px + 10, py + 8, TILE_SIZE - 20, TILE_SIZE - 14);
            } else if (d.type === 'pot') {
                drawPot(px + 12, py + 12, TILE_SIZE - 24, TILE_SIZE - 18);
            }
        });
    }

    /**
     * Dibuja un Cofre del Tesoro estilo RPG clásico (madera roja con ribetes dorados).
     */
    function drawChest(x, y, w, h, opened = false) {
        // Sombra en el suelo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h + 2, w / 2 + 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        if (opened) {
            // Cofre Abierto
            ctx.fillStyle = '#45100c';
            ctx.fillRect(x, y + 6, w, h - 6);

            ctx.fillStyle = '#230b08';
            ctx.fillRect(x + 3, y + 8, w - 6, h - 10);

            // Tapa abierta hacia atrás/arriba
            ctx.fillStyle = '#a8322a';
            ctx.beginPath();
            ctx.moveTo(x - 2, y + 6);
            ctx.lineTo(x + w + 2, y + 6);
            ctx.lineTo(x + w + 2, y - 5);
            ctx.lineTo(x - 2, y - 5);
            ctx.closePath();
            ctx.fill();

            // Bandas doradas
            ctx.fillStyle = '#d4af37';
            ctx.fillRect(x + 2, y + 6, 3, h - 6);
            ctx.fillRect(x + w - 5, y + 6, 3, h - 6);
            ctx.fillRect(x + 2, y - 5, 3, 11);
            ctx.fillRect(x + w - 5, y - 5, 3, 11);
        } else {
            // Cofre Cerrado
            // Cuerpo del cofre (madera rubí oscuro)
            ctx.fillStyle = '#8b251e';
            ctx.fillRect(x, y, w, h);

            // Borde superior / tapa
            ctx.fillStyle = '#a8322a';
            ctx.fillRect(x, y, w, h * 0.45);

            // Bandas doradas de refuerzo
            ctx.fillStyle = '#d4af37';
            ctx.fillRect(x, y, 4, h);
            ctx.fillRect(x + w - 4, y, 4, h);
            ctx.fillRect(x, y + h * 0.4, w, 3);

            // Cerradura dorada en el centro
            ctx.fillStyle = '#ffe066';
            ctx.fillRect(x + w / 2 - 3, y + h * 0.35, 6, 7);
            ctx.fillStyle = '#221500';
            ctx.fillRect(x + w / 2 - 1, y + h * 0.38, 2, 3);
        }
    }

    /**
     * Comprueba interacción con cofres o escaleras adyacentes o bajo el jugador.
     */
    function checkInteraction(playerTileX, playerTileY, playerDir) {
        let checkX = playerTileX;
        let checkY = playerTileY;

        if (playerDir === 'up') checkY--;
        else if (playerDir === 'down') checkY++;
        else if (playerDir === 'left') checkX--;
        else if (playerDir === 'right') checkX++;

        // 1. Buscar cofre adyacente o en la misma casilla
        const decor = decorList.find(d => 
            (d.x === checkX && d.y === checkY) || 
            (d.x === playerTileX && d.y === playerTileY)
        );

        if (decor && decor.type === 'chest') {
            if (!decor.opened) {
                decor.opened = true;
                if (decor.loot) {
                    if (decor.loot.itemId) {
                        PlayerManager.addItem(decor.loot.itemId, decor.loot.count || 1);
                    }
                    if (decor.loot.gold) {
                        PlayerManager.addGold(decor.loot.gold);
                    }
                    return { type: 'chest_looted', loot: decor.loot };
                }
                return { type: 'chest_looted', loot: { text: '¡El cofre estaba vacío!' } };
            } else {
                return { type: 'chest_empty', text: 'El cofre ya ha sido saqueado.' };
            }
        }

        // 2. Comprobar salida/escaleras
        if (playerTileX === exitPos.x && playerTileY === exitPos.y) {
            return { type: 'exit_reached' };
        }

        return null;
    }

    /**
     * Dibuja un barril de madera.
     */
    function drawBarrel(x, y, w, h) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h + 2, w / 2, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cuerpo de madera
        ctx.fillStyle = '#6b4423';
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 6);
        ctx.fill();

        // Aros de hierro
        ctx.fillStyle = '#2d2f33';
        ctx.fillRect(x, y + 4, w, 3);
        ctx.fillRect(x, y + h - 7, w, 3);
    }

    /**
     * Dibuja una vasija/tinaja de barro.
     */
    function drawPot(x, y, w, h) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h + 2, w / 2 - 2, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Vientre de la vasija
        ctx.fillStyle = '#445544';
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h * 0.6, w / 2, h * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cuello
        ctx.fillStyle = '#384738';
        ctx.fillRect(x + w / 4, y, w / 2, h * 0.35);
        ctx.fillRect(x + w / 6, y - 1, w * 0.66, 3);
    }

    /**
     * Dibuja el tile de entrada y salida con portales/escaleras.
     */
    function drawSpecialTiles() {
        // Entrada (alfombra de piedra o portal)
        const inPx = entryPos.x * TILE_SIZE;
        const inPy = entryPos.y * TILE_SIZE;
        ctx.strokeStyle = 'rgba(100, 160, 240, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(inPx + 6, inPy + 6, TILE_SIZE - 12, TILE_SIZE - 12);

        // Salida (escalera hacia abajo iluminada)
        const outPx = exitPos.x * TILE_SIZE;
        const outPy = exitPos.y * TILE_SIZE;

        // Foso de escaleras
        ctx.fillStyle = '#08080c';
        ctx.fillRect(outPx + 4, outPy + 4, TILE_SIZE - 8, TILE_SIZE - 8);

        // Peldaños dorados descendentes
        for (let i = 0; i < 4; i++) {
            ctx.fillStyle = `rgb(${70 + i * 20}, ${60 + i * 15}, ${30 + i * 10})`;
            ctx.fillRect(outPx + 6, outPy + 8 + i * 9, TILE_SIZE - 12, 6);
        }
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(outPx + 4, outPy + 4, TILE_SIZE - 8, TILE_SIZE - 8);
    }

    /**
     * Dibuja el sistema de iluminación: antorchas con fuego oscilante y niebla/oscuridad radial.
     */
    function drawLighting(playerPixelPos) {
        // 1. Dibujar sprites de antorchas en paredes
        torches.forEach(t => {
            const tx = t.x * TILE_SIZE + TILE_SIZE / 2;
            const ty = t.y * TILE_SIZE + TILE_SIZE - 6;

            // Soporte de hierro
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(tx - 2, ty - 6, 4, 10);
            ctx.fillRect(tx - 4, ty - 8, 8, 3);

            // Llama animada con flickering
            const flick = Math.sin(animTimer * 12 + t.flicker) * 2;
            const flameHeight = 10 + Math.cos(animTimer * 16 + t.flicker) * 3;

            // Halo amarillo/naranja
            const flameGrad = ctx.createRadialGradient(tx + flick * 0.5, ty - 12, 1, tx, ty - 12, 12);
            flameGrad.addColorStop(0, '#ffffff');
            flameGrad.addColorStop(0.3, '#ffcc00');
            flameGrad.addColorStop(0.7, '#ff5500');
            flameGrad.addColorStop(1, 'rgba(255, 60, 0, 0)');

            ctx.fillStyle = flameGrad;
            ctx.beginPath();
            ctx.arc(tx + flick * 0.5, ty - 10, flameHeight, 0, Math.PI * 2);
            ctx.fill();
        });

        // 2. Capa de Oscuridad Ambiental y Luces Radiales (Blend Mode Screen/Multiply)
        // Dibujamos luces con gradiente cálido sobre el mapa
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // Luz del Jugador (halo cálido)
        if (playerPixelPos) {
            const pGrad = ctx.createRadialGradient(
                playerPixelPos.x, playerPixelPos.y, 10,
                playerPixelPos.x, playerPixelPos.y, 140
            );
            pGrad.addColorStop(0, 'rgba(255, 230, 180, 0.28)');
            pGrad.addColorStop(0.6, 'rgba(255, 170, 70, 0.12)');
            pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = pGrad;
            ctx.beginPath();
            ctx.arc(playerPixelPos.x, playerPixelPos.y, 140, 0, Math.PI * 2);
            ctx.fill();
        }

        // Luz de cada antorcha
        torches.forEach(t => {
            const tx = t.x * TILE_SIZE + TILE_SIZE / 2;
            const ty = t.y * TILE_SIZE + TILE_SIZE - 6;
            const radius = 170 + Math.sin(animTimer * 8 + t.flicker) * 15;

            const tGrad = ctx.createRadialGradient(tx, ty, 5, tx, ty, radius);
            tGrad.addColorStop(0, 'rgba(255, 200, 100, 0.35)');
            tGrad.addColorStop(0.4, 'rgba(255, 120, 30, 0.15)');
            tGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = tGrad;
            ctx.beginPath();
            ctx.arc(tx, ty, radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Luz en la salida
        const outX = exitPos.x * TILE_SIZE + TILE_SIZE / 2;
        const outY = exitPos.y * TILE_SIZE + TILE_SIZE / 2;
        const outGrad = ctx.createRadialGradient(outX, outY, 5, outX, outY, 110);
        outGrad.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        outGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = outGrad;
        ctx.beginPath();
        ctx.arc(outX, outY, 110, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    return {
        loadMazmorra,
        initCanvas,
        isWalkable,
        updateCamera,
        render,
        getData: () => mazmorraData,
        getTileSize: () => TILE_SIZE,
        getDimensions: () => ({ width: widthInTiles, height: heightInTiles, layout }),
        getEntryPos: () => entryPos,
        getExitPos: () => exitPos,
        checkInteraction,
    };
})();
