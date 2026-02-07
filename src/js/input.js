// ===================
// Input — Joystick + Touch
// ===================
// Config lives in INPUT (consts.js)

// === Virtual Joystick State ===
let joystickActive  = false;
let joystickOrigin  = vec2();
let joystickKnob    = vec2();
let joystickDir     = vec2();
let joystickMag     = 0;

// === Aim Joystick State (right thumb) ===
let aimActive  = false;
let aimOrigin  = vec2();
let aimKnob    = vec2();
let aimDir     = vec2();
let aimMag     = 0;

// === Multi-touch tracking ===
let joystickTouchId = -1;  // left stick (move)
let aimTouchId      = -1;  // right stick (aim)
let shootPressed    = false;

// Helper: compute joystick direction & magnitude from a screen-space position
function updateJoystickFromScreenPos(sp) {
    const delta = sp.subtract(joystickOrigin);
    const dist  = delta.length();
    if (dist > INPUT.joystickDead) {
        joystickDir = delta.normalize();
        joystickMag = clamp((dist - INPUT.joystickDead) / (INPUT.joystickRadius - INPUT.joystickDead), 0, 1);
    } else {
        joystickDir = vec2();
        joystickMag = 0;
    }
    joystickKnob = joystickOrigin.add(
        dist > 0.001 ? delta.normalize(Math.min(dist, INPUT.joystickRadius)) : vec2()
    );
}

// Helper: compute aim joystick direction & magnitude
function updateAimFromScreenPos(sp) {
    const delta = sp.subtract(aimOrigin);
    const dist  = delta.length();
    if (dist > INPUT.joystickDead) {
        aimDir = delta.normalize();
        aimMag = clamp((dist - INPUT.joystickDead) / (INPUT.joystickRadius - INPUT.joystickDead), 0, 1);
    } else {
        aimDir = vec2();
        aimMag = 0;
    }
    aimKnob = aimOrigin.add(
        dist > 0.001 ? delta.normalize(Math.min(dist, INPUT.joystickRadius)) : vec2()
    );
}

function resetInputState() {
    joystickActive = false;
    joystickMag = 0;
    joystickTouchId = -1;
    aimActive = false;
    aimMag = 0;
    aimTouchId = -1;
    shootPressed = false;
    reloadTimer = 0;
    burstQueue = 0;
    burstTimer = 0;
}

// Install raw multi-touch handlers (call once from gameInit)
function initTouchInput() {
    const getScreenPos = (t) => {
        const r = mainCanvas.getBoundingClientRect();
        return vec2(
            (t.clientX - r.left) * mainCanvas.width  / r.width,
            (t.clientY - r.top)  * mainCanvas.height / r.height
        );
    };
    const isRightHalf = (sp) => sp.x > mainCanvasSize.x * 0.5;

    document.addEventListener('touchstart', (e) => {
        // Title screen: any tap starts the game
        if (gameState === 'title') { startGame(); return; }
        // Powerup screen: forward tap position for card selection
        if (gameState === 'powerup') {
            for (const t of e.changedTouches) {
                const sp = getScreenPos(t);
                handlePowerupTap(sp.x, sp.y);
            }
            return;
        }
        if (gameState !== 'playing') return;
        for (const t of e.changedTouches) {
            const sp = getScreenPos(t);
            if (isRightHalf(sp) && aimTouchId < 0) {
                aimTouchId = t.identifier;
                aimActive  = true;
                aimOrigin  = sp;
                aimKnob    = sp;
                aimDir     = vec2();
                aimMag     = 0;
            } else if (!isRightHalf(sp) && joystickTouchId < 0) {
                joystickTouchId = t.identifier;
                joystickActive  = true;
                joystickOrigin  = sp;
                joystickKnob    = sp;
                joystickDir     = vec2();
                joystickMag     = 0;
            }
        }
    }, {passive: true});

    document.addEventListener('touchmove', (e) => {
        for (const t of e.changedTouches) {
            if (t.identifier === joystickTouchId)
                updateJoystickFromScreenPos(getScreenPos(t));
            if (t.identifier === aimTouchId)
                updateAimFromScreenPos(getScreenPos(t));
        }
    }, {passive: true});

    document.addEventListener('touchend', (e) => {
        for (const t of e.changedTouches) {
            if (t.identifier === joystickTouchId) {
                joystickTouchId = -1;
                joystickActive  = false;
                joystickMag     = 0;
            }
            if (t.identifier === aimTouchId) {
                if (aimMag > 0) shootPressed = true;
                aimTouchId = -1;
                aimActive  = false;
                aimMag     = 0;
            }
        }
    }, {passive: true});

    document.addEventListener('touchcancel', (e) => {
        for (const t of e.changedTouches) {
            if (t.identifier === joystickTouchId) {
                joystickTouchId = -1;
                joystickActive  = false;
                joystickMag     = 0;
            }
            if (t.identifier === aimTouchId) {
                aimTouchId = -1;
                aimActive  = false;
                aimMag     = 0;
            }
        }
    }, {passive: true});
}