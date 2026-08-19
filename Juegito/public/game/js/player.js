/**
 * player.js — Datos del grupo de héroes y lógica del jugador en el mapa
 */

const PlayerManager = (() => {
    let party = []; // Datos de los 4 personajes cargados de la API

    // Estado del jugador en el mapa
    let tileX = 2;
    let tileY = 2;
    let targetTileX = 2;
    let targetTileY = 2;
    let pixelX = 0;
    let pixelY = 0;
    let direction = 'down'; // 'down', 'up', 'left', 'right'
    let isMoving = false;
    let moveProgress = 0; // 0.0 a 1.0
    const MOVE_SPEED = 5.0; // Velocidad de paso entre tiles

    // Animación de caminata
    let walkStep = 0;

    /**
     * Carga los personajes desde la API.
     */
    async function loadParty() {
        const response = await fetch('/api/personajes');
        if (!response.ok) throw new Error('Error cargando personajes');
        party = await response.json();
        return party;
    }

    /**
     * Resetea HP/MP de todos los personajes.
     */
    async function resetParty() {
        const response = await fetch('/api/personajes/reset', { method: 'POST' });
        if (!response.ok) throw new Error('Error reseteando personajes');
        const data = await response.json();
        party = data.personajes;
        return party;
    }

    /**
     * Inicializa la posición del jugador en el tile de entrada de la mazmorra.
     */
    function initMapPosition(entryTile, tileSize) {
        tileX = entryTile.x;
        tileY = entryTile.y;
        targetTileX = tileX;
        targetTileY = tileY;
        pixelX = tileX * tileSize + tileSize / 2;
        pixelY = tileY * tileSize + tileSize / 2;
        direction = 'down';
        isMoving = false;
        moveProgress = 0;
    }

    /**
     * Intenta mover al jugador en una dirección (si no está ya moviéndose).
     */
    function tryMove(dir) {
        if (isMoving) return false;

        direction = dir;
        let nextX = tileX;
        let nextY = tileY;

        if (dir === 'up') nextY--;
        else if (dir === 'down') nextY++;
        else if (dir === 'left') nextX--;
        else if (dir === 'right') nextX++;

        // Verificar si la casilla destino es transitable
        if (Dungeon.isWalkable(nextX, nextY)) {
            targetTileX = nextX;
            targetTileY = nextY;
            isMoving = true;
            moveProgress = 0;
            return true;
        }

        return false;
    }

    /**
     * Actualiza el movimiento interpolado del jugador.
     */
    function update(deltaTime, tileSize) {
        if (!isMoving) {
            pixelX = tileX * tileSize + tileSize / 2;
            pixelY = tileY * tileSize + tileSize / 2;
            return;
        }

        moveProgress += deltaTime * MOVE_SPEED;
        walkStep += deltaTime * 12;

        if (moveProgress >= 1.0) {
            // Completó el paso
            tileX = targetTileX;
            tileY = targetTileY;
            isMoving = false;
            moveProgress = 0;
            pixelX = tileX * tileSize + tileSize / 2;
            pixelY = tileY * tileSize + tileSize / 2;
        } else {
            // Interpolar posición en píxeles
            const startPx = tileX * tileSize + tileSize / 2;
            const startPy = tileY * tileSize + tileSize / 2;
            const targetPx = targetTileX * tileSize + tileSize / 2;
            const targetPy = targetTileY * tileSize + tileSize / 2;

            pixelX = startPx + (targetPx - startPx) * moveProgress;
            pixelY = startPy + (targetPy - startPy) * moveProgress;
        }
    }

    /**
     * Dibuja al héroe en el canvas (estilo Dragon Quest: pelo castaño, túnica azul, capa, espada).
     */
    function renderPlayer(ctx, tileSize, animTimer, moving) {
        const x = pixelX;
        const y = pixelY;
        const bounce = moving ? Math.sin(walkStep) * 2 : Math.sin(animTimer * 3) * 0.8;
        const legSwing = moving ? Math.sin(walkStep) * 5 : 0;

        // 1. Sombra bajo los pies
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(x, y + 14, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(x, y + bounce);

        // 2. Piernas y Botas
        ctx.fillStyle = '#4a2f1b'; // Botas de cuero
        if (direction === 'left' || direction === 'right') {
            ctx.fillRect(-6 + legSwing, 6, 5, 8);
            ctx.fillRect(1 - legSwing, 6, 5, 8);
        } else {
            ctx.fillRect(-6, 6 + (moving ? Math.sin(walkStep) * 3 : 0), 5, 8);
            ctx.fillRect(1, 6 - (moving ? Math.sin(walkStep) * 3 : 0), 5, 8);
        }

        // 3. Capa / Espalda
        if (direction === 'up' || direction === 'left' || direction === 'right') {
            ctx.fillStyle = '#b23a2a'; // Capa roja
            ctx.beginPath();
            ctx.roundRect(-10, -4, 20, 14, 3);
            ctx.fill();
        }

        // 4. Cuerpo / Túnica Azul (Héroe DQ)
        ctx.fillStyle = '#2b6cb0'; // Túnica azul
        ctx.beginPath();
        ctx.roundRect(-8, -6, 16, 14, 4);
        ctx.fill();

        // Cinturón dorado/marrón
        ctx.fillStyle = '#2d1a0e';
        ctx.fillRect(-8, 2, 16, 3);
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(-2, 1, 4, 5); // Hebilla dorada

        // Detalle de hombreras / cuello blanco
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(-6, -6, 12, 2);

        // 5. Cabeza y Rostro
        // Cara (piel)
        ctx.fillStyle = '#ffd1a4';
        ctx.beginPath();
        ctx.arc(0, -11, 7, 0, Math.PI * 2);
        ctx.fill();

        // Ojos según la dirección
        if (direction === 'down') {
            ctx.fillStyle = '#1a202c';
            ctx.fillRect(-3, -11, 2, 3);
            ctx.fillRect(1, -11, 2, 3);
        } else if (direction === 'left') {
            ctx.fillStyle = '#1a202c';
            ctx.fillRect(-5, -11, 2, 3);
        } else if (direction === 'right') {
            ctx.fillStyle = '#1a202c';
            ctx.fillRect(3, -11, 2, 3);
        }

        // 6. Cabello Castaño con Picos (Héroe DQ Clásico)
        ctx.fillStyle = '#6b3e1e';
        ctx.beginPath();
        if (direction === 'up') {
            // Visto desde atrás: melena completa
            ctx.arc(0, -12, 8.5, 0, Math.PI * 2);
            ctx.fill();
            // Puntas de pelo traseras
            ctx.fillRect(-6, -7, 12, 5);
        } else {
            // Frontal o lateral: flequillo con picos
            ctx.arc(0, -13, 8, Math.PI * 0.8, Math.PI * 2.2);
            ctx.fill();
            // Mechones laterales
            ctx.fillRect(-8, -13, 4, 8);
            ctx.fillRect(4, -13, 4, 8);
            // Pico central
            ctx.beginPath();
            ctx.moveTo(-3, -15);
            ctx.lineTo(0, -19);
            ctx.lineTo(3, -15);
            ctx.fill();
        }

        // 7. Espada envainada en la espalda/cintura
        ctx.fillStyle = '#718096';
        if (direction === 'left') {
            ctx.fillRect(6, -8, 3, 14);
            ctx.fillStyle = '#d4af37';
            ctx.fillRect(5, -10, 5, 2);
        } else if (direction === 'right') {
            ctx.fillRect(-9, -8, 3, 14);
            ctx.fillStyle = '#d4af37';
            ctx.fillRect(-10, -10, 5, 2);
        }

        ctx.restore();
    }

    // Definición de Habilidades y Magias por personaje/clase
    const CHARACTER_ABILITIES = {
        'Arion': {
            skills: [
                { id: 'corte_feroz', nombre: 'Corte Feroz', mpCost: 8, targetType: 'single_enemy', desc: 'Ataque con filo concentrado (180% daño físico).' },
                { id: 'torbellino', nombre: 'Torbellino', mpCost: 14, targetType: 'all_enemies', desc: 'Giro de espada que golpea a todos los enemigos.' }
            ],
            magic: []
        },
        'Galen': {
            skills: [
                { id: 'golpe_escudo', nombre: 'Golpe de Escudo', mpCost: 6, targetType: 'single_enemy', desc: 'Embate de escudo que inflige daño y reduce el ataque enemigo.' },
                { id: 'fortaleza', nombre: 'Fortaleza Férrea', mpCost: 10, targetType: 'all_allies', desc: 'Eleva la defensa del grupo durante 3 turnos.' }
            ],
            magic: []
        },
        'Luna': {
            skills: [],
            magic: [
                { id: 'piroclasma', nombre: 'Piroclasma', mpCost: 12, targetType: 'single_enemy', desc: 'Lanza una intensa bola de fuego que calcina al enemigo.' },
                { id: 'electroshock', nombre: 'Electroshock', mpCost: 18, targetType: 'all_enemies', desc: 'Descarga eléctrica que daña a todos los enemigos.' },
                { id: 'curacion', nombre: 'Curación', mpCost: 10, targetType: 'single_ally', desc: 'Restaura una gran cantidad de HP a un aliado (60 HP).' },
                { id: 'omnicura', nombre: 'Omnicura', mpCost: 22, targetType: 'all_allies', desc: 'Cura 35 HP a todos los miembros vivos del grupo.' }
            ]
        },
        'Mira': {
            skills: [
                { id: 'flecha_certera', nombre: 'Flecha Certera', mpCost: 7, targetType: 'single_enemy', desc: 'Disparo de precisión con alta probabilidad de daño crítico.' },
                { id: 'lluvia_flechas', nombre: 'Lluvia de Flechas', mpCost: 12, targetType: 'all_enemies', desc: 'Dispara una andanada que impacta a todos los enemigos.' },
                { id: 'tiro_venenoso', nombre: 'Tiro Tóxico', mpCost: 8, targetType: 'single_enemy', desc: 'Flecha con veneno que hace daño directo y deja residuo tóxico.' }
            ],
            magic: []
        }
    };

    // Inventario compartido del grupo
    let inventory = [
        { id: 'pocion_hp', nombre: 'Poción de Salud', desc: 'Restaura 60 HP a un aliado.', cantidad: 3, targetType: 'single_ally', effect: { type: 'heal_hp', value: 60 } },
        { id: 'eter_mp', nombre: 'Éter Mágico', desc: 'Recupera 30 MP a un aliado.', cantidad: 2, targetType: 'single_ally', effect: { type: 'restore_mp', value: 30 } },
        { id: 'pluma_fenix', nombre: 'Pluma de Fénix', desc: 'Revive a un aliado caído con 40 HP.', cantidad: 1, targetType: 'dead_ally', effect: { type: 'revive', value: 40 } },
        { id: 'bomba_fuego', nombre: 'Bomba de Fuego', desc: 'Detonación que causa 40 de daño a todos los enemigos.', cantidad: 2, targetType: 'all_enemies', effect: { type: 'damage_all', value: 40 } }
    ];
    let gold = 50;

    function getCharacterSkills(actor) {
        if (!actor) return [];
        const entry = CHARACTER_ABILITIES[actor.nombre];
        return entry ? entry.skills : [];
    }

    function getCharacterMagic(actor) {
        if (!actor) return [];
        const entry = CHARACTER_ABILITIES[actor.nombre];
        return entry ? entry.magic : [];
    }

    function getInventory() {
        return inventory;
    }

    function getGold() {
        return gold;
    }

    function addGold(amount) {
        gold += amount;
        return gold;
    }

    function addItem(itemId, count = 1) {
        const item = inventory.find(i => i.id === itemId);
        if (item) {
            item.cantidad += count;
        } else {
            const ITEM_TEMPLATES = {
                'pocion_hp': { id: 'pocion_hp', nombre: 'Poción de Salud', desc: 'Restaura 60 HP a un aliado.', targetType: 'single_ally', effect: { type: 'heal_hp', value: 60 } },
                'eter_mp': { id: 'eter_mp', nombre: 'Éter Mágico', desc: 'Recupera 30 MP a un aliado.', targetType: 'single_ally', effect: { type: 'restore_mp', value: 30 } },
                'pluma_fenix': { id: 'pluma_fenix', nombre: 'Pluma de Fénix', desc: 'Revive a un aliado caído con 40 HP.', targetType: 'dead_ally', effect: { type: 'revive', value: 40 } },
                'bomba_fuego': { id: 'bomba_fuego', nombre: 'Bomba de Fuego', desc: 'Detonación que causa 40 de daño a todos los enemigos.', targetType: 'all_enemies', effect: { type: 'damage_all', value: 40 } }
            };
            if (ITEM_TEMPLATES[itemId]) {
                inventory.push({ ...ITEM_TEMPLATES[itemId], cantidad: count });
            }
        }
    }

    function consumeItem(itemId) {
        const item = inventory.find(i => i.id === itemId);
        if (item && item.cantidad > 0) {
            item.cantidad--;
            return true;
        }
        return false;
    }

    return {
        loadParty,
        resetParty,
        getParty: () => party,
        initMapPosition,
        tryMove,
        update,
        renderPlayer,
        getTilePos: () => ({ x: tileX, y: tileY }),
        getTargetTilePos: () => ({ x: targetTileX, y: targetTileY }),
        getPixelPos: () => ({ x: pixelX, y: pixelY }),
        getDirection: () => direction,
        isMoving: () => isMoving,
        getCharacterSkills,
        getCharacterMagic,
        getInventory,
        getGold,
        addGold,
        addItem,
        consumeItem,
    };
})();
