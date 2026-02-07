// === Audio unlock ===
// Chrome / Safari autoplay policy: AudioContext must be created or resumed
// during a *real* user-gesture event handler (click, touch, key).
// rAF callbacks and game-loop ticks do NOT count.
// We also play a tiny silent buffer so iOS Safari fully unlocks audio.
(function _initAudioUnlock() {
    const events = ['click', 'touchstart', 'touchend', 'keydown'];
    function unlock() {
        // Create context during gesture → starts 'running' immediately
        if (!audioContext)
            audioContext = new (window.AudioContext || webkitAudioContext);
        if (audioContext.state === 'suspended')
            audioContext.resume();

        // iOS Safari requires an actual buffer play to fully unlock
        try {
            const b = audioContext.createBuffer(1, 1, 22050);
            const s = audioContext.createBufferSource();
            s.buffer = b;
            s.connect(audioContext.destination);
            s.start();
        } catch(_) {}

        // Once running, remove all listeners
        if (audioContext.state === 'running') {
            events.forEach(e => document.removeEventListener(e, unlock, true));
        }
    }
    events.forEach(e => document.addEventListener(e, unlock, true));
})();

// ===================
// Music
// ===================
let gameMusic;
let musicVolumeCurrent = 0.3;

// === Level state ===
let levelTiles = vec2(1, 1);
let levelSize = vec2(1, 1);
let currentLevelData;
let currentLevelIndex = 0;

let player, turrets = [];
let boss = null;
let restarting = false;
let levelTransitioning = false;
let playerIsMoving = false;
let predefinedLevelsBeaten = false;  // true once the boss level is cleared
let proceduralDifficulty = 1;        // increases each procedural level

// === Tutorial state ===
let tutorialPhase = -1;           // -1 = not in tutorial, 0–3 = active step
let tutorialMoveTimer = 0;        // consecutive movement seconds (step 0)
let tutorialDodgeCount = 0;       // bullets dodged (step 2)
let tutorialShootDisabled = false;
let tutorialTextAlpha = 0;
let tutorialReady = false;
let tutorialSurviveTimer = 0;

// === Screen flash (death / level transition) ===
let screenFlashAlpha = 0;  // white flash overlay, fades each frame

// === Timers ===
let reloadTimer = 0;  // manual counter, affected by timeScale
let levelTransitionTimer = new Timer;

// === Bullet trail system ===
let bulletTrails = [];

// === Player burst queue ===
let burstQueue = 0;        // remaining burst bullets to fire
let burstTimer = 0;        // countdown to next burst bullet
let burstDir   = vec2();   // cached direction for the burst sequence

function emitShotParticles(pos, dir, offset) {
    const p = PARTICLES.shot;
    const o = offset ?? p.offset;
    const hasDir = dir && dir.length() > 0.001;
    const normDir = hasDir ? dir.normalize() : vec2(1, 0);
    const emitPos = pos.add(normDir.scale(o));
    new ParticleEmitter(
        emitPos, normDir.angle(),
        p.emitSize, p.emitTime, p.emitRate, p.emitConeAngle,
        p.tileIndex, p.tileSize,
        p.colorStartA, p.colorStartB, p.colorEndA, p.colorEndB,
        p.particleTime, p.sizeStart, p.sizeEnd, p.speed,
        p.angleSpeed, p.damping, p.angleDamping, p.gravityScale,
        p.particleCone, p.fadeRate, p.randomness,
        p.collideTiles, p.additive
    );
}

function playShotSound(volume = 1) {
    const pitch = lerp(clamp(timeScale, 0.18, 1), 0.65, 1);
    new Sound([2,.03,340,,,.13,1,.5,-7,-19.2,,,.06,,,,.15,.8,.05,,500]).play(undefined, volume, pitch, 1);
}

function playEnemyKillSound() {
    new Sound([.02,2,277,,.11,.2,1,,.1,,2050,.08,1,,,,.07,2,.03]).play();
}

function playPlayerDeathSound() {
    new Sound([.5,0,474,.03,.22,.19,1,.4,,,-181,.11,.03,,,,,.88,.28,,103]).play();
}

function emitDeathParticles(pos) {
    const p = PARTICLES.death;
    new ParticleEmitter(
        pos.copy(), 0,
        p.emitSize, p.emitTime, p.emitRate, p.emitConeAngle,
        p.tileIndex, p.tileSize,
        p.colorStartA, p.colorStartB, p.colorEndA, p.colorEndB,
        p.particleTime, p.sizeStart, p.sizeEnd, p.speed,
        p.angleSpeed, p.damping, p.angleDamping, p.gravityScale,
        p.particleCone, p.fadeRate, p.randomness,
        p.collideTiles, p.additive
    );
}

// === Time scale (Superhot) ===
let timeScale = 1;

// === Game State ===
// 'intro' → 'title' → 'playing' → 'powerup' → 'playing' …
let gameState = 'intro';
let stateTime = 0;

// ===================
// Level Loading
// ===================
/**
 * Load a level by index (predefined) or from a raw level definition object (procedural).
 * @param {number|object} indexOrDef - predefined level index, or a level def with { id, name, map }
 */
function loadLevel(indexOrDef) {
    if (typeof indexOrDef === 'object' && indexOrDef !== null) {
        // Procedural level definition passed directly
        currentLevelData = parseLevelDefinition(indexOrDef);
    } else {
        const maxIndex = LEVEL_DEFINITIONS.length - 1;
        currentLevelIndex = clamp(indexOrDef, 0, maxIndex) | 0;
        currentLevelData = parseLevelDefinition(LEVEL_DEFINITIONS[currentLevelIndex]);
    }

    engineObjectsDestroy();

    levelTiles = vec2(currentLevelData.width, currentLevelData.height);
    levelSize = currentLevelData.size.copy();

    initTileCollision(levelTiles);
    for (const wallTile of currentLevelData.walls)
        setTileCollisionData(wallTile, 1);

    player = new Player(currentLevelData.playerSpawn);
    cameraPos = player.pos.copy();
    turrets = currentLevelData.enemies.map(e => new Turret(e.pos));

    // Boss level
    boss = null;
    if (currentLevelData.bossSpawn)
        boss = new Boss(currentLevelData.bossSpawn);

    resetInputState();
    bulletTrails = [];
    timeScale = 1;
    reloadTimer = 0;
    burstQueue = 0;
    burstTimer = 0;
    restarting = false;
    levelTransitioning = false;
    levelTransitionTimer.unset();
}

// ===================
// Tutorial Step Loader
// ===================
const TUTORIAL_TEXTS = [
    'Left stick to move',
    'Right stick to aim\nRelease to fire',
    'Time moves only when you move',
    'Destroy Goons',
];

function loadTutorialStep(step) {
    tutorialPhase = step;
    tutorialMoveTimer = 0;
    tutorialDodgeCount = 0;
    tutorialShootDisabled = (step === 0 || step === 2);
    tutorialTextAlpha = 0;
    tutorialSurviveTimer = 0;
    screenFlashAlpha = 0;
    tutorialReady = true;

    const def = TUTORIAL_LEVELS[step];
    const parsed = parseLevelDefinition(def);

    engineObjectsDestroy();
    levelTiles = vec2(parsed.width, parsed.height);
    levelSize = parsed.size.copy();
    initTileCollision(levelTiles);
    for (const wallTile of parsed.walls)
        setTileCollisionData(wallTile, 1);

    player = new Player(parsed.playerSpawn);
    cameraPos = player.pos.copy();

    // Step 1 uses DummyTurret (doesn't fire, stationary); steps 2 & 3 use real Turret
    if (step === 1) {
        turrets = parsed.enemies.map(e => new DummyTurret(e.pos));
    } else {
        turrets = parsed.enemies.map(e => new Turret(e.pos));
    }

    // Step 2: stationary, 1.5× fire rate, normal-speed bullets, fire immediately
    if (step === 2) {
        for (const t of turrets) {
            t.waypoint = null;
            t.repathTimer = Infinity;        // never repath → stationary
            t.fireInterval = GFX.turret.fireRate / 1.5;
            t.fireCooldown = 0;              // fire on first frame
        }
    }

    boss = null;
    currentLevelData = parsed;
    resetInputState();
    bulletTrails = [];
    timeScale = 1;
    reloadTimer = 0;
    burstQueue = 0;
    burstTimer = 0;
    restarting = false;
    levelTransitioning = false;
    levelTransitionTimer.unset();
}

function advanceTutorial() {
    const next = tutorialPhase + 1;
    if (next < TUTORIAL_LEVELS.length) {
        loadTutorialStep(next);
    } else {
        // Tutorial complete — show first powerup, then level 0
        tutorialPhase = -1;
        tutorialShootDisabled = false;
        powerupPendingLevel = 0;
        preparePowerupChoices(0);
        gameState = 'powerup';
        stateTime = 0;
    }
}

function startGame() {
    gameState = 'playing';
    stateTime = 0;
    resetBuffs();
    predefinedLevelsBeaten = false;
    proceduralDifficulty = 1;
    // Begin with tutorial
    loadTutorialStep(0);

    // Start background music (must be triggered by user gesture)
    if (gameMusic) {
        gameMusic.play();
    }
}

// ===================
// Init
// ===================
async function gameInit() {
    canvasFixedSize = ENGINE.canvasSize;
    cameraScale = ENGINE.cameraScale;
    fontDefault = ENGINE.font;
    initTouchInput();

    gameMusic = new Music(MUSIC_FILE);
}

// ===================
// Update
// ===================
function gameUpdate() {
    stateTime += timeDelta;

    if (gameState === 'intro')   { updateIntro();   return; }
    if (gameState === 'title')   { updateTitle();    return; }
    if (gameState === 'powerup') { updatePowerup();  return; }

    // === Screen flash fade ===
    if (screenFlashAlpha > 0)
        screenFlashAlpha = max(0, screenFlashAlpha - timeDelta * 3.5);

    // === Gameplay ===
    if (restarting || !player) return;
    turrets = turrets.filter(t => !t.destroyed);

    // === Tutorial update ===
    if (tutorialPhase >= 0) {
        // Fade in tutorial text
        if (tutorialTextAlpha < 1)
            tutorialTextAlpha = min(1, tutorialTextAlpha + timeDelta * 2);
    }

    // Level transition: advance when all enemies + boss destroyed
    const bossAlive = boss && !boss.destroyed;
    if (!turrets.length && !bossAlive) {
        // Tutorial steps 1 & 3: enemy death IS the pass condition
        if (tutorialPhase === 1 || tutorialPhase === 3) {
            if (!levelTransitioning) {
                levelTransitioning = true;
                screenFlashAlpha = 1;
                levelTransitionTimer.set(0.35);
            }
            if (levelTransitionTimer.elapsed()) { advanceTutorial(); }
            return;
        }
        // Normal level transition (skip for tutorial steps 0 & 2 which have no/don't-clear enemies)
        if (tutorialPhase < 0) {
        if (!levelTransitioning) {
            levelTransitioning = true;
            screenFlashAlpha = 1;
            levelTransitionTimer.set(GAMEPLAY.levelTransitionDelay);
        }
        if (levelTransitionTimer.elapsed()) {
            // Check if we just beat the last predefined level (boss level)
            const isLastPredefined = currentLevelIndex === LEVEL_DEFINITIONS.length - 1;
            if (isLastPredefined) predefinedLevelsBeaten = true;

            if (predefinedLevelsBeaten) {
                // After boss: generate procedural levels
                const procLevel = generateProceduralLevel(proceduralDifficulty);
                proceduralDifficulty++;
                loadLevel(procLevel);
            } else {
                const nextLevel = currentLevelIndex + 1;
                const tier = currentLevelIndex + 1;  // tier 0 after tutorial, tier 1 after level 1…
                if (tier < POWERUP_TIERS.length) {
                    // Show powerup selection screen
                    powerupPendingLevel = nextLevel;
                    preparePowerupChoices(tier);
                    gameState = 'powerup';
                    stateTime = 0;
                } else {
                    loadLevel(nextLevel);
                }
            }
        }
            return;
        } // end if (tutorialPhase < 0)
    }

    // === Desktop mouse/keyboard fallback (disabled on touch devices) ===
    if (!isTouchDevice && joystickTouchId < 0 && aimTouchId < 0) {
        if (mouseWasPressed(0)) {
            joystickActive = true;
            joystickOrigin = mousePosScreen.copy();
            joystickKnob   = mousePosScreen.copy();
            joystickDir    = vec2();
            joystickMag    = 0;
        }
        if (joystickActive && mouseIsDown(0))
            updateJoystickFromScreenPos(mousePosScreen);
        if (mouseWasReleased(0)) {
            joystickActive = false;
            joystickMag    = 0;
        }
    }
    if (keyWasPressed(32) || keyWasPressed(88))
        shootPressed = true;

    // === Apply move joystick to player velocity ===
    if (joystickMag > 0) {
        const worldDir = vec2(joystickDir.x, -joystickDir.y);
        const targetVel = worldDir.scale(player.speed * joystickMag);
        const vs = GFX.player.velSmoothing;
        player.velocity = player.velocity.scale(vs).add(targetVel.scale(1 - vs));
    }

    // === Apply aim joystick to facing ===
    if (aimMag > 0) {
        const worldAim = vec2(aimDir.x, -aimDir.y);
        if (worldAim.length() > 0.001) player.facing = worldAim;
    }

    // Superhot time scale
    const moving = player.velocity.length() > GAMEPLAY.moveThreshold;
    playerIsMoving = moving;
    timeScale = moving ? 1 : getEffectiveSlowScale();
    // Tutorial step 1: no time dilation
    if (tutorialPhase === 1) timeScale = 1;

    // === Tutorial step-specific logic ===
    if (tutorialPhase === 0) {
        // Once transition started, always complete it even if player stops moving
        if (levelTransitioning) {
            if (levelTransitionTimer.elapsed()) advanceTutorial();
            return;
        }
        if (moving) tutorialMoveTimer += timeDelta;
        else        tutorialMoveTimer = 0;
        if (tutorialMoveTimer >= 1) {
            levelTransitioning = true;
            screenFlashAlpha = 1;
            levelTransitionTimer.set(0.35);
            return;
        }
    }
    if (tutorialPhase === 2) {
        // Make turrets stationary each frame (override any walk attempts)
        for (const t of turrets) { t.waypoint = null; t.repathTimer = Infinity; }
        // Pass after surviving 5 seconds once text reveal is done
        if (tutorialReady) {
            tutorialSurviveTimer += timeDelta * timeScale;
            if (tutorialSurviveTimer >= 2.5) {
                if (!levelTransitioning) {
                    levelTransitioning = true;
                    screenFlashAlpha = 1;
                    levelTransitionTimer.set(0.35);
                }
                if (levelTransitionTimer.elapsed()) advanceTutorial();
                return;
            }
        }
    }
    // Block shooting during tutorial step 2
    if (tutorialShootDisabled) shootPressed = false;

    // Dynamic music volume: softer when stationary, full when moving
    if (gameMusic) {
        const targetVol = moving ? 0.6 : 0.075;
        musicVolumeCurrent = lerp(0.05, musicVolumeCurrent, targetVol);
        gameMusic.setVolume(musicVolumeCurrent);
    }

    // === Reload (affected by timeScale) ===
    if (reloadTimer > 0)
        reloadTimer = max(0, reloadTimer - timeDelta * timeScale);

    // === Player burst queue processing ===
    if (burstQueue > 0) {
        burstTimer -= timeDelta * timeScale;
        if (burstTimer <= 0) {
            burstTimer = SHOOTING.burstDelay;
            burstQueue--;
            firePlayerBullet(player.gunTip, burstDir);
            playShotSound();
        }
    }

    // === Shooting ===
    const canShoot = reloadTimer <= 0 && burstQueue <= 0;
    if (shootPressed && canShoot) {
        reloadTimer = getEffectiveReloadTime();
        const shootDir = player.facing.length() ? player.facing : vec2(1, 0);
        const origin = player.gunTip;
        if (activeBuffs.buckshot) {
            const spread = SHOOTING.buckshotSpread;
            [shootDir,
             shootDir.rotate(spread),
             shootDir.rotate(-spread)
            ].forEach(d => firePlayerBullet(origin, d));
            playShotSound();
        } else if (activeBuffs.burst) {
            firePlayerBullet(origin, shootDir);
            playShotSound();
            burstDir = shootDir;
            burstQueue = SHOOTING.burstCount - 1;
            burstTimer = SHOOTING.burstDelay;
        } else {
            firePlayerBullet(origin, shootDir);
            playShotSound();
        }
    }
    shootPressed = false;
}

function gameUpdatePost() {
    if (gameState !== 'playing' || !player) return;

    // Smooth camera follow
    const smoothing = GAMEPLAY.cameraSmoothing;
    const target = player.pos;
    cameraPos = cameraPos.add(target.subtract(cameraPos).scale(smoothing));

    // Clamp so the camera never shows outside the level bounds.
    // Use mainCanvasSize (actual rendered canvas) for the viewport dimensions.
    const halfScreenW = mainCanvasSize.x / cameraScale * 0.5;
    const halfScreenH = mainCanvasSize.y / cameraScale * 0.5;

    // If the level is smaller than the viewport on an axis, just center it
    if (levelSize.x <= halfScreenW * 2)
        cameraPos.x = levelSize.x * 0.5;
    else
        cameraPos.x = clamp(cameraPos.x, halfScreenW, levelSize.x - halfScreenW);

    if (levelSize.y <= halfScreenH * 2)
        cameraPos.y = levelSize.y * 0.5;
    else
        cameraPos.y = clamp(cameraPos.y, halfScreenH, levelSize.y - halfScreenH);
}

// ===================
// Render
// ===================
function gameRender() {
    if (gameState !== 'playing') return;

    // Tile background and wall pass (spritesheet tiles)
    const tt = currentLevelData.tileTypes;
    for (let x = 0; x < levelTiles.x; x++)
    for (let y = 0; y < levelTiles.y; y++)
        drawTile(vec2(x + .5, y + .5), vec2(1), tt[x][y] + 8, vec2(16));

    // Dotted facing indicator (starts from gun tip, aligned with gun direction)
    // Hide when player has no gun (tutorial steps 0 & 2)
    if (player && tutorialPhase !== 0 && tutorialPhase !== 2) {
        const f = GFX.player.facing;
        const dir = player.aimDir;     // same direction the gun points
        const origin = player.gunTip;  // starts at barrel tip
        let d = 0;
        while (d < f.reach) {
            const a = origin.add(dir.scale(d));
            const b = origin.add(dir.scale(Math.min(d + f.dotLen, f.reach)));
            const alpha = 1 - d / f.reach;
            drawLine(a, b, f.width, GFX.player.color.scale(1, alpha * f.alpha));
            d += f.dotLen + f.gapLen;
        }
    }

    if (!player) return;

    // Turret aiming guides
    for (const turret of turrets) {
        const dir = player.pos.subtract(turret.pos);
        if (dir.length() <= 0.001) continue;
        drawLine(turret.pos, turret.pos.add(dir.normalize(GFX.turret.guideLen)), GFX.turret.guideColor);
    }

    // Bullet trails
    const tw = GFX.bullet.trail.width;
    const tf = GFX.bullet.trail.fade;
    for (let i = bulletTrails.length - 1; i >= 0; i--) {
        const trail = bulletTrails[i];
        let alive = false;
        for (let j = 1; j < trail.points.length; j++) {
            const p0 = trail.points[j - 1];
            const p1 = trail.points[j];
            if (p1.alpha <= 0) continue;
            alive = true;
            drawLine(p0.pos, p1.pos, tw, trail.color.scale(1, p1.alpha));
        }
        for (const p of trail.points)
            p.alpha -= timeDelta * tf;
        if (!alive) bulletTrails.splice(i, 1);
    }
}

function gameRenderPost() {
    if (gameState === 'intro')   { renderIntro();   return; }
    if (gameState === 'title')   { renderTitle();   return; }
    if (gameState === 'powerup') { renderPowerup();  return; }
    renderHud();
}

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, 't.png');