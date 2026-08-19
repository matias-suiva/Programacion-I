/**
 * enemy.js — Gestión de tipos de enemigo y renderizado de enemigos en el mapa
 */

const EnemyManager = (() => {
    let enemyTypes = [];
    let mapEnemies = []; // Instancias de enemigos colocados en el mapa de mazmorra

    /**
     * Carga los tipos de enemigo desde la API.
     */
    async function loadEnemyTypes() {
        const response = await fetch('/api/enemigos');
        if (!response.ok) throw new Error('Error cargando enemigos');
        enemyTypes = await response.json();
        return enemyTypes;
    }

    /**
     * Inicializa los enemigos del mapa a partir de los spawns de la mazmorra.
     */
    function initMapSpawns(spawns) {
        mapEnemies = spawns.map((s, idx) => {
            const type = getEnemyTypeById(s.enemigo_id) || enemyTypes[0];
            return {
                id: s.id || (idx + 1),
                spawnId: s.id,
                tipo_id: s.enemigo_id,
                tipo: type,
                nombre: type ? type.nombre : 'Enemigo',
                tileX: s.tile_x,
                tileY: s.tile_y,
                activo: s.activo !== undefined ? s.activo : true,
                respawnCooldown: 0,
                alertLevel: 0, // 0 = calmo, 1 = alerta con '!'
                bobPhase: Math.random() * Math.PI * 2,
            };
        });
    }

    function getEnemyTypes() {
        return enemyTypes;
    }

    function getEnemyTypeById(id) {
        return enemyTypes.find(e => e.id === id);
    }

    function getMapEnemies() {
        return mapEnemies;
    }

    /**
     * Comprueba si el jugador está colisionando con algún enemigo activo en el mapa.
     * Retorna el enemigo con el que chocó o null.
     */
    function checkPlayerCollision(playerTileX, playerTileY) {
        for (const enemy of mapEnemies) {
            if (enemy.activo && enemy.tileX === playerTileX && enemy.tileY === playerTileY) {
                return enemy;
            }
        }
        return null;
    }

    /**
     * Marca un enemigo como inactivo para que desaparezca del mapa.
     */
    function removeEnemy(enemy) {
        if (enemy) enemy.activo = false;
    }

    /**
     * Renderiza todos los enemigos activos en el mapa con animación de flotación y globo de alerta '!'.
     */
    function renderMapEnemies(ctx, tileSize, animTimer, playerPixelPos) {
        mapEnemies.forEach(enemy => {
            if (!enemy.activo) return;

            const px = enemy.tileX * tileSize + tileSize / 2;
            const py = enemy.tileY * tileSize + tileSize / 2;

            // Distancia al jugador para activar el globo de alerta '!'
            let isNearPlayer = false;
            if (playerPixelPos) {
                const dist = Math.hypot(px - playerPixelPos.x, py - playerPixelPos.y);
                if (dist < tileSize * 3.2) {
                    isNearPlayer = true;
                }
            }

            const bob = Math.sin(animTimer * 4 + enemy.bobPhase) * 3;

            // Sombra en el suelo
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.beginPath();
            ctx.ellipse(px, py + 12, 14, 5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Dibujar Sprite específico según el tipo
            ctx.save();
            ctx.translate(px, py + bob);

            if (enemy.tipo && enemy.tipo.nombre.toLowerCase().includes('slime')) {
                drawMapSlime(ctx, animTimer);
            } else if (enemy.tipo && enemy.tipo.nombre.toLowerCase().includes('murci')) {
                drawMapBat(ctx, animTimer);
            } else {
                drawMapSkeleton(ctx, animTimer);
            }

            // Globo de alerta '!' si el jugador está cerca
            if (isNearPlayer) {
                drawAlertBubble(ctx, animTimer);
            }

            ctx.restore();
        });
    }

    /**
     * Dibuja un Slime clásico estilo Dragon Quest (gota azul con ojos grandes y sonrisa).
     */
    function drawMapSlime(ctx, animTimer) {
        const squish = Math.sin(animTimer * 6) * 1.5;

        // Cuerpo en forma de gota azul brillante
        ctx.fillStyle = '#3182ce';
        ctx.beginPath();
        ctx.moveTo(0, -16 - squish);
        ctx.bezierCurveTo(-14 - squish, -8, -16 - squish, 10 + squish, 0, 10 + squish);
        ctx.bezierCurveTo(16 + squish, 10 + squish, 14 + squish, -8, 0, -16 - squish);
        ctx.fill();

        // Borde exterior más oscuro
        ctx.strokeStyle = '#1a365d';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Brillo blanco en la cabeza (reflejo jelly)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.ellipse(-4, -6, 3, 2, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Ojos redondos blancos grandes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-5, 0, 4, 0, Math.PI * 2);
        ctx.arc(5, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        // Pupilas negras mirando al frente
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(-4.5, 0.5, 2, 0, Math.PI * 2);
        ctx.arc(5.5, 0.5, 2, 0, Math.PI * 2);
        ctx.fill();

        // Sonrisa pícara
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 3, 3.5, 0.2, Math.PI - 0.2);
        ctx.stroke();
    }

    /**
     * Dibuja un Murciélago morado con alas batientes.
     */
    function drawMapBat(ctx, animTimer) {
        const wingFlap = Math.sin(animTimer * 14) * 8;

        // Alas moradas
        ctx.fillStyle = '#6b46c1';
        ctx.beginPath();
        // Ala izquierda
        ctx.moveTo(-4, -2);
        ctx.lineTo(-18, -12 + wingFlap);
        ctx.lineTo(-12, 4);
        ctx.lineTo(-4, 2);
        // Ala derecha
        ctx.moveTo(4, -2);
        ctx.lineTo(18, -12 + wingFlap);
        ctx.lineTo(12, 4);
        ctx.lineTo(4, 2);
        ctx.fill();

        // Borde alas
        ctx.strokeStyle = '#322659';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Cuerpo redondo
        ctx.fillStyle = '#44337a';
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();

        // Orejas puntiagudas
        ctx.fillStyle = '#6b46c1';
        ctx.beginPath();
        ctx.moveTo(-5, -6);
        ctx.lineTo(-6, -13);
        ctx.lineTo(-2, -7);
        ctx.moveTo(5, -6);
        ctx.lineTo(6, -13);
        ctx.lineTo(2, -7);
        ctx.fill();

        // Ojos rojos
        ctx.fillStyle = '#e53e3e';
        ctx.fillRect(-4, -2, 2, 3);
        ctx.fillRect(2, -2, 2, 3);

        // Colmillos blancos
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-2, 3, 1.5, 2);
        ctx.fillRect(0.5, 3, 1.5, 2);
    }

    /**
     * Dibuja un Esqueleto.
     */
    function drawMapSkeleton(ctx, animTimer) {
        // Cráneo blanco/marfil
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(0, -6, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Cuencas de los ojos negras
        ctx.fillStyle = '#1a202c';
        ctx.beginPath();
        ctx.arc(-3, -6, 2.5, 0, Math.PI * 2);
        ctx.arc(3, -6, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Nariz triangular
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(-1, -3, 2, 2);

        // Dientes
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(-4, 0, 8, 1.5);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-3, -1, 2, 2);
        ctx.fillRect(1, -1, 2, 2);

        // Costillas/huesos
        ctx.strokeStyle = '#cbd5e0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 2);
        ctx.lineTo(0, 8);
        ctx.moveTo(-5, 4);
        ctx.lineTo(5, 4);
        ctx.moveTo(-4, 7);
        ctx.lineTo(4, 7);
        ctx.stroke();
    }

    /**
     * Dibuja el globo de alerta '!' con animación de pulso sobre la cabeza del enemigo.
     */
    function drawAlertBubble(ctx, animTimer) {
        const floatY = -28 + Math.sin(animTimer * 8) * 2;

        // Globo blanco con forma de gota/bocadillo
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, floatY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Piquito inferior del globo
        ctx.beginPath();
        ctx.moveTo(-3, floatY + 6);
        ctx.lineTo(0, floatY + 11);
        ctx.lineTo(3, floatY + 6);
        ctx.fill();

        // Borde negro fino
        ctx.strokeStyle = '#1a202c';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Signo de exclamación rojo brillante '!'
        ctx.fillStyle = '#e53e3e';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', 0, floatY - 0.5);
    }

    /**
     * Genera un grupo de combate aleatorio (3-5 enemigos).
     */
    function generateBattleGroup(spawnEnemyId) {
        const count = 3 + Math.floor(Math.random() * 3); // 3 a 5
        const enemies = [];
        const baseType = getEnemyTypeById(spawnEnemyId) || enemyTypes[0];

        for (let i = 0; i < count; i++) {
            let type = (Math.random() < 0.7)
                ? baseType
                : enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

            enemies.push({
                id: i + 1,
                tipo_id: type.id,
                nombre: type.nombre,
                hp_max: type.hp_max,
                hp_actual: type.hp_max,
                ataque: type.ataque,
                defensa: type.defensa,
                magia: type.magia,
                velocidad: type.velocidad,
                color: type.color,
                emoji: type.emoji,
                vivo: true,
            });
        }

        return enemies;
    }

    return {
        loadEnemyTypes,
        initMapSpawns,
        getEnemyTypes,
        getEnemyTypeById,
        getMapEnemies,
        checkPlayerCollision,
        removeEnemy,
        renderMapEnemies,
        generateBattleGroup,
    };
})();
