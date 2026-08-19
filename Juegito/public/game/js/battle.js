/**
 * battle.js — Lógica de combate por turnos avanzada con Habilidades, Magia e Ítems
 */

const Battle = (() => {
    let battleCanvas = null;
    let battleCtx = null;
    let party = [];
    let enemies = [];
    let animTimer = 0;
    let animationFrameId = null;

    // Estados de la batalla
    const STATES = {
        START: 0,
        PLAYER_TURN: 1,
        SUBMENU: 2,
        TARGET_SELECT_ENEMY: 3,
        TARGET_SELECT_ALL_ENEMIES: 4,
        TARGET_SELECT_ALLY: 5,
        TARGET_SELECT_DEAD_ALLY: 6,
        TARGET_SELECT_ALL_ALLIES: 7,
        ANIMATION: 8,
        ENEMY_TURN: 9,
        END: 10
    };
    let currentState = STATES.START;
    
    let currentActorIndex = 0; // Índice en party
    let selectedActionIndex = 0; 
    let selectedSubmenuIndex = 0;
    let selectedTargetIndex = 0; // Índice en enemies o party

    // Estado del submenú activo
    let activeSubmenuType = null; // 'skills' | 'magic' | 'items'
    let submenuItems = [];
    let pendingAction = null; // { type: 'attack'|'skill'|'magic'|'item', data: Object }

    // Buffs de grupo activos
    let partyDefenseBuffTurns = 0;
    
    // Configuración del menú principal
    const MENU_OPTIONS = [
        { id: 'attack', text: 'Atacar', desc: 'Realiza un ataque normal con arma contra un enemigo.' },
        { id: 'skills', text: 'Habilidades', desc: 'Usa técnicas marciales y tácticas de combate.' },
        { id: 'magic', text: 'Magia', desc: 'Conjura hechizos elementales o de curación con MP.' },
        { id: 'items', text: 'Objetos', desc: 'Usa pociones, éteres y consumibles del inventario.' },
        { id: 'defend', text: 'Defender', desc: 'Adopta postura defensiva (+50% defensa este turno).' }
    ];

    function initBattleUI(partyData, spawnEnemyId) {
        party = partyData;
        enemies = EnemyManager.generateBattleGroup(spawnEnemyId);
        
        // Reset de estados temporales
        party.forEach(p => {
            p.isDefending = false;
        });
        partyDefenseBuffTurns = 0;

        currentState = STATES.START;
        currentActorIndex = 0;
        selectedActionIndex = 0;
        selectedSubmenuIndex = 0;
        selectedTargetIndex = 0;
        activeSubmenuType = null;
        submenuItems = [];
        pendingAction = null;

        renderPartyCards();
        renderMainMenu();
        
        battleCanvas = document.getElementById('battle-canvas');
        if (battleCanvas) {
            battleCtx = battleCanvas.getContext('2d');
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animTimer = 0;
            renderBattleLoop();
        }

        setMenuDescription("¡Enemigos al acecho!", "Derrota a los monstruos para avanzar.");
        
        setTimeout(() => {
            nextTurn();
        }, 1200);
    }
    
    function setMenuDescription(title, text) {
        const titleEl = document.getElementById('desc-title');
        const textEl = document.getElementById('desc-text');
        if (titleEl) titleEl.innerText = title;
        if (textEl) textEl.innerText = text;
    }

    function renderPartyCards() {
        const partyContainer = document.getElementById('party-container');
        if (!partyContainer) return;

        partyContainer.innerHTML = party.map((p, index) => {
            const hpPercent = Math.max(0, (p.hp_actual / p.hp_max) * 100);
            const mpPercent = Math.max(0, (p.mp_actual / p.mp_max) * 100);
            const isDead = p.hp_actual <= 0;
            
            const isCurrentActor = (currentState === STATES.PLAYER_TURN || currentState === STATES.SUBMENU) && currentActorIndex === index;
            const isTargetedAlly = (currentState === STATES.TARGET_SELECT_ALLY || currentState === STATES.TARGET_SELECT_DEAD_ALLY) && selectedTargetIndex === index;
            const isAllAlliesTarget = (currentState === STATES.TARGET_SELECT_ALL_ALLIES && !isDead);

            let borderStyle = '';
            let extraClass = '';

            if (isTargetedAlly) {
                borderStyle = 'border-color: #38bdf8; box-shadow: 0 0 16px rgba(56, 189, 248, 0.8), inset 0 0 10px rgba(56, 189, 248, 0.4); transform: translateY(-4px);';
                extraClass = 'targeted-ally';
            } else if (isAllAlliesTarget) {
                borderStyle = 'border-color: #4ade80; box-shadow: 0 0 12px rgba(74, 222, 128, 0.6);';
            } else if (isCurrentActor) {
                borderStyle = 'border-color: #ffd700; box-shadow: inset 0 0 15px rgba(212, 175, 55, 0.4);';
            }

            const opacity = isDead ? 'opacity: 0.45; filter: grayscale(0.9);' : '';
            const defendBadge = p.isDefending ? '<span style="color: #60a5fa; font-size: 0.7rem; margin-left: 4px;">🛡️ DEF</span>' : '';

            return `
                <div class="character-card ${extraClass}" style="${borderStyle} ${opacity}">
                    <div class="char-header">
                        <span class="char-name" style="color: ${p.color || '#fff'}">
                            ${isTargetedAlly ? '▶ ' : ''}${p.nombre}${defendBadge}
                        </span>
                        <span class="char-level">Nv. ${p.nivel}</span>
                    </div>
                    <div class="char-stats">
                        <div class="stat-row">
                            <span class="stat-label">HP</span>
                            <div class="stat-bar-container">
                                <div class="stat-bar hp-bar" style="width: ${hpPercent}%"></div>
                            </div>
                            <span class="stat-value">${p.hp_actual}/${p.hp_max}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">MP</span>
                            <div class="stat-bar-container">
                                <div class="stat-bar mp-bar" style="width: ${mpPercent}%"></div>
                            </div>
                            <span class="stat-value">${p.mp_actual}/${p.mp_max}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderMainMenu() {
        const ul = document.querySelector('#action-menu ul');
        if (!ul) return;
        
        ul.innerHTML = MENU_OPTIONS.map((opt, i) => {
            const isActive = i === selectedActionIndex;
            return `
                <li class="action-option ${isActive ? 'active' : ''}" data-action="${opt.id}">
                    <span class="cursor" style="visibility: ${isActive ? 'visible' : 'hidden'}">▶</span> ${opt.text}
                </li>
            `;
        }).join('');
        
        if (currentState === STATES.PLAYER_TURN) {
            setMenuDescription(MENU_OPTIONS[selectedActionIndex].text, MENU_OPTIONS[selectedActionIndex].desc);
        }
    }

    function renderSubmenu() {
        const ul = document.querySelector('#action-menu ul');
        if (!ul || !submenuItems.length) return;

        const actor = party[currentActorIndex];

        ul.innerHTML = submenuItems.map((item, i) => {
            const isActive = i === selectedSubmenuIndex;
            
            if (item.isBack) {
                return `
                    <li class="action-option submenu-back ${isActive ? 'active' : ''}" style="color: #94a3b8; margin-top: 4px;">
                        <span class="cursor" style="visibility: ${isActive ? 'visible' : 'hidden'}">▶</span> ${item.nombre}
                    </li>
                `;
            }

            let costTag = '';
            let isUsable = true;

            if (activeSubmenuType === 'skills' || activeSubmenuType === 'magic') {
                const hasMp = actor.mp_actual >= item.mpCost;
                isUsable = hasMp;
                costTag = `<span class="cost-tag" style="color: ${hasMp ? '#60a5fa' : '#ef4444'}; font-size: 0.8rem; margin-left: auto;">${item.mpCost} MP</span>`;
            } else if (activeSubmenuType === 'items') {
                isUsable = item.cantidad > 0;
                costTag = `<span class="cost-tag" style="color: #facc15; font-size: 0.8rem; margin-left: auto;">x${item.cantidad}</span>`;
            }

            const opacityStyle = isUsable ? '' : 'opacity: 0.5;';

            return `
                <li class="action-option ${isActive ? 'active' : ''}" style="display: flex; justify-content: space-between; ${opacityStyle}">
                    <span><span class="cursor" style="visibility: ${isActive ? 'visible' : 'hidden'}">▶</span> ${item.nombre}</span>
                    ${costTag}
                </li>
            `;
        }).join('');

        const currentItem = submenuItems[selectedSubmenuIndex];
        if (currentItem) {
            if (currentItem.isBack) {
                setMenuDescription("Volver", "Regresa al menú de acciones principal.");
            } else {
                setMenuDescription(currentItem.nombre, currentItem.desc || "");
            }
        }
    }

    function nextTurn() {
        if (currentState === STATES.END) return;

        const allEnemiesDead = enemies.every(e => !e.vivo);
        const allHeroesDead = party.every(p => p.hp_actual <= 0);

        if (allEnemiesDead) {
            winBattle();
            return;
        }
        if (allHeroesDead) {
            loseBattle();
            return;
        }

        if (currentActorIndex < party.length) {
            const actor = party[currentActorIndex];
            if (actor.hp_actual <= 0) {
                currentActorIndex++;
                nextTurn();
                return;
            }
            
            // Reiniciar defensa del actor
            actor.isDefending = false;

            currentState = STATES.PLAYER_TURN;
            selectedActionIndex = 0;
            selectedSubmenuIndex = 0;
            activeSubmenuType = null;
            pendingAction = null;

            renderPartyCards();
            renderMainMenu();
            setMenuDescription(`Turno de ${actor.nombre}`, "¿Qué acción tomará?");
        } else {
            currentState = STATES.ENEMY_TURN;
            renderPartyCards();
            executeEnemyTurns();
        }
    }

    async function executeEnemyTurns() {
        if (partyDefenseBuffTurns > 0) {
            partyDefenseBuffTurns--;
            if (partyDefenseBuffTurns === 0) {
                setMenuDescription("Efecto Finalizado", "El efecto de Fortaleza Férrea se ha disipado.");
                await sleep(1000);
            }
        }

        for (let enemy of enemies) {
            if (!enemy.vivo) continue;
            
            const aliveHeroes = party.filter(p => p.hp_actual > 0);
            if (aliveHeroes.length === 0) break;
            const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            
            setMenuDescription(`Turno Enemigo`, `¡${enemy.nombre} ataca a ${target.nombre}!`);
            await sleep(900);
            
            let effectiveDef = target.defensa;
            if (target.isDefending) effectiveDef *= 2;
            if (partyDefenseBuffTurns > 0) effectiveDef = Math.floor(effectiveDef * 1.5);

            let rawDamage = enemy.ataque - Math.floor(effectiveDef / 2);
            let damage = Math.max(1, rawDamage);

            if (target.isDefending) {
                damage = Math.max(1, Math.floor(damage * 0.6));
            }
            
            target.hp_actual = Math.max(0, target.hp_actual - damage);
            
            const defendText = target.isDefending ? " (¡Defendiendo!)" : "";
            setMenuDescription(`Daño`, `¡${target.nombre} recibe ${damage} de daño!${defendText}`);
            renderPartyCards();
            await sleep(1200);

            if (target.hp_actual <= 0) {
                setMenuDescription("¡Aliado Caído!", `¡${target.nombre} ha caído inconsciente!`);
                renderPartyCards();
                await sleep(1200);
            }
        }
        
        currentActorIndex = 0;
        nextTurn();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function winBattle() {
        currentState = STATES.END;
        
        let totalExp = 0;
        let totalGold = 0;
        enemies.forEach(e => {
            const t = EnemyManager.getEnemyTypeById(e.tipo_id);
            if (t) {
                totalExp += (t.exp_reward || 15);
                totalGold += (t.gold_reward || 10);
            }
        });

        PlayerManager.addGold(totalGold);
        setMenuDescription("¡Victoria!", `¡Monstruos derrotados! Ganaste ${totalExp} EXP y ${totalGold} Oro.`);
        
        setTimeout(() => {
            endBattle();
        }, 2200);
    }
    
    function loseBattle() {
        currentState = STATES.END;
        setMenuDescription("Derrota...", "El grupo ha caído en combate.");
        setTimeout(() => {
            alert("Game Over - El grupo ha sido aniquilado en la mazmorra.");
            location.reload();
        }, 3000);
    }

    function endBattle() {
        cleanup();
        UI.showScreen('dungeon-screen');
        if (window.resumeExploration) {
            window.resumeExploration();
        }
    }

    // =========================================================================
    // MANEJO DE TECLADO Y NAVEGACIÓN
    // =========================================================================
    function handleInput(key) {
        const k = key.toLowerCase();

        // 1. MENÚ PRINCIPAL
        if (currentState === STATES.PLAYER_TURN) {
            if (k === 'arrowup' || k === 'w') {
                selectedActionIndex = (selectedActionIndex - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length;
                renderMainMenu();
            } else if (k === 'arrowdown' || k === 's') {
                selectedActionIndex = (selectedActionIndex + 1) % MENU_OPTIONS.length;
                renderMainMenu();
            } else if (k === 'enter' || k === ' ') {
                const actionId = MENU_OPTIONS[selectedActionIndex].id;
                const actor = party[currentActorIndex];

                if (actionId === 'attack') {
                    pendingAction = { type: 'attack', data: null };
                    selectFirstAliveEnemy();
                    currentState = STATES.TARGET_SELECT_ENEMY;
                    setMenuDescription("Seleccionar objetivo", "Flechas para elegir enemigo. [Enter] Confirmar. [Esc] Cancelar.");
                } else if (actionId === 'skills') {
                    const skills = PlayerManager.getCharacterSkills(actor);
                    if (!skills || skills.length === 0) {
                        setMenuDescription("Sin Habilidades", `${actor.nombre} no posee habilidades marciales.`);
                        return;
                    }
                    activeSubmenuType = 'skills';
                    submenuItems = [...skills, { id: 'back', nombre: '◀ Volver', isBack: true }];
                    selectedSubmenuIndex = 0;
                    currentState = STATES.SUBMENU;
                    renderSubmenu();
                } else if (actionId === 'magic') {
                    const magic = PlayerManager.getCharacterMagic(actor);
                    if (!magic || magic.length === 0) {
                        setMenuDescription("Sin Magia", `${actor.nombre} no domina las artes mágicas.`);
                        return;
                    }
                    activeSubmenuType = 'magic';
                    submenuItems = [...magic, { id: 'back', nombre: '◀ Volver', isBack: true }];
                    selectedSubmenuIndex = 0;
                    currentState = STATES.SUBMENU;
                    renderSubmenu();
                } else if (actionId === 'items') {
                    const inv = PlayerManager.getInventory();
                    const available = inv.filter(i => i.cantidad > 0);
                    if (available.length === 0) {
                        setMenuDescription("Sin Objetos", "No te quedan objetos en el inventario.");
                        return;
                    }
                    activeSubmenuType = 'items';
                    submenuItems = [...available, { id: 'back', nombre: '◀ Volver', isBack: true }];
                    selectedSubmenuIndex = 0;
                    currentState = STATES.SUBMENU;
                    renderSubmenu();
                } else if (actionId === 'defend') {
                    actor.isDefending = true;
                    setMenuDescription("Defensa", `${actor.nombre} adopta postura de guardia (+50% defensa).`);
                    currentState = STATES.ANIMATION;
                    renderPartyCards();
                    setTimeout(() => {
                        currentActorIndex++;
                        nextTurn();
                    }, 1000);
                }
            }
        }
        // 2. SUBMENÚ (HABILIDADES, MAGIA, OBJETOS)
        else if (currentState === STATES.SUBMENU) {
            if (k === 'arrowup' || k === 'w') {
                selectedSubmenuIndex = (selectedSubmenuIndex - 1 + submenuItems.length) % submenuItems.length;
                renderSubmenu();
            } else if (k === 'arrowdown' || k === 's') {
                selectedSubmenuIndex = (selectedSubmenuIndex + 1) % submenuItems.length;
                renderSubmenu();
            } else if (k === 'escape' || k === 'backspace') {
                currentState = STATES.PLAYER_TURN;
                renderMainMenu();
            } else if (k === 'enter' || k === ' ') {
                const item = submenuItems[selectedSubmenuIndex];
                if (item.isBack) {
                    currentState = STATES.PLAYER_TURN;
                    renderMainMenu();
                    return;
                }

                const actor = party[currentActorIndex];

                // Validación de MP
                if (activeSubmenuType === 'skills' || activeSubmenuType === 'magic') {
                    if (actor.mp_actual < item.mpCost) {
                        setMenuDescription("¡MP Insuficiente!", `Requiere ${item.mpCost} MP. Tienes ${actor.mp_actual} MP.`);
                        return;
                    }
                    pendingAction = { type: activeSubmenuType, data: item };
                } else if (activeSubmenuType === 'items') {
                    if (item.cantidad <= 0) {
                        setMenuDescription("Agotado", "No quedan unidades de este objeto.");
                        return;
                    }
                    pendingAction = { type: 'item', data: item };
                }

                // Determinación del tipo de objetivo
                const targetType = item.targetType;
                if (targetType === 'single_enemy') {
                    selectFirstAliveEnemy();
                    currentState = STATES.TARGET_SELECT_ENEMY;
                    setMenuDescription("Objetivo Enemigo", "Flechas para elegir. [Enter] Confirmar. [Esc] Volver.");
                } else if (targetType === 'all_enemies') {
                    currentState = STATES.TARGET_SELECT_ALL_ENEMIES;
                    setMenuDescription("Todos los Enemigos", "El ataque golpeará a todos los monstruos. [Enter] Confirmar. [Esc] Volver.");
                } else if (targetType === 'single_ally') {
                    selectFirstAliveAlly();
                    currentState = STATES.TARGET_SELECT_ALLY;
                    renderPartyCards();
                    setMenuDescription("Seleccionar Aliado", "Flechas para elegir aliado. [Enter] Confirmar. [Esc] Volver.");
                } else if (targetType === 'dead_ally') {
                    const deadIdx = party.findIndex(p => p.hp_actual <= 0);
                    if (deadIdx === -1) {
                        setMenuDescription("Sin objetivo", "No hay aliados caídos que revivir.");
                        return;
                    }
                    selectedTargetIndex = deadIdx;
                    currentState = STATES.TARGET_SELECT_DEAD_ALLY;
                    renderPartyCards();
                    setMenuDescription("Aliado Caído", "Elige al compañero a revivir. [Enter] Confirmar. [Esc] Volver.");
                } else if (targetType === 'all_allies') {
                    currentState = STATES.TARGET_SELECT_ALL_ALLIES;
                    renderPartyCards();
                    setMenuDescription("Todo el Grupo", "Afectará a todos los héroes. [Enter] Confirmar. [Esc] Volver.");
                }
            }
        }
        // 3. SELECCIÓN DE OBJETIVO: ENEMIGO ÚNICO
        else if (currentState === STATES.TARGET_SELECT_ENEMY) {
            if (k === 'arrowleft' || k === 'a') {
                cycleEnemyTarget(-1);
            } else if (k === 'arrowright' || k === 'd') {
                cycleEnemyTarget(1);
            } else if (k === 'escape' || k === 'backspace') {
                returnToPreviousMenu();
            } else if (k === 'enter' || k === ' ') {
                executePendingAction();
            }
        }
        // 4. SELECCIÓN DE OBJETIVO: TODOS LOS ENEMIGOS
        else if (currentState === STATES.TARGET_SELECT_ALL_ENEMIES) {
            if (k === 'escape' || k === 'backspace') {
                returnToPreviousMenu();
            } else if (k === 'enter' || k === ' ') {
                executePendingAction();
            }
        }
        // 5. SELECCIÓN DE OBJETIVO: ALIADO ÚNICO
        else if (currentState === STATES.TARGET_SELECT_ALLY) {
            if (k === 'arrowleft' || k === 'a') {
                cycleAllyTarget(-1, false);
            } else if (k === 'arrowright' || k === 'd') {
                cycleAllyTarget(1, false);
            } else if (k === 'escape' || k === 'backspace') {
                returnToPreviousMenu();
            } else if (k === 'enter' || k === ' ') {
                executePendingAction();
            }
        }
        // 6. SELECCIÓN DE OBJETIVO: ALIADO CAÍDO
        else if (currentState === STATES.TARGET_SELECT_DEAD_ALLY) {
            if (k === 'arrowleft' || k === 'a') {
                cycleAllyTarget(-1, true);
            } else if (k === 'arrowright' || k === 'd') {
                cycleAllyTarget(1, true);
            } else if (k === 'escape' || k === 'backspace') {
                returnToPreviousMenu();
            } else if (k === 'enter' || k === ' ') {
                executePendingAction();
            }
        }
        // 7. SELECCIÓN DE OBJETIVO: TODOS LOS ALIADOS
        else if (currentState === STATES.TARGET_SELECT_ALL_ALLIES) {
            if (k === 'escape' || k === 'backspace') {
                returnToPreviousMenu();
            } else if (k === 'enter' || k === ' ') {
                executePendingAction();
            }
        }
    }

    function returnToPreviousMenu() {
        if (activeSubmenuType) {
            currentState = STATES.SUBMENU;
            renderSubmenu();
            renderPartyCards();
        } else {
            currentState = STATES.PLAYER_TURN;
            renderMainMenu();
            renderPartyCards();
        }
    }

    function selectFirstAliveEnemy() {
        selectedTargetIndex = 0;
        while (selectedTargetIndex < enemies.length && !enemies[selectedTargetIndex].vivo) {
            selectedTargetIndex++;
        }
        if (selectedTargetIndex >= enemies.length) selectedTargetIndex = 0;
    }

    function cycleEnemyTarget(dir) {
        let startIdx = selectedTargetIndex;
        do {
            selectedTargetIndex = (selectedTargetIndex + dir + enemies.length) % enemies.length;
        } while (!enemies[selectedTargetIndex].vivo && selectedTargetIndex !== startIdx);
    }

    function selectFirstAliveAlly() {
        selectedTargetIndex = currentActorIndex;
        if (party[selectedTargetIndex].hp_actual <= 0) {
            const alive = party.findIndex(p => p.hp_actual > 0);
            if (alive !== -1) selectedTargetIndex = alive;
        }
        renderPartyCards();
    }

    function cycleAllyTarget(dir, onlyDead = false) {
        let startIdx = selectedTargetIndex;
        do {
            selectedTargetIndex = (selectedTargetIndex + dir + party.length) % party.length;
            const valid = onlyDead ? (party[selectedTargetIndex].hp_actual <= 0) : (party[selectedTargetIndex].hp_actual > 0);
            if (valid) break;
        } while (selectedTargetIndex !== startIdx);
        renderPartyCards();
    }

    // =========================================================================
    // EJECUCIÓN DE ACCIONES
    // =========================================================================
    async function executePendingAction() {
        currentState = STATES.ANIMATION;
        const actor = party[currentActorIndex];
        const action = pendingAction;

        if (!action) return;

        // 1. ATAQUE NORMAL
        if (action.type === 'attack') {
            const target = enemies[selectedTargetIndex];
            setMenuDescription("Ataque", `¡${actor.nombre} asesta un golpe a ${target.nombre}!`);
            await sleep(900);

            const damage = Math.max(1, actor.ataque - Math.floor((target.defensa || 5) / 2));
            target.hp_actual = Math.max(0, target.hp_actual - damage);
            if (target.hp_actual === 0) target.vivo = false;

            setMenuDescription("Impacto", `¡${target.nombre} recibe ${damage} de daño!`);
            if (!target.vivo) {
                await sleep(800);
                setMenuDescription("Baja", `¡${target.nombre} ha sido derrotado!`);
            }
            await sleep(1200);
        }
        // 2. HABILIDADES
        else if (action.type === 'skills') {
            const skill = action.data;
            actor.mp_actual -= skill.mpCost;
            renderPartyCards();

            if (skill.id === 'corte_feroz') {
                const target = enemies[selectedTargetIndex];
                setMenuDescription("Habilidad", `¡${actor.nombre} usa ${skill.nombre} sobre ${target.nombre}!`);
                await sleep(900);

                const damage = Math.max(1, Math.floor(actor.ataque * 1.8) - Math.floor((target.defensa || 5) / 2));
                target.hp_actual = Math.max(0, target.hp_actual - damage);
                if (target.hp_actual === 0) target.vivo = false;

                setMenuDescription("¡Golpe Crítico!", `¡Corte devastador inflige ${damage} de daño a ${target.nombre}!`);
                if (!target.vivo) {
                    await sleep(800);
                    setMenuDescription("Baja", `¡${target.nombre} ha sido partido en dos!`);
                }
                await sleep(1300);
            } else if (skill.id === 'torbellino') {
                setMenuDescription("Habilidad", `¡${actor.nombre} desata un torbellino de espada a todos los enemigos!`);
                await sleep(1000);

                for (let e of enemies) {
                    if (!e.vivo) continue;
                    const damage = Math.max(1, Math.floor(actor.ataque * 1.25) - Math.floor((e.defensa || 5) / 2));
                    e.hp_actual = Math.max(0, e.hp_actual - damage);
                    if (e.hp_actual === 0) e.vivo = false;
                }

                setMenuDescription("Impacto Grupal", `¡El torbellino impacta a toda la fila de enemigos!`);
                await sleep(1400);
            } else if (skill.id === 'golpe_escudo') {
                const target = enemies[selectedTargetIndex];
                setMenuDescription("Habilidad", `¡${actor.nombre} embiste con su escudo pesado a ${target.nombre}!`);
                await sleep(900);

                const damage = Math.max(1, actor.ataque + 5 - Math.floor((target.defensa || 5) / 2));
                target.hp_actual = Math.max(0, target.hp_actual - damage);
                target.ataque = Math.max(1, Math.floor(target.ataque * 0.75)); // Debuff de ataque enemigo
                if (target.hp_actual === 0) target.vivo = false;

                setMenuDescription("Aturdimiento", `¡${target.nombre} recibe ${damage} de daño y su ataque se reduce!`);
                await sleep(1300);
            } else if (skill.id === 'fortaleza') {
                partyDefenseBuffTurns = 3;
                setMenuDescription("Fortaleza Férrea", `¡${actor.nombre} fortalece las defensas del grupo por 3 turnos!`);
                await sleep(1400);
            } else if (skill.id === 'flecha_certera') {
                const target = enemies[selectedTargetIndex];
                setMenuDescription("Habilidad", `¡${actor.nombre} apunta a los puntos vitales de ${target.nombre}!`);
                await sleep(900);

                const isCrit = Math.random() < 0.6;
                const multiplier = isCrit ? 2.3 : 1.7;
                const damage = Math.max(1, Math.floor(actor.ataque * multiplier) - Math.floor((target.defensa || 5) / 3));
                target.hp_actual = Math.max(0, target.hp_actual - damage);
                if (target.hp_actual === 0) target.vivo = false;

                setMenuDescription(isCrit ? "¡GOLPE CRÍTICO!" : "Impacto Certero", `¡La flecha perfora causando ${damage} de daño!`);
                if (!target.vivo) {
                    await sleep(800);
                    setMenuDescription("Baja", `¡${target.nombre} ha caído derrotado!`);
                }
                await sleep(1300);
            } else if (skill.id === 'lluvia_flechas') {
                setMenuDescription("Habilidad", `¡${actor.nombre} dispara una lluvia de flechas al cielo!`);
                await sleep(1000);

                for (let e of enemies) {
                    if (!e.vivo) continue;
                    const damage = Math.max(1, Math.floor(actor.ataque * 1.15) - Math.floor((e.defensa || 5) / 2));
                    e.hp_actual = Math.max(0, e.hp_actual - damage);
                    if (e.hp_actual === 0) e.vivo = false;
                }

                setMenuDescription("Lluvia Letal", `¡Las flechas caen e impactan a todos los enemigos!`);
                await sleep(1400);
            } else if (skill.id === 'tiro_venenoso') {
                const target = enemies[selectedTargetIndex];
                setMenuDescription("Habilidad", `¡${actor.nombre} dispara una flecha bañada en toxina a ${target.nombre}!`);
                await sleep(900);

                const damage = Math.max(1, Math.floor(actor.ataque * 1.4) + 6 - Math.floor((target.defensa || 5) / 2));
                target.hp_actual = Math.max(0, target.hp_actual - damage);
                if (target.hp_actual === 0) target.vivo = false;

                setMenuDescription("Veneno", `¡${target.nombre} sufre ${damage} de daño por impacto tóxico!`);
                await sleep(1300);
            }
        }
        // 3. MAGIA
        else if (action.type === 'magic') {
            const spell = action.data;
            actor.mp_actual -= spell.mpCost;
            renderPartyCards();

            if (spell.id === 'piroclasma') {
                const target = enemies[selectedTargetIndex];
                setMenuDescription("Conjuro", `¡${actor.nombre} conjura ${spell.nombre} hacia ${target.nombre}!`);
                await sleep(900);

                const magDamage = Math.floor(actor.magia * 1.8 + Math.random() * 8);
                target.hp_actual = Math.max(0, target.hp_actual - magDamage);
                if (target.hp_actual === 0) target.vivo = false;

                setMenuDescription("¡Explosión Ígnea!", `¡Llamas abrasadoras calcinan a ${target.nombre} por ${magDamage} de daño!`);
                if (!target.vivo) {
                    await sleep(800);
                    setMenuDescription("Cenizas", `¡${target.nombre} ha sido reducido a cenizas!`);
                }
                await sleep(1400);
            } else if (spell.id === 'electroshock') {
                setMenuDescription("Conjuro", `¡${actor.nombre} desata una tormenta de rayos sobre todos los enemigos!`);
                await sleep(1000);

                for (let e of enemies) {
                    if (!e.vivo) continue;
                    const magDamage = Math.floor(actor.magia * 1.25 + Math.random() * 6);
                    e.hp_actual = Math.max(0, e.hp_actual - magDamage);
                    if (e.hp_actual === 0) e.vivo = false;
                }

                setMenuDescription("Descarga Masiva", `¡Rayos fulminantes impactan a todos los monstruos!`);
                await sleep(1400);
            } else if (spell.id === 'curacion') {
                const targetAlly = party[selectedTargetIndex];
                setMenuDescription("Conjuro", `¡${actor.nombre} lanza luz sanadora sobre ${targetAlly.nombre}!`);
                await sleep(900);

                const healAmount = 60;
                targetAlly.hp_actual = Math.min(targetAlly.hp_max, targetAlly.hp_actual + healAmount);
                renderPartyCards();

                setMenuDescription("Sanación", `¡${targetAlly.nombre} recupera ${healAmount} HP!`);
                await sleep(1300);
            } else if (spell.id === 'omnicura') {
                setMenuDescription("Conjuro", `¡${actor.nombre} invoca un manto de Omnicura para todo el grupo!`);
                await sleep(1000);

                const healAmount = 35;
                party.forEach(p => {
                    if (p.hp_actual > 0) {
                        p.hp_actual = Math.min(p.hp_max, p.hp_actual + healAmount);
                    }
                });
                renderPartyCards();

                setMenuDescription("Restauración Total", `¡Todos los miembros vivos recuperan ${healAmount} HP!`);
                await sleep(1400);
            }
        }
        // 4. OBJETOS
        else if (action.type === 'item') {
            const item = action.data;
            PlayerManager.consumeItem(item.id);

            if (item.id === 'pocion_hp') {
                const targetAlly = party[selectedTargetIndex];
                setMenuDescription("Objeto", `¡${actor.nombre} usa Poción de Salud en ${targetAlly.nombre}!`);
                await sleep(900);

                targetAlly.hp_actual = Math.min(targetAlly.hp_max, targetAlly.hp_actual + item.effect.value);
                renderPartyCards();

                setMenuDescription("Recuperación", `¡${targetAlly.nombre} recupera ${item.effect.value} HP!`);
                await sleep(1300);
            } else if (item.id === 'eter_mp') {
                const targetAlly = party[selectedTargetIndex];
                setMenuDescription("Objeto", `¡${actor.nombre} usa Éter Mágico en ${targetAlly.nombre}!`);
                await sleep(900);

                targetAlly.mp_actual = Math.min(targetAlly.mp_max, targetAlly.mp_actual + item.effect.value);
                renderPartyCards();

                setMenuDescription("Maná Restaurado", `¡${targetAlly.nombre} recupera ${item.effect.value} MP!`);
                await sleep(1300);
            } else if (item.id === 'pluma_fenix') {
                const targetAlly = party[selectedTargetIndex];
                setMenuDescription("Objeto", `¡${actor.nombre} usa una Pluma de Fénix sobre el cuerpo de ${targetAlly.nombre}!`);
                await sleep(1000);

                targetAlly.hp_actual = item.effect.value;
                renderPartyCards();

                setMenuDescription("¡Resurrección!", `¡${targetAlly.nombre} revive con ${item.effect.value} HP!`);
                await sleep(1400);
            } else if (item.id === 'bomba_fuego') {
                setMenuDescription("Objeto", `¡${actor.nombre} lanza una Bomba de Fuego al grupo enemigo!`);
                await sleep(1000);

                for (let e of enemies) {
                    if (!e.vivo) continue;
                    e.hp_actual = Math.max(0, e.hp_actual - item.effect.value);
                    if (e.hp_actual === 0) e.vivo = false;
                }

                setMenuDescription("¡BOOM!", `¡La detonación inflige ${item.effect.value} de daño a todos los enemigos!`);
                await sleep(1400);
            }
        }

        renderPartyCards();
        currentActorIndex++;
        nextTurn();
    }

    // =========================================================================
    // CANVAS DE BATALLA Y SPRITES
    // =========================================================================
    function resizeCanvas() {
        if (!battleCanvas) return;
        const arena = document.getElementById('battle-arena');
        if (arena) {
            battleCanvas.width = arena.clientWidth;
            battleCanvas.height = arena.clientHeight;
        }
    }

    function renderBattleLoop() {
        if (!battleCtx || !battleCanvas) return;
        
        battleCtx.clearRect(0, 0, battleCanvas.width, battleCanvas.height);
        animTimer += 0.016; 

        const count = enemies.length;
        const spacing = Math.min(150, battleCanvas.width / (count + 1));
        const startX = (battleCanvas.width - (spacing * (count - 1))) / 2;
        const baseY = battleCanvas.height * 0.75;

        enemies.forEach((enemy, index) => {
            if (!enemy.vivo) return;

            const px = startX + index * spacing;
            const py = baseY;
            const bob = Math.sin(animTimer * 4 + index) * 3;

            const isSingleTarget = (currentState === STATES.TARGET_SELECT_ENEMY && index === selectedTargetIndex);
            const isAllTarget = (currentState === STATES.TARGET_SELECT_ALL_ENEMIES);

            // Flecha de objetivo
            if (isSingleTarget || isAllTarget) {
                const arrowY = py - 60 + Math.sin(animTimer * 10) * 5;
                battleCtx.fillStyle = isAllTarget ? '#f87171' : '#ffd700';
                battleCtx.beginPath();
                battleCtx.moveTo(px, arrowY);
                battleCtx.lineTo(px - 10, arrowY - 15);
                battleCtx.lineTo(px + 10, arrowY - 15);
                battleCtx.fill();

                // Nombre del objetivo sobre la flecha si es individual
                if (isSingleTarget) {
                    battleCtx.fillStyle = '#ffffff';
                    battleCtx.font = 'bold 12px sans-serif';
                    battleCtx.textAlign = 'center';
                    battleCtx.fillText(enemy.nombre, px, arrowY - 20);
                }
            }

            // Sombra
            battleCtx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            battleCtx.beginPath();
            battleCtx.ellipse(px, py + 15, 20, 5, 0, 0, Math.PI * 2);
            battleCtx.fill();

            battleCtx.save();
            battleCtx.translate(px, py + bob);
            battleCtx.scale(1.5, 1.5);

            if (enemy.nombre.toLowerCase().includes('slime')) {
                drawMockSlime(battleCtx, animTimer + index);
            } else if (enemy.nombre.toLowerCase().includes('murci')) {
                drawMockBat(battleCtx, animTimer + index);
            } else {
                drawMockSkeleton(battleCtx, animTimer + index);
            }

            battleCtx.restore();
        });

        animationFrameId = requestAnimationFrame(renderBattleLoop);
    }

    function drawMockSlime(ctx, time) {
        const squish = Math.sin(time * 6) * 1.5;
        ctx.fillStyle = '#3182ce';
        ctx.beginPath();
        ctx.moveTo(0, -16 - squish);
        ctx.bezierCurveTo(-14 - squish, -8, -16 - squish, 10 + squish, 0, 10 + squish);
        ctx.bezierCurveTo(16 + squish, 10 + squish, 14 + squish, -8, 0, -16 - squish);
        ctx.fill();
        ctx.strokeStyle = '#1a365d';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-5, 0, 4, 0, Math.PI * 2);
        ctx.arc(5, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(-4.5, 0.5, 2, 0, Math.PI * 2);
        ctx.arc(5.5, 0.5, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawMockBat(ctx, time) {
        const wingFlap = Math.sin(time * 14) * 8;
        ctx.fillStyle = '#6b46c1';
        ctx.beginPath();
        ctx.moveTo(-4, -2); ctx.lineTo(-18, -12 + wingFlap); ctx.lineTo(-12, 4); ctx.lineTo(-4, 2);
        ctx.moveTo(4, -2);  ctx.lineTo(18, -12 + wingFlap);  ctx.lineTo(12, 4);  ctx.lineTo(4, 2);
        ctx.fill();
        ctx.strokeStyle = '#322659'; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.fillStyle = '#44337a';
        ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#e53e3e'; ctx.fillRect(-4, -2, 2, 3); ctx.fillRect(2, -2, 2, 3);
    }

    function drawMockSkeleton(ctx, time) {
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.arc(0, -6, 8, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#4a5568'; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.fillStyle = '#1a202c';
        ctx.beginPath(); ctx.arc(-3, -6, 2.5, 0, Math.PI * 2); ctx.arc(3, -6, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#cbd5e0'; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(0, 2); ctx.lineTo(0, 8); ctx.moveTo(-5, 4); ctx.lineTo(5, 4); ctx.stroke();
    }

    function cleanup() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    return {
        initBattleUI,
        handleInput,
        cleanup
    };
})();
